/**
 * diseaseService.ts
 *
 * Connects the frontend scanner to the FastAPI Plant Disease AI Backend (POST /api/predict).
 * Handles multipart/form-data upload, 16-class translation to human-readable diagnoses,
 * confidence normalization, and low-confidence classification safeguards.
 */

import { DiseaseResult, DiseaseStatus, DiseasePrediction, BackendPredictResponse } from '../types/disease';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── Human-Readable Class Mapping (16 Trained Classes) ─────────────────────────

export const CLASS_NAME_MAP: Record<string, string> = {
  // Tomato (10 classes)
  'bacterial_spot': 'Bacterial Spot',
  'early_blight': 'Early Blight',
  'healthy': 'Healthy Foliage',
  'late_blight': 'Late Blight',
  'leaf_mold': 'Leaf Mold',
  'mosaic_virus': 'Mosaic Virus',
  'septoria_leaf_spot': 'Septoria Leaf Spot',
  'target_spot': 'Target Spot',
  'twospotted_spider_mite': 'Two-Spotted Spider Mite',
  'yellow_leaf_curl_virus': 'Yellow Leaf Curl Virus',

  // Rice (6 classes)
  'rice_bacterial_leaf_blight': 'Bacterial Leaf Blight',
  'rice_brown_spot': 'Brown Spot',
  'rice_healthy': 'Healthy Foliage',
  'rice_leaf_blast': 'Leaf Blast',
  'rice_leaf_scald': 'Leaf Scald',
  'rice_narrow_brown_spot': 'Narrow Brown Spot',
};

// ─── Agronomic Profiles for 16 Classes ─────────────────────────────────────────

