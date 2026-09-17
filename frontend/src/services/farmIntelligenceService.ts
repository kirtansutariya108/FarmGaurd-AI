/**
 * farmIntelligenceService.ts
 *
 * Phase 5: Farmer Decision & Weather-Aware Recommendation Layer.
 * Connects to the backend FastAPI Farm Intelligence API (/api/farm-intelligence or /api/intelligence/farm-analysis).
 * Synthesizes AI disease diagnosis, confidence score, crop type, and live weather telemetry.
 * Provides complete 16-class graceful client-side fallback if backend is offline.
 */

import {
  FarmIntelligenceRequest,
  FarmIntelligenceData,
  FarmIntelligenceApiResponse,
} from '../types/intelligence';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── 16-Class Client Fallback Knowledge Base ─────────────────────────────────

interface FallbackProfile {
  displayName: string;
  crop: string;
  severity: 'low' | 'moderate' | 'high';
  summary: string;
  riskFactors: string[];
  immediateActions: string[];
  monitoringActions: string[];
  preventionActions: string[];
}

const FALLBACK_KNOWLEDGE: Record<string, FallbackProfile> = {
  // Tomato (10 classes)
  'bacterial_spot': {
    displayName: 'Bacterial Spot',
    crop: 'Tomato',
    severity: 'high',
    summary: 'A bacterial disease caused by Xanthomonas species producing water-soaked foliar lesions that turn dark brown with greasy margins.',
    riskFactors: [
      'Prolonged leaf wetness and high relative humidity (>80%)',
      'Warm ambient temperatures (24°C–30°C)',
      'Rainfall splashing dispersing bacterial ooze across plants',
      'Handling foliage while wet from rain or dew'
    ],
    immediateActions: [
      'Avoid overhead sprinkler watering to eliminate splash transmission.',
      'Sanitize pruning tools and stakes before moving between crop rows.',
      'Avoid entering or cultivating wet fields to prevent spreading bacterial exudates.',
      'Follow locally approved bactericidal disease-management practices.'
    ],
    monitoringActions: [
      'Inspect young upper foliage and developing fruit for water-soaked circular lesions.',
      'Check lower canopy leaves daily following rain or overhead moisture events.',
      'Monitor adjacent rows for early symptom emergence.'
    ],
    preventionActions: [
      'Use certified disease-free seeds and certified healthy transplants.',
      'Ensure generous plant spacing and trellising to facilitate air circulation.',
      'Practice crop rotation with non-solanaceous crops for at least 2 years.',
      'Follow locally recommended preventive cultural practices.'
    ]
  },
  'early_blight': {
    displayName: 'Early Blight',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'A common fungal disease caused by Alternaria solani characterized by concentric ring (bullseye) brown lesions starting on older lower foliage.',
    riskFactors: [
      'Alternating wet and dry weather cycles',
      'Moderate-to-warm temperatures (22°C–29°C)',
      'Extended canopy wetness from heavy dew or irrigation',
      'Nutrient-deficient or physiologically stressed plants'
    ],
    immediateActions: [
      'Prune severely affected lower leaves touching or near the soil surface.',
      'Ensure targeted base or drip irrigation to keep foliage dry.',
      'Improve plant trellising to elevate lower foliage away from damp soil.',
      'Follow locally approved foliar protective management guidance.'
    ],
    monitoringActions: [
      'Inspect lower and mid-canopy leaves for expanding concentric ring lesions.',
      'Monitor lesion progression upward through the plant canopy every 48 hours.',
      'Track yellowing chlorotic halos expanding around target lesions.'
    ],
    preventionActions: [
      'Apply organic mulch around plant bases to establish a soil-splash barrier.',
      'Maintain balanced soil nutrition, avoiding nitrogen deficiency during fruiting.',
      'Ensure adequate row spacing to encourage rapid canopy drying.',
      'Rotate tomato plots with non-host crops on a 2–3 year cycle.'
    ]
  },
  'healthy': {
    displayName: 'Healthy Foliage',
    crop: 'Tomato',
    severity: 'low',
    summary: 'Tomato foliage displays vibrant chlorophyll pigmentation and intact leaf architecture. No active pathogen lesion patterns detected.',
    riskFactors: [
      'No active disease risk factors currently identified.'
    ],
    immediateActions: [
      'Continue regular field monitoring and routine crop scouting.',
      'Maintain consistent drip irrigation and balanced crop fertigation schedules.',
      'Keep field margins and tools clean and sanitized.'
    ],
    monitoringActions: [
      'Perform routine visual foliar scouting every 5–7 days.',
      'Examine lower leaf undersides periodically for early pest or spore arrivals.',
      'Record this diagnostic scan as a healthy benchmark for future comparison.'
    ],
    preventionActions: [
      'Maintain balanced soil fertility and steady rootzone hydration.',
      'Ensure effective weed control along field borders to eliminate insect reservoirs.',
      'Sustain preventive crop hygiene practices throughout the growing cycle.'
    ]
  },
  'late_blight': {
    displayName: 'Late Blight',
    crop: 'Tomato',
    severity: 'high',
    summary: 'An aggressive water-mold disease caused by Phytophthora infestans that can spread rapidly across fields under cool, persistently wet and humid conditions.',
    riskFactors: [
      'Cool ambient temperatures (15°C–22°C)',
      'High relative humidity (>85% RH)',
      'Prolonged leaf wetness exceeding 6–8 continuous hours',
      'Frequent rainfall, dense morning fog, or heavy overcast skies'
    ],
    immediateActions: [
      'Inspect surrounding plants immediately for expanding water-soaked lesions.',
      'Remove severely affected material where appropriate and dispose of safely away from fields.',
      'Halt all overhead sprinkling immediately to reduce canopy wetness duration.',
      'Follow locally approved protective disease-management practices.'
    ],
    monitoringActions: [
      'Check leaf undersides in early morning for delicate white sporulation.',
      'Inspect stems and green fruit clusters for greasy dark-brown lesions.',
      'Recheck the entire plot thoroughly after any rain or fog event.'
    ],
    preventionActions: [
      'Avoid unnecessary foliar wetness by utilizing base or drip irrigation.',
      'Maintain wide plant spacing to maximize cross-canopy air circulation.',
      'Use certified healthy, disease-free planting stock.',
      'Follow locally recommended preventive agricultural practices ahead of rainy weather.'
    ]
  },
  'leaf_mold': {
    displayName: 'Leaf Mold',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'A fungal foliar disease caused by Passalora fulva producing pale greenish-yellow patches on upper leaf surfaces and velvety olive-brown mold on undersides.',
    riskFactors: [
      'Persistent high relative humidity (>85% RH)',
      'Moderate ambient temperatures (20°C–25°C)',
      'Poor air circulation within dense canopies or greenhouse structures',
      'Dense, overcrowded plant spacing'
    ],
    immediateActions: [
      'Prune dense lower foliage to significantly improve air movement through the canopy.',
      'Water strictly at the soil base to keep leaves dry.',
      'Increase greenhouse or field ventilation where practical.',
      'Follow locally approved management guidance.'
    ],
    monitoringActions: [
      'Inspect leaf undersides for velvety olive-green mold progression.',
      'Check middle and upper canopy foliage for newly developing yellow chlorotic patches.',
      'Track relative humidity levels in sheltered or dense canopy zones.'
    ],
    preventionActions: [
      'Maintain optimal row spacing and trellis height to enhance airflow.',
      'Avoid overhead irrigation during humid or overcast periods.',
      'Ensure active ventilation in protected structures during morning hours.',
      'Select resistant tomato varieties for future replanting cycles.'
    ]
  },
  'mosaic_virus': {
    displayName: 'Mosaic Virus',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'A viral infection (such as Tomato Mosaic Virus) causing mottled light and dark green patterns, leaf distortion, puckering, and stunted growth.',
    riskFactors: [
      'Mechanical transmission via pruning shears, tools, and plant handling',
      'Presence of sap-feeding insect vectors (aphids, thrips)',
      'Infected crop debris or reservoir weeds surrounding the field'
    ],
    immediateActions: [
      'Rogue out and safely dispose of severely stunted or infected plants to protect healthy rows.',
      'Sanitize hands, pruning tools, and stakes thoroughly with soapy water or disinfectant.',
      'Avoid handling healthy foliage immediately after touching symptomatic plants.',
      'Follow locally recommended vector-management practices.'
    ],
    monitoringActions: [
      'Watch new terminal growth for mosaic mottling or distorted strap-like leaves.',
      'Monitor aphid and vector insect populations along plant margins.',
      'Check neighbouring rows for emerging viral symptoms.'
    ],
    preventionActions: [
      'Use virus-free certified seeds and transplants.',
      'Control weed hosts around field perimeters that harbor viral pathogens.',
      'Wash and disinfect tools between handling cycles.',
      'Plant virus-resistant tomato cultivars where available.'
    ]
  },
  'septoria_leaf_spot': {
    displayName: 'Septoria Leaf Spot',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'A fungal disease caused by Septoria lycopersici producing numerous small circular spots with gray-tan centers and dark brown margins starting on lower leaves.',
    riskFactors: [
      'Extended periods of warm, wet weather (20°C–26°C)',
      'High humidity and prolonged morning dew',
      'Water splashing from soil onto lower foliage',
      'Dense canopy trapping moisture near the ground'
    ],
    immediateActions: [
      'Remove heavily spotted lower leaves and dispose of them away from the field.',
      'Avoid overhead sprinkling that causes water droplets to splash onto leaves.',
      'Improve canopy ventilation through proper staking and sucker pruning.',
      'Follow locally approved agricultural guidance.'
    ],
    monitoringActions: [
      'Monitor lower leaves closely for new small dark specks after rain events.',
      'Check whether spot progression is ascending into the middle canopy.',
      'Inspect stems and calyxes for spot development.'
    ],
    preventionActions: [
      'Apply mulch beneath plants to create a barrier against soil-splash.',
      'Rotate tomato crops with non-solanaceous species on a 2–3 year rotation.',
      'Maintain adequate spacing between rows to promote rapid drying.',
      'Clear and compost infected garden debris away from active planting zones.'
    ]
  },
  'target_spot': {
    displayName: 'Target Spot',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'A fungal disease caused by Corynespora cassiicola causing brown circular lesions with concentric rings and distinct margins on leaves, stems, and fruit.',
    riskFactors: [
      'Warm ambient temperatures (25°C–32°C)',
      'High relative humidity (>80% RH)',
      'Dense, lush vegetative canopy',
      'Frequent rainfall or overhead irrigation'
    ],
    immediateActions: [
      'Prune lower infected foliage to reduce fungal inoculum load.',
      'Ensure proper staking and canopy ventilation to accelerate drying.',
      'Switch strictly to targeted base or drip irrigation.',
      'Follow locally approved protective disease-management practices.'
    ],
    monitoringActions: [
      'Inspect both foliage and developing green fruit for target-like brown spots.',
      'Check for lesion expansion during humid spells.',
      'Scout surrounding tomato blocks every 3–4 days.'
    ],
    preventionActions: [
      'Maintain balanced fertilizer applications, avoiding excessive nitrogen.',
      'Ensure good row spacing for maximum sunlight penetration.',
      'Clear infected crop residues post-harvest.',
      'Follow regional preventive management practices.'
    ]
  },
  'twospotted_spider_mite': {
    displayName: 'Two-Spotted Spider Mite',
    crop: 'Tomato',
    severity: 'moderate',
    summary: 'An infestation of Tetranychus urticae causing fine yellow-white stippling on leaf surfaces, bronze discoloration, and fine webbing on undersides.',
    riskFactors: [
      'Hot, dry weather conditions (>30°C, <50% RH)',
      'Dusty field environments and perimeter roads',
      'Overuse of broad-spectrum insecticides killing natural predators',
      'Drought-stressed or water-deficient plants'
    ],
    immediateActions: [
      'Apply a fine water spray or approved organic horticultural wash to leaf undersides.',
      'Avoid broad-spectrum chemical sprays that destroy natural predatory mites.',
      'Maintain adequate field and soil hydration to reduce plant stress.',
      'Follow locally approved integrated pest management practices.'
    ],
    monitoringActions: [
      'Examine leaf undersides with a hand lens for active mites and fine webbing.',
      'Check for increasing yellow stippling on sunlit upper foliage.',
      'Monitor field borders and dusty perimeter rows for early hotspots.'
    ],
    preventionActions: [
      'Encourage beneficial natural predators (such as predatory mites and ladybugs).',
      'Keep perimeter access roads damp to suppress airborne dust.',
      'Ensure regular irrigation to prevent plant drought stress.',
      'Remove heavily infested host weeds around field perimeters.'
    ]
  },
  'yellow_leaf_curl_virus': {
    displayName: 'Yellow Leaf Curl Virus',
    crop: 'Tomato',
    severity: 'high',
    summary: 'A destructive viral disease (TYLCV) transmitted by whiteflies (Bemisia tabaci) causing pronounced upward leaf cupping, marginal chlorosis, and stunted bushiness.',
    riskFactors: [
      'High whitefly vector populations in the area',
      'Warm, dry weather favoring rapid whitefly reproduction',
      'Adjacent infested crops or reservoir weed hosts',
      'Young plant vulnerability during early vegetative stages'
    ],
    immediateActions: [
      'Deploy yellow sticky traps across the plot to monitor and suppress whitefly activity.',
      'Rogue out severely stunted or cupped plants to eliminate virus reservoirs.',
      'Use fine insect-exclusion netting over seedling nurseries.',
      'Follow locally recommended whitefly management practices.'
    ],
    monitoringActions: [
      'Check new terminal growth for upward cupping and yellowing margins.',
      'Inspect leaf undersides for tiny whitefly adults and nymphs.',
      'Monitor surrounding solanaceous weeds and crops for vector presence.'
    ],
    preventionActions: [
      'Plant TYLCV-resistant tomato hybrids where available.',
      'Use reflective or silver mulches to deter whitefly vectors.',
      'Protect young nursery transplants with fine insect screens.',
      'Eliminate alternate weed hosts around field margins.'
    ]
  },

  // Rice (6 classes)
  'rice_bacterial_leaf_blight': {
    displayName: 'Bacterial Leaf Blight',
    crop: 'Rice',
    severity: 'high',
    summary: 'A major bacterial disease caused by Xanthomonas oryzae pv. oryzae producing water-soaked wavy lesions along leaf margins that turn yellowish-white.',
    riskFactors: [
      'Warm temperatures (25°C–34°C)',
      'High relative humidity (>80%) and persistent rainfall',
      'Strong winds causing foliar micro-abrasions that facilitate bacterial entry',
      'Excessive nitrogen fertilizer application'
    ],
    immediateActions: [
      'Inspect surrounding tillers and flag leaves for wavy water-soaked lesions.',
      'Drain standing paddy water temporarily to lower microclimate relative humidity.',
      'Suspend excess nitrogen top-dressing; maintain balanced potassium fertilization.',
      'Avoid moving through wet fields to prevent physical transmission of bacterial ooze.',
      'Follow locally approved bactericidal/agronomic management practices.'
    ],
    monitoringActions: [
      'Scout flag leaves during tillering and panicle initiation stages.',
      'Check for milky bacterial exudate droplets during early humid mornings.',
      'Monitor the rate of lesion elongation toward the leaf base.'
    ],
    preventionActions: [
      'Use certified disease-resistant rice cultivars suited to the region.',
      'Maintain balanced nitrogen-to-potassium fertilizer ratios.',
      'Ensure clean field bunds and weed-free irrigation channels.',
      'Avoid field-to-field water flow from affected plots into healthy fields.'
    ]
  },
  'rice_brown_spot': {
    displayName: 'Brown Spot',
    crop: 'Rice',
    severity: 'moderate',
    summary: 'A fungal disease caused by Bipolaris oryzae producing oval to circular brown spots with distinct yellow halos across the rice leaf lamina.',
    riskFactors: [
      'Nutritional imbalance, particularly potassium or micronutrient deficiency',
      'Intermittent drought stress or moisture fluctuations in the paddy',
      'High relative humidity (>85%) with moderate temperatures (25°C–30°C)',
      'Nutrient-depleted or unconditioned soil'
    ],
    immediateActions: [
      'Maintain uniform paddy water level to prevent soil moisture stress cycles.',
      'Apply balanced foliar potassium and micronutrients to strengthen foliar tissue.',
      'Inspect upper leaves and panicles for spot density progression.',
      'Follow locally approved agronomic recommendations.'
    ],
    monitoringActions: [
      'Scout upper leaves every 48–72 hours for expanding brown lesions.',
      'Check for spot emergence on developing grains and glumes.',
      'Monitor soil moisture to prevent extreme drying-wetting stress cycles.'
    ],
    preventionActions: [
      'Ensure balanced soil fertility management based on soil testing.',
      'Use treated, disease-free certified rice seeds.',
      'Avoid severe water stress during vegetative and reproductive stages.',
      'Incorporate organic matter to improve soil water-holding capacity.'
    ]
  },
  'rice_healthy': {
    displayName: 'Healthy Foliage',
    crop: 'Rice',
    severity: 'low',
    summary: 'Rice tillers display uniform emerald-green coloration, healthy leaf blade architecture, and no visible pathogen signatures.',
    riskFactors: [
      'No active foliar pathogen risk factors currently detected.'
    ],
    immediateActions: [
      'Continue regular paddy water management and nutrient schedules.',
      'Perform routine weekly field scouting across all tillers.',
      'Maintain clean bunds and free-flowing irrigation channels.'
    ],
    monitoringActions: [
      'Conduct routine foliar scouting at 5–7 day intervals.',
      'Inspect flag leaves closely as heading and panicle emergence approaches.',
      'Record this scan as a healthy reference benchmark for future comparisons.'
    ],
    preventionActions: [
      'Maintain optimal water depth tailored to the current crop growth stage.',
      'Follow split-nitrogen application guidelines balanced with adequate potassium.',
      'Keep bunds weed-free to eliminate alternate pest and pathogen hosts.'
    ]
  },
  'rice_leaf_blast': {
    displayName: 'Leaf Blast',
    crop: 'Rice',
    severity: 'high',
    summary: 'A destructive fungal disease caused by Magnaporthe oryzae producing spindle-shaped or diamond lesions with gray-white centers and dark brown borders.',
    riskFactors: [
      'Cool night temperatures (17°C–23°C) combined with high daytime humidity (>90%)',
      'Extended leaf wetness / heavy morning dew exceeding 10 hours',
      'Excessive nitrogen fertilization leading to lush, soft leaf tissue',
      'Overcast skies, light drizzling rain, or persistent fog'
    ],
    immediateActions: [
      'Maintain steady water depth in the paddy field to buffer canopy microclimate.',
      'Halt further nitrogen top-dressing immediately to avoid lush susceptible tissue.',
      'Inspect flag leaves and neck nodes carefully for spindle-shaped lesions.',
      'Follow locally recommended blast management guidance.'
    ],
    monitoringActions: [
      'Scout leaves daily during prolonged cool, cloudy, or foggy weather periods.',
      'Monitor collar and neck nodes during panicle emergence for blast symptoms.',
      'Check adjacent fields and regional advisories for blast outbreak warnings.'
    ],
    preventionActions: [
      'Plant blast-resistant rice varieties adapted to the agro-climatic zone.',
      'Avoid excessive or late nitrogen fertilizer applications.',
      'Adjust sowing time to avoid heading during peak cool, humid seasonal windows.',
      'Ensure adequate seedling spacing for good canopy aeration.'
    ]
  },
  'rice_leaf_scald': {
    displayName: 'Leaf Scald',
    crop: 'Rice',
    severity: 'moderate',
    summary: 'A fungal disease caused by Microdochium oryzae producing zonate chevron-like banded lesions progressing from leaf tips with alternating light and dark brown bands.',
    riskFactors: [
      'High relative humidity (>80%) and frequent rainfall events',
      'Warm temperatures (25°C–30°C)',
      'High crop planting density and lush canopy',
      'Excessive nitrogen application without balanced potassium'
    ],
    immediateActions: [
      'Avoid further high-nitrogen applications during active tillering.',
      'Maintain adequate potassium levels to reinforce foliar cell walls.',
      'Ensure proper field drainage to lower canopy humidity.',
      'Follow locally approved management practices.'
    ],
    monitoringActions: [
      'Check leaf tips and upper third of blades for chevron-patterned bands.',
      'Monitor lesion progression toward the leaf sheath during heading.',
      'Scout tillers following persistent rain or heavy dew spells.'
    ],
    preventionActions: [
      'Use clean, certified disease-free seed sources.',
      'Maintain optimal planting density for adequate cross-canopy airflow.',
      'Avoid unbalanced high-nitrogen fertilization.',
      'Clear and compost infected crop residues after harvest.'
    ]
  },
  'rice_narrow_brown_spot': {
    displayName: 'Narrow Brown Spot',
    crop: 'Rice',
    severity: 'moderate',
    summary: 'A fungal disease caused by Cercospora janseana producing short, narrow linear brown lesions parallel to the leaf veins.',
    riskFactors: [
      'Crop approaching heading to ripening maturity stages',
      'Potassium deficiency in soil',
      'Warm and humid weather conditions',
      'Prolonged leaf moisture from dew or rain'
    ],
    immediateActions: [
      'Assess soil potassium availability and provide balanced nutrition.',
      'Maintain stable paddy water management without drying stress.',
      'Inspect upper leaves and panicle branches for linear brown stripes.',
      'Follow locally approved agricultural extension guidance.'
    ],
    monitoringActions: [
      'Scout flag leaves and upper canopy during heading and grain filling.',
      'Check for lesion expansion on leaf sheaths and glumes.',
      'Track overall foliar senescence rate in the plot.'
    ],
    preventionActions: [
      'Apply balanced potassium and nitrogen fertilizers according to soil test recommendations.',
      'Use resistant varieties suited for late-season disease tolerance.',
      'Ensure optimal plant spacing and steady water management.',
      'Practice crop rotation where practical.'
    ]
  }
};

