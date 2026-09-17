import sys
import os
import time
import json
from pathlib import Path
from typing import Dict, Any, List

sys.path.insert(0, os.path.abspath("."))

import numpy as np
from PIL import Image
import tensorflow as tf

from app.services.disease_model import PlantDiseaseModelService, BASE_DIR, MODEL_PATH, CLASS_NAMES_PATH

def audit_model_architecture():
    print("==================================================")
    print("STEP 1: MODEL PIPELINE & ARCHITECTURE AUDIT")
    print("==================================================")
    
    with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
        class_names = json.load(f)
    print(f"Class names ({len(class_names)}):", class_names)
    assert len(class_names) == 16, f"Expected 16 classes, got {len(class_names)}"

    t0 = time.time()
    model = tf.keras.models.load_model(str(MODEL_PATH))
    load_time = time.time() - t0
    print(f"Model loaded in {load_time:.3f}s from {MODEL_PATH}")
    print(f"Input shape: {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
    
    # Inspect output layer activation
    last_layer = model.layers[-1]
    activation = getattr(last_layer, "activation", None)
    act_name = getattr(activation, "__name__", str(activation))
    print(f"Last layer: {last_layer.name} ({last_layer.__class__.__name__}) | Activation: {act_name}")

    # Inspect internal preprocessing layers if any
    preprocessing_layers = [l.name for l in model.layers if "rescaling" in l.name.lower() or "normalization" in l.name.lower()]
    print(f"Internal preprocessing layers: {preprocessing_layers}")
    
    return model, class_names, load_time

def test_inference_latency_and_caching():
    print("\n==================================================")
    print("STEP 2: INFERENCE PERFORMANCE & SINGLETON CACHING")
    print("==================================================")
    service = PlantDiseaseModelService()
    dummy_img = Image.new("RGB", (224, 224), color=(45, 120, 45))
    
    # First inference
    t0 = time.time()
    res1 = service.predict(dummy_img)
    first_inf_time = (time.time() - t0) * 1000
    
    # Second inference (cached model)
    latencies = []
    for _ in range(10):
        t_start = time.time()
        service.predict(dummy_img)
        latencies.append((time.time() - t_start) * 1000)
    
    avg_latency = np.mean(latencies)
    print(f"First inference time: {first_inf_time:.2f} ms")
    print(f"Subsequent avg latency (10 runs): {avg_latency:.2f} ms (min: {min(latencies):.2f} ms, max: {max(latencies):.2f} ms)")
    return first_inf_time, avg_latency

def test_available_dataset_and_images(service: PlantDiseaseModelService, class_names: List[str]):
    print("\n==================================================")
    print("STEP 3: EVALUATION ON AVAILABLE LOCAL DATASET")
    print("==================================================")
    
    dataset_dir = Path("ai/dataset/rice_leaf_diseases")
    if not dataset_dir.exists():
        dataset_dir = Path("../ai/dataset/rice_leaf_diseases")
    
    results = []
    
    if dataset_dir.exists():
        for class_dir in dataset_dir.iterdir():
            if class_dir.is_dir():
                folder_name = class_dir.name
                # Map dataset folder to 16-class name
                expected_class = None
                if "bacterial" in folder_name.lower():
                    expected_class = "rice_bacterial_leaf_blight"
                elif "brown" in folder_name.lower():
                    expected_class = "rice_brown_spot"
                elif "smut" in folder_name.lower():
                    expected_class = "rice_leaf_blast" # or closest
                
                images = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.jpeg")) + list(class_dir.glob("*.png"))
                print(f"Found folder '{folder_name}' with {len(images)} images (mapping target: {expected_class})")
                
                for img_path in images[:15]: # sample up to 15 per class
                    try:
                        img = Image.open(img_path)
                        pred = service.predict(img)
                        results.append({
                            "file": img_path.name,
                            "folder": folder_name,
                            "expected": expected_class,
                            "predicted": pred["disease"],
                            "confidence": pred["confidence"],
                            "status": pred["status"]
                        })
                    except Exception as e:
                        print(f"Error evaluating {img_path.name}: {e}")
    else:
        print("ai/dataset/rice_leaf_diseases not found.")

    # Also test rice_test_img.jpeg if present
    rice_test = Path("backend/models/rice_test_img.jpeg")
    if not rice_test.exists():
        rice_test = Path("models/rice_test_img.jpeg")
    if rice_test.exists():
        img = Image.open(rice_test)
        pred = service.predict(img)
        print(f"Tested rice_test_img.jpeg -> Predicted: {pred['disease']} ({pred['confidence']*100:.2f}%) | Status: {pred['status']}")
        results.append({
            "file": "rice_test_img.jpeg",
            "folder": "models",
            "expected": "rice_bacterial_leaf_blight",
            "predicted": pred["disease"],
            "confidence": pred["confidence"],
            "status": pred["status"]
        })

    print(f"Total evaluated local images: {len(results)}")
    return results

def test_unsupported_and_out_of_domain_images(service: PlantDiseaseModelService):
    print("\n==================================================")
    print("STEP 4: UNSUPPORTED & OUT-OF-DOMAIN IMAGE TESTING")
    print("==================================================")
    
    synthetic_samples = {
        "pure_black_blank": Image.new("RGB", (224, 224), color=(0, 0, 0)),
        "pure_white_blank": Image.new("RGB", (224, 224), color=(255, 255, 255)),
        "pure_red_solid": Image.new("RGB", (224, 224), color=(255, 0, 0)),
        "pure_blue_sky_color": Image.new("RGB", (224, 224), color=(135, 206, 235)),
        "pure_gray_road_color": Image.new("RGB", (224, 224), color=(128, 128, 128)),
        "random_noise": Image.fromarray(np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)),
    }
    
    ood_results = {}
    for name, img in synthetic_samples.items():
        pred = service.predict(img)
        ood_results[name] = pred
        print(f"Out-of-Domain Sample '{name}':")
        print(f"  -> Predicted: {pred['disease']} (Crop: {pred['crop']})")
        print(f"  -> Confidence: {pred['confidence']*100:.2f}%")
        print(f"  -> Status: {pred['status']}")
    
    return ood_results

def main():
    model, class_names, load_time = audit_model_architecture()
    first_inf, avg_lat = test_inference_latency_and_caching()
    service = PlantDiseaseModelService()
    local_results = test_available_dataset_and_images(service, class_names)
    ood_results = test_unsupported_and_out_of_domain_images(service)
    
    # Save test results to report json
    os.makedirs("reports", exist_ok=True)
    report_data = {
        "model_name": "plant_disease_model.keras",
        "num_classes": len(class_names),
        "class_names": class_names,
        "input_shape": list(model.input_shape),
        "output_shape": list(model.output_shape),
        "load_time_seconds": round(load_time, 3),
        "first_inference_ms": round(first_inf, 2),
        "avg_subsequent_latency_ms": round(avg_lat, 2),
        "evaluated_dataset_images_count": len(local_results),
        "ood_samples_tested": len(ood_results),
        "ood_results": ood_results
    }
    
    report_path = Path("reports/model_reliability_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"\nReport written to {report_path}")

if __name__ == "__main__":
    main()