const DISEASE_PROFILES: Record<string, {
  status: DiseaseStatus;
  isHealthy: boolean;
  findings: string;
  nextSteps: string[];
  description: string;
}> = {
  'bacterial_spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Small, water-soaked dark circular lesions with greasy appearance on leaf lamina — characteristic of Xanthomonas bacterial spot.',
    nextSteps: [
      'Avoid overhead sprinkler irrigation to minimize splash transmission.',
      'Apply preventive copper-based bactericidal spray during humid periods.',
      'Sanitize pruning tools and stakes between plant rows.',
    ],
    description: 'Bacterial foliar infection causing dark water-soaked spots with yellow halos.',
  },
  'early_blight': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Concentric target-like brown ring lesions primarily on mature lower foliage — consistent with Alternaria solani (Early Blight).',
    nextSteps: [
      'Prune infected lower leaves touching soil surface.',
      'Maintain adequate plant spacing to improve canopy ventilation.',
      'Apply protective organic or bio-fungicide if lesions spread to upper canopy.',
    ],
    description: 'Fungal disease causing concentric bullseye lesions on older leaves.',
  },
  'healthy': {
    status: 'Healthy-looking',
    isHealthy: true,
    findings: 'Vibrant chlorophyll pigmentation with uniform leaf lamina structure. No pathogen lesion patterns detected.',
    nextSteps: [
      'Maintain standard fertigation and drip irrigation schedules.',
      'Perform regular foliar scouting every 5–7 days.',
      'Record this scan as a healthy reference benchmark.',
    ],
    description: 'Normal green foliage with no active pathogen symptoms.',
  },
  'late_blight': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Large irregular dark water-soaked lesions with pale borders on leaf tips — typical of Phytophthora infestans (Late Blight).',
    nextSteps: [
      'Inspect underside of leaves for white sporulation during morning hours.',
      'Improve drainage and reduce foliage moisture duration.',
      'Isolate affected plants and apply protective fungicide if conditions remain cool and wet.',
    ],
    description: 'Aggressive water-mold pathogen causing rapid dark necrotic lesions.',
  },
  'leaf_mold': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Pale greenish-yellow spots on upper leaf surface with velvety olive-green mold on the underside — consistent with Passalora fulva.',
    nextSteps: [
      'Increase greenhouse or field air circulation and lower relative humidity.',
      'Prune lower dense foliage to promote airflow.',
      'Water plants at base to prevent wetting leaf surfaces.',
    ],
    description: 'Fungal disease thriving in high humidity with olive fungal growth on leaf undersides.',
  },
  'mosaic_virus': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Mottled light and dark green mosaic patterns with leaf puckering and distorted lamina growth — indicative of Mosaic Virus.',
    nextSteps: [
      'Rogue out and safely dispose of severely stunted or infected plants.',
      'Control aphid and whitefly vectors to prevent viral transmission.',
      'Wash hands and disinfect tools thoroughly before handling healthy crops.',
    ],
    description: 'Viral pathogen causing mottled leaf discoloration and distorted foliage.',
  },
  'septoria_leaf_spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Numerous small circular spots with gray-white centers and dark brown margins — characteristic of Septoria lycopersici.',
    nextSteps: [
      'Remove heavily spotted lower leaves and dispose away from field.',
      'Apply organic mulch to prevent rain-splash from soil.',
      'Apply copper fungicide protectant if disease pressure is high.',
    ],
    description: 'Fungal disease causing abundant small circular spots with gray centers.',
  },
  'target_spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Brown circular lesions with concentric rings and distinct margins — characteristic of Corynespora cassiicola (Target Spot).',
    nextSteps: [
      'Promote good canopy ventilation through proper staking and pruning.',
      'Avoid high nitrogen fertilization that produces excessively dense foliage.',
      'Apply approved protective fungicide if lesions escalate.',
    ],
    description: 'Fungal infection causing target-like lesions on foliage and stems.',
  },
  'twospotted_spider_mite': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Fine yellow-white stippling across upper leaf surface with delicate webbing visible on leaf undersides — typical of Tetranychus urticae.',
    nextSteps: [
      'Spray leaf undersides with strong water spray or neem oil solution.',
      'Introduce or support natural predatory mites (Phytoseiidae).',
      'Avoid broad-spectrum insecticides that kill beneficial predatory insects.',
    ],
    description: 'Microscopic arachnid pests causing yellow stippling and fine silken webs.',
  },
  'yellow_leaf_curl_virus': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Severe upward leaf curling, yellowing of leaf margins, and stunted inter-nodal growth — consistent with Tomato Yellow Leaf Curl Virus (TYLCV).',
    nextSteps: [
      'Deploy yellow sticky traps to monitor and control whitefly populations.',
      'Use insect netting or reflective mulches in vulnerable field beds.',
      'Remove heavily stunted infected plants to reduce vector acquisition source.',
    ],
    description: 'Whitefly-transmitted virus causing pronounced upward curling and yellow margins.',
  },
  'rice_bacterial_leaf_blight': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Water-soaked wavy lesions along leaf tips and margins progressing inward — consistent with Xanthomonas oryzae pv. oryzae.',
    nextSteps: [
      'Drain standing field water temporarily to lower microclimate humidity.',
      'Halt excess nitrogen top-dressing; maintain balanced potassium fertilization.',
      'Clean and sanitize agricultural implements before moving between plots.',
    ],
    description: 'Bacterial pathogen causing elongated water-soaked stripes on rice foliage.',
  },
  'rice_brown_spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Oval to circular brown necrotic spots with yellow halos across the leaf blade — characteristic of Bipolaris oryzae (Brown Spot).',
    nextSteps: [
      'Ensure balanced soil nutrition with adequate potassium, silica, and micronutrients.',
      'Maintain steady paddy moisture to prevent wet-dry soil stress cycles.',
      'Scout adjacent tillers every 48–72 hours for spot density expansion.',
    ],
    description: 'Fungal foliar disease producing oval brown spots with yellowish halos.',
  },
  'rice_healthy': {
    status: 'Healthy-looking',
    isHealthy: true,
    findings: 'Uniform chlorophyll distribution across rice leaf blade with no lesion or pustule patterns detected.',
    nextSteps: [
      'Continue standard paddy water management and fertilizer regime.',
      'Conduct routine visual scouting at 5–7 day intervals.',
      'Maintain clean bunds and irrigation channels.',
    ],
    description: 'Healthy rice foliage showing normal green vigor.',
  },
  'rice_leaf_blast': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Spindle-shaped or diamond-like lesions with gray-white centers and reddish-brown borders — consistent with Magnaporthe oryzae (Rice Blast).',
    nextSteps: [
      'Avoid excessive nitrogen fertilization that promotes lush vulnerable tissue.',
      'Maintain consistent water layer in field to buffer canopy microclimate.',
      'Apply recommended blast fungicide (e.g., tricyclazole) if lesions multiply on flag leaves.',
    ],
    description: 'Major fungal disease producing diamond/spindle-shaped lesions on rice leaves.',
  },
  'rice_leaf_scald': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Zonate patterned lesions with alternating light and dark brown bands starting from leaf tips — characteristic of Microdochium oryzae.',
    nextSteps: [
      'Ensure balanced potassium fertilization to bolster foliar resistance.',
      'Avoid applying excessive nitrogen during active tillering.',
      'Remove heavily scalded plant debris after harvest.',
    ],
    description: 'Fungal pathogen producing zonate chevron-like scalded leaf patterns.',
  },
  'rice_narrow_brown_spot': {
    status: 'Needs Attention',
    isHealthy: false,
    findings: 'Short, linear narrow brown spots parallel to leaf veins — consistent with Cercospora janseana (Narrow Brown Spot).',
    nextSteps: [
      'Maintain balanced soil potassium and nitrogen levels.',
      'Monitor heading stage tillers for spot density progression.',
      'Follow local agricultural extension guidance for seasonal foliar sprays.',
    ],
    description: 'Fungal disease forming narrow linear brown stripes parallel to veins.',
  },
};

