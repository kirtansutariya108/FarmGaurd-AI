import numpy as np
from PIL import Image
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.core.exceptions import ServiceUnavailableException
from app.ml.disease.model_loader import disease_model_manager
from app.schemas.disease import DiseasePredictionItem, DiseaseStatusType


def preprocess_image(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """Preprocess PIL image for MobileNetV2 inference."""
    resized = image.resize(target_size)
    img_array = np.array(resized, dtype=np.float32)
    # Scale to [0, 1]
    img_array = img_array / 255.0
    # Add batch dimension
    img_batch = np.expand_dims(img_array, axis=0)
    return img_batch


def predict_disease(
    image: Image.Image,
    crop_name: str = "Tomato",
    demo_scenario: str = "earlyBlight"
) -> Dict[str, Any]:
    """
    Run disease inference on the validated leaf image.
    Uses trained model if present, or deterministic demo pipeline when DEMO_MODE is true.
    """
    manager = disease_model_manager

    if manager.is_loaded and manager.model is not None:
        try:
            processed = preprocess_image(image)
            raw_preds = manager.model.predict(processed)[0]  # Softmax output vector
            top_indices = np.argsort(raw_preds)[::-1][:3]

            top_predictions: List[DiseasePredictionItem] = []
            for idx in top_indices:
                raw_label = manager.labels.get(int(idx), f"Class_{idx}")
                # Clean label e.g. "Tomato_Early_Blight" -> "Early Blight"
                clean_name = raw_label.split("_", 1)[-1].replace("_", " ") if "_" in raw_label else raw_label
                conf_pct = round(float(raw_preds[idx]) * 100.0, 1)
                top_predictions.append(
                    DiseasePredictionItem(
                        diseaseName=clean_name,
                        confidence=conf_pct,
                        description=f"Pathology classification for {clean_name}."
                    )
                )

            top_pred = top_predictions[0]
            top_conf = top_pred.confidence / 100.0

            if top_conf < settings.DISEASE_CONFIDENCE_THRESHOLD:
                status: DiseaseStatusType = "Uncertain"
                is_low_confidence = True
                is_healthy = False
                primary_condition = "Uncertain Classification"
                visual_findings = "The image does not contain sufficient contrast or characteristic lesions for a confident diagnostic classification."
                next_steps = [
                    "Retake photo under uniform daylight focusing directly on affected leaf area.",
                    "Ensure leaf lamina fills at least 60% of frame.",
                    "Avoid glare and heavy shadows."
                ]
            else:
                is_low_confidence = False
                primary_condition = top_pred.diseaseName
                is_healthy = "Healthy" in primary_condition
                status = "Healthy-looking" if is_healthy else "Needs Attention"
                
                if is_healthy:
                    visual_findings = "Normal chlorophyll distribution and healthy canopy vigor observed."
                    next_steps = [
                        "Maintain current irrigation and fertigation schedule.",
                        "Conduct routine scout scans every 5-7 days."
                    ]
                else:
                    visual_findings = f"Visual indications characteristic of {primary_condition} observed on leaf surface."
                    next_steps = [
                        "Prune infected lower foliage with disinfected tools.",
                        "Avoid wetting foliage during irrigation to prevent fungal spread.",
                        "Consult local agricultural advisor if symptoms persist."
                    ]

            return {
                "crop": crop_name,
                "primary_condition": primary_condition,
                "confidence": top_pred.confidence if not is_low_confidence else round(top_conf * 100, 1),
                "status": status,
                "is_low_confidence": is_low_confidence,
                "is_healthy": is_healthy,
                "visual_findings": visual_findings,
                "next_steps": next_steps,
                "top_predictions": top_predictions,
                "model_version": manager.model_version
            }

        except Exception as e:
            if not settings.DEMO_MODE:
                raise ServiceUnavailableException("Disease Predictor", f"Inference execution failed: {str(e)}")

    if not settings.DEMO_MODE:
        raise ServiceUnavailableException(
            "Disease Model",
            "Trained MobileNetV2 model weights are not loaded. Place model at configured path or enable DEMO_MODE."
        )

    # Deterministic Demo Mode
    if demo_scenario == "healthy" or crop_name == "Potato":
        top_preds = [
            DiseasePredictionItem(diseaseName="Healthy Foliage", confidence=95.0, description="Clean leaf lamina with uniform green pigmentation."),
            DiseasePredictionItem(diseaseName="Early Blight", confidence=3.0, description="Minor surface discoloration."),
            DiseasePredictionItem(diseaseName="Septoria Leaf Spot", confidence=2.0, description="Small dark circular spots.")
        ]
        return {
            "crop": crop_name,
            "primary_condition": "Healthy Foliage",
            "confidence": 95.0,
            "status": "Healthy-looking",
            "is_low_confidence": False,
            "is_healthy": True,
            "visual_findings": "Clean leaf lamina with uniform green pigmentation. No necrotic halos or lesions.",
            "next_steps": [
                "Maintain current drip irrigation and balanced nitrogen-potassium fertigation.",
                "Conduct routine scout scans every 5-7 days."
            ],
            "top_predictions": top_preds,
            "model_version": f"{manager.model_version}-demo"
        }
    elif demo_scenario == "lowConfidence":
        top_preds = [
            DiseasePredictionItem(diseaseName="Uncertain", confidence=42.0, description="Inconclusive foliar markings."),
            DiseasePredictionItem(diseaseName="Early Blight", confidence=31.0, description="Possible early lesion."),
            DiseasePredictionItem(diseaseName="Target Spot", confidence=27.0, description="Surface blemishes.")
        ]
        return {
            "crop": crop_name,
            "primary_condition": "Inconclusive Foliar Anomaly",
            "confidence": 42.0,
            "status": "Uncertain",
            "is_low_confidence": True,
            "is_healthy": False,
            "visual_findings": "The image does not contain enough information for a confident classification. Poor lighting or distance detected.",
            "next_steps": [
                "Retake photo under uniform daylight closer to the leaf surface.",
                "Ensure leaf surface is centered and in focus.",
                "Inspect underside of leaf for pest activity."
            ],
            "top_predictions": top_preds,
            "model_version": f"{manager.model_version}-demo"
        }
    else:
        # Early Blight demo
        top_preds = [
            DiseasePredictionItem(diseaseName="Early Blight", confidence=91.0, description="Alternaria solani fungal infection with concentric bullseye spots."),
            DiseasePredictionItem(diseaseName="Late Blight", confidence=6.0, description="Phytophthora infestans water-mold causing rapid foliar collapse."),
            DiseasePredictionItem(diseaseName="Healthy Foliage", confidence=3.0, description="Normal chlorophyll distribution and leaf architecture.")
        ]
        return {
            "crop": crop_name,
            "primary_condition": "Early Blight",
            "confidence": 91.0,
            "status": "Needs Attention",
            "is_low_confidence": False,
            "is_healthy": False,
            "visual_findings": "Concentric ring lesions and brownish necrotic spots visible on lower leaf margin.",
            "next_steps": [
                "Prune infected lower foliage with disinfected shears.",
                "Avoid overhead irrigation to minimize leaf moisture retention.",
                "Apply copper-based protective fungicide if lesions spread."
            ],
            "top_predictions": top_preds,
            "model_version": f"{manager.model_version}-demo"
        }
