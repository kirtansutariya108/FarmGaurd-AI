import { DiseaseResult, DiseaseStatus, DiseasePrediction } from '../types/disease';

export interface PredictionApiResponse {
  success?: boolean;
  status?: 'prediction' | 'uncertain';
  disease?: string | null;
  suggested_condition?: string;
  confidence: number;
  threshold_pct?: number;
  explanation?: string;
  message?: string;
  probabilities?: Record<string, number>;
  error?: string;
  detail?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const RICE_DISEASE_METADATA: Record<string, {
  status: DiseaseStatus;
  isHealthy: boolean;
  findings: string;
  nextSteps: string[];
  description: string;
}> = {
  'Bacterial leaf blight': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Visual lesions observed along leaf tips and margins with wavy margins and yellowish-to-gray discoloration, characteristic of Xanthomonas oryzae (Bacterial Leaf Blight).',
    nextSteps: [
      'Drain excess standing water temporarily to lower relative humidity in the field.',
      'Avoid excess nitrogen application; ensure balanced potash (potassium) fertilization.',
      'Clean agricultural implements to prevent spreading bacteria across adjacent plots.',
      'Consult local agricultural extension or apply recommended bio-bactericide if threshold is exceeded.'
    ],
    description: 'Bacterial infection characterized by water-soaked to yellowish stripes along leaf margins.'
  },
  'Brown spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Small circular to oval brown necrotic spots with yellowish halos scattered across the leaf blade, consistent with Bipolaris oryzae (Brown Spot).',
    nextSteps: [
      'Ensure balanced soil nutrition with adequate potassium, silica, and micronutrients.',
      'Maintain consistent paddy soil moisture; avoid severe dry-wet soil stress.',
      'Remove heavily infested stubble during post-harvest land preparation.',
      'Inspect field regularly over the next 48 to 72 hours for spot expansion.'
    ],
    description: 'Fungal foliar disease causing oval or cylindrical brown lesions with yellow halos.'
  },
  'Leaf smut': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Slightly raised, angular black spots or pustules scattered across the rice leaf surface, consistent with Entyloma oryzae (Leaf Smut).',
    nextSteps: [
      'Ensure adequate plant spacing to facilitate sunlight penetration and canopy aeration.',
      'Avoid over-fertilization with nitrogenous fertilizers.',
      'Monitor flag leaves during heading and grain filling stages.',
      'Apply protective foliar sprays if disease pressure increases significantly.'
    ],
    description: 'Fungal disease producing small, angular, lead-black sori on mature foliage.'
  },
  'Healthy': {
    status: 'Healthy-looking',
    isHealthy: true,
    findings: 'Vibrant green chlorophyll pigmentation and uniform rice leaf blade architecture. No significant pathogen lesions or necrotic spots detected.',
    nextSteps: [
      'Continue routine monitoring and standard irrigation management.',
      'Maintain nutrient application schedule aligned with the current growth stage.',
      'Record leaf health scans once every 5 to 7 days.'
    ],
    description: 'Normal chlorophyll levels and healthy vegetative leaf foliage.'
  }
};

export const diseaseService = {
  /**
   * Uploads leaf image to FastAPI ML backend at POST /predict with multipart/form-data ("file")
   */
  async predictLeafDisease(
    imageFile: File,
    options: { cropName?: string; farmId?: string; farmName?: string } = {}
  ): Promise<DiseaseResult> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    const data: PredictionApiResponse = await response.json();

    if (data.success === false && data.error) {
      throw new Error(data.error);
    }

    const isUncertain = data.status === 'uncertain' || !data.disease;
    const diseaseName = data.disease || data.suggested_condition || 'Inconclusive Foliar Anomaly';
    const confidence = typeof data.confidence === 'number' ? data.confidence : parseFloat(String(data.confidence)) || 0;

    // Build topPredictions array from probabilities if provided by model
    let topPredictions: DiseasePrediction[] = [];
    if (data.probabilities && Object.keys(data.probabilities).length > 0) {
      topPredictions = Object.entries(data.probabilities)
        .map(([name, prob]) => ({
          diseaseName: name,
          confidence: Math.round(prob),
          description: RICE_DISEASE_METADATA[name]?.description || `Condition: ${name}`
        }))
        .sort((a, b) => b.confidence - a.confidence);
    } else {
      topPredictions = [
        {
          diseaseName,
          confidence: Math.round(confidence),
          description: RICE_DISEASE_METADATA[diseaseName]?.description || `Condition: ${diseaseName}`
        }
      ];
    }

    if (isUncertain) {
      return {
        id: `scan-${Date.now()}`,
        cropName: options.cropName || 'Rice',
        primaryCondition: 'Uncertain Diagnosis',
        confidence: Math.round(confidence * 100) / 100,
        status: 'Uncertain' as DiseaseStatus,
        isLowConfidence: true,
        isHealthy: false,
        visualFindings: data.message || `Unable to confidently identify the disease (highest model confidence is ${confidence}%, below the ${data.threshold_pct || 70}% threshold).`,
        nextSteps: [
          'Retake photo under uniform daylight focusing closely on the affected leaf area.',
          'Ensure the leaf blade fills at least 60% of the image frame.',
          'Avoid glare, motion blur, and heavy shadows.',
          'If symptoms spread, scout adjacent tillers and monitor closely.'
        ],
        topPredictions,
        scannedAt: 'Just now',
        imageUrl: URL.createObjectURL(imageFile),
        farmId: options.farmId,
        farmName: options.farmName,
      };
    }

    // Confident prediction flow
    const meta = RICE_DISEASE_METADATA[diseaseName] || {
      status: 'Needs Attention' as DiseaseStatus,
      isHealthy: false,
      findings: data.explanation || `Visual patterns corresponding to ${diseaseName} identified with a model confidence of ${confidence}%.`,
      nextSteps: [
        'Inspect surrounding crop foliage for similar symptoms.',
        'Ensure proper soil moisture and balanced nutrient supply.',
        'Consult your local agronomist or extension office for targeted treatment.'
      ],
      description: `Detected condition: ${diseaseName}.`
    };

    return {
      id: `scan-${Date.now()}`,
      cropName: options.cropName || 'Rice',
      primaryCondition: diseaseName,
      confidence: Math.round(confidence * 100) / 100,
      status: meta.status,
      isLowConfidence: false,
      isHealthy: meta.isHealthy,
      visualFindings: data.explanation || meta.findings,
      nextSteps: meta.nextSteps,
      topPredictions,
      scannedAt: 'Just now',
      imageUrl: URL.createObjectURL(imageFile),
      farmId: options.farmId,
      farmName: options.farmName,
    };
  }
};