// ─── Service API ──────────────────────────────────────────────────────────────

export const diseaseService = {
  /**
   * Uploads the leaf image to POST /api/predict using multipart/form-data.
   * Processes the backend AI prediction and returns a typed DiseaseResult.
   */
  async predictLeafDisease(
    imageFile: File,
    options: { cropName?: string; farmId?: string; farmName?: string } = {}
  ): Promise<DiseaseResult> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const endpointUrl = `${API_BASE_URL}/api/predict`;

    let response: Response;
    try {
      // Do NOT set Content-Type header manually; fetch automatically sets the multipart boundary
      response = await fetch(endpointUrl, {
        method: 'POST',
        body: formData,
      });
    } catch (networkErr: any) {
      console.error('Network error connecting to Backend AI:', networkErr);
      throw new Error('Could not connect to FarmGuard AI backend. Please ensure the backend server is running.');
    }

    if (!response.ok) {
      let errorMessage = 'Prediction failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `Server returned HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data: BackendPredictResponse = await response.json();

    // 1. Process Confidence Score (backend returns 0.0 - 1.0)
    const rawConf = data.confidence ?? 0;
    const confidencePct = rawConf <= 1.0 ? parseFloat((rawConf * 100).toFixed(2)) : parseFloat(rawConf.toFixed(2));

    // 2. Class Key & Human-Readable Mapping
    const classKey = (data.class_name || data.disease || '').toLowerCase().trim();
    const humanReadable = CLASS_NAME_MAP[classKey] || (classKey ? classKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Uncertain Condition');

    // 3. Low Confidence & Unsupported Image Guard
    const isUnsupported = data.status === 'unsupported_image';
    const isLowConfidence = isUnsupported || data.status === 'low_confidence' || confidencePct < 60;

    // 4. Determine Crop & Agronomic Profile
    const detectedCrop = isUnsupported ? 'Unknown' : (data.crop || options.cropName || (classKey.startsWith('rice_') ? 'Rice' : 'Tomato'));
    const profile = DISEASE_PROFILES[classKey] || {
      status: (isLowConfidence ? 'Uncertain' : 'Needs Attention') as DiseaseStatus,
      isHealthy: !isUnsupported && classKey.includes('healthy'),
      findings: data.message || `Visual analysis indicates pathology consistent with ${humanReadable}.`,
      nextSteps: [
        'Inspect leaf surface closely under uniform daylight.',
        'Avoid overhead watering to minimize foliar moisture duration.',
        'Consult your local agricultural extension officer for specific treatment.',
      ],
      description: `Pathology classification for ${humanReadable}.`,
    };

    // 5. Build Top Predictions
    const topPredictions: DiseasePrediction[] = isUnsupported ? [] : [
      {
        diseaseName: humanReadable,
        confidence: confidencePct,
        description: profile.description,
      },
    ];

    const localImageUrl = URL.createObjectURL(imageFile);

    return {
      id: `scan-${Date.now()}`,
      cropName: detectedCrop,
      primaryCondition: isUnsupported ? 'Unsupported Image Sample' : isLowConfidence ? 'Uncertain Classification' : humanReadable,
      confidence: isUnsupported ? 0 : confidencePct,
      status: isLowConfidence ? 'Uncertain' : profile.status,
      isLowConfidence,
      isHealthy: !isLowConfidence && profile.isHealthy,
      visualFindings: isUnsupported
        ? (data.message || 'Image not recognized as a supported crop image. Please upload a clear photo of a Tomato or Rice leaf.')
        : isLowConfidence
        ? (data.message || 'The leaf image could not be classified with high confidence. Please upload a clear, focused photo.')
        : profile.findings,
      nextSteps: isUnsupported
        ? [
            'Upload a clear, focused photograph of a Tomato or Rice leaf.',
            'Ensure natural daylight illumination without heavy glare or deep shadows.',
            'Position the camera 10–20 cm directly above the affected leaf lamina.',
          ]
        : isLowConfidence
        ? [
            'Retake photo under uniform daylight focusing directly on affected leaf.',
            'Ensure the leaf fills at least 60% of the frame.',
            'Avoid heavy glare, shadows, and blurry focus.',
          ]
        : profile.nextSteps,
      topPredictions,
      scannedAt: 'Just now',
      imageUrl: localImageUrl,
      farmId: options.farmId,
      farmName: options.farmName,
    };
  },
};