function normalizeClassKey(raw: string): string {
  const d = raw.toLowerCase().trim().replace(/ /g, '_').replace(/-/g, '_');
  if (FALLBACK_KNOWLEDGE[d]) return d;

  const mapping: Record<string, string> = {
    'bacterial_leaf_blight': 'rice_bacterial_leaf_blight',
    'brown_spot': 'rice_brown_spot',
    'leaf_blast': 'rice_leaf_blast',
    'leaf_scald': 'rice_leaf_scald',
    'narrow_brown_spot': 'rice_narrow_brown_spot',
    'two_spotted_spider_mite': 'twospotted_spider_mite',
    'spider_mite': 'twospotted_spider_mite',
    'yellow_leaf_curl_virus': 'yellow_leaf_curl_virus',
    'healthy_foliage': 'healthy',
    'rice_healthy_foliage': 'rice_healthy',
  };

  if (mapping[d]) return mapping[d];

  for (const k of Object.keys(FALLBACK_KNOWLEDGE)) {
    if (d.includes(k) || k.includes(d)) return k;
  }

  return d.startsWith('rice_') ? 'rice_healthy' : 'healthy';
}

function buildClientFallback(request: FarmIntelligenceRequest): FarmIntelligenceData {
  const conf = request.confidence <= 1.0 ? request.confidence * 100 : request.confidence;
  const isLowConf = conf < 60;
  const normKey = normalizeClassKey(request.disease);
  const profile = FALLBACK_KNOWLEDGE[normKey] || FALLBACK_KNOWLEDGE['early_blight'];
  const effectiveCrop = request.crop || profile.crop;
  const isHealthy = normKey.includes('healthy');

  if (isLowConf) {
    return {
      disease: 'Uncertain Classification',
      crop: effectiveCrop,
      confidence: Math.round(conf * 100) / 100,
      severity: 'low',
      summary: 'The uploaded image could not be classified with high confidence (below 60% diagnostic threshold). Please capture another clear image of the leaf in good daylight.',
      weatherRisk: 'UNAVAILABLE',
      weatherAvailable: false,
      riskFactors: ['Image quality, lighting, or focus is insufficient for reliable diagnosis.'],
      immediateActions: [
        'Retake photo under uniform natural daylight focusing directly on the leaf.',
        'Ensure the leaf fills at least 60% of the camera frame.',
        'Avoid heavy glare, shadows, and blurry focus.'
      ],
      monitoringActions: ['Inspect the plant visually for any clear symptoms.'],
      preventionActions: ['Maintain standard crop hygiene and monitoring routines.'],
      weatherAdvice: ['Weather information is currently unavailable. Showing disease-based guidance only.'],
      disclaimer: 'AI confidence is below the diagnostic threshold. No specific chemical or protective treatments should be applied based on uncertain classifications.',
      riskLevel: 'Low',
      advisory: 'AI confidence is low. Please capture another clear photo under natural daylight.',
      actions: ['Retake photo in clear natural daylight.'],
      weatherFactors: []
    };
  }

  if (isHealthy) {
    return {
      disease: 'Healthy Foliage Detected',
      crop: effectiveCrop,
      confidence: Math.round(conf * 100) / 100,
      severity: 'low',
      summary: profile.summary,
      weatherRisk: 'LOW',
      weatherAvailable: false,
      riskFactors: profile.riskFactors,
      immediateActions: profile.immediateActions,
      monitoringActions: profile.monitoringActions,
      preventionActions: profile.preventionActions,
      weatherAdvice: ['Weather information is currently unavailable. Showing disease-based guidance only.'],
      disclaimer: 'Foliage appears healthy. Continue regular field monitoring and routine management.',
      riskLevel: 'Low',
      advisory: profile.summary,
      actions: profile.immediateActions,
      weatherFactors: []
    };
  }

  return {
    disease: profile.displayName,
    crop: effectiveCrop,
    confidence: Math.round(conf * 100) / 100,
    severity: profile.severity,
    summary: profile.summary,
    weatherRisk: 'UNAVAILABLE',
    weatherAvailable: false,
    riskFactors: profile.riskFactors,
    immediateActions: profile.immediateActions,
    monitoringActions: profile.monitoringActions,
    preventionActions: profile.preventionActions,
    weatherAdvice: ['Weather information is currently unavailable. Showing disease-based guidance only.'],
    disclaimer: 'This AI result is a decision-support indication based on the uploaded image. Confirm uncertain cases with a qualified agricultural expert before applying crop-protection products.',
    riskLevel: profile.severity === 'high' ? 'High' : (profile.severity === 'moderate' ? 'Moderate' : 'Low'),
    advisory: profile.summary,
    actions: profile.immediateActions,
    weatherFactors: []
  };
}

// ─── Public Service API ───────────────────────────────────────────────────────

export const farmIntelligenceService = {
  /**
   * Generates a correlated agro-climatic advisory by querying the FastAPI Backend.
   * Gracefully falls back to client-side deterministic agronomic rules if the backend is offline.
   */
  async getFarmIntelligence(request: FarmIntelligenceRequest): Promise<FarmIntelligenceData> {
    try {
      const endpoints = [
        `${API_BASE_URL}/api/farm-intelligence`,
        `${API_BASE_URL}/api/intelligence/farm-analysis`,
        `${API_BASE_URL}/farm-intelligence`
      ];

      let lastError: any = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              disease: request.disease,
              crop: request.crop || 'Tomato',
              confidence: request.confidence,
              latitude: request.latitude,
              longitude: request.longitude,
              city: request.city,
            }),
          });

          if (response.ok) {
            const json: FarmIntelligenceApiResponse = await response.json();
            if (json && json.data) {
              return json.data;
            }
          }
        } catch (err) {
          lastError = err;
          // Try next endpoint candidate
        }
      }

      console.warn('Backend Farm Intelligence API unreachable, applying client-side fallback knowledge:', lastError);
      return buildClientFallback(request);
    } catch (err) {
      console.warn('Fallback error handling in farm intelligence:', err);
      return buildClientFallback(request);
    }
  },
};

