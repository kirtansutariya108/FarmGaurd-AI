import { DiseaseResult } from '../types/disease';

export const mockDiseaseScenarios: Record<string, DiseaseResult> = {
  earlyBlight: {
    id: 'scan-101',
    cropName: 'Tomato',
    primaryCondition: 'Possible Early Blight',
    confidence: 91,
    status: 'Needs Attention',
    isLowConfidence: false,
    isHealthy: false,
    visualFindings: 'Visual patterns show concentric dark rings and target-like brown spots on lower foliage, consistent with Early Blight (Alternaria solani).',
    nextSteps: [
      'Inspect nearby tomato plants for lower leaf spot progression.',
      'Remove and safely dispose of severely infected lower leaves.',
      'Improve furrow or drip irrigation to avoid splashing water onto leaf surfaces.',
      'Maintain regular crop inspection over the next 48 to 72 hours.',
      'Consult a local agricultural extension officer or certified agronomist if symptoms expand.'
    ],
    topPredictions: [
      { diseaseName: 'Early Blight', confidence: 91, description: 'Fungal leaf spot characterized by target-like concentric rings.' },
      { diseaseName: 'Late Blight', confidence: 6, description: 'Fast-spreading water-soaked lesions.' },
      { diseaseName: 'Healthy', confidence: 3, description: 'Normal chlorophyll and leaf architecture.' }
    ],
    scannedAt: 'Today, 09:30 AM',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=800&q=80',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm'
  },
  healthy: {
    id: 'scan-102',
    cropName: 'Potato',
    primaryCondition: 'Healthy Foliage',
    confidence: 94,
    status: 'Healthy-looking',
    isLowConfidence: false,
    isHealthy: true,
    visualFindings: 'No obvious disease patterns, chlorosis, or necrotic spots were detected in this image. Vibrant green pigmentation and balanced leaf structure.',
    nextSteps: [
      'Continue regular crop monitoring and nutrient scheduling.',
      'Maintain adequate soil moisture levels matching the growth stage.',
      'Log routine visual health scans once every 5-7 days.'
    ],
    topPredictions: [
      { diseaseName: 'Healthy Leaf', confidence: 94, description: 'No signs of pathogen damage.' },
      { diseaseName: 'Early Blight', confidence: 4, description: 'Minor background spot.' },
      { diseaseName: 'Septoria Spot', confidence: 2, description: 'Trace anomaly.' }
    ],
    scannedAt: 'Yesterday, 04:15 PM',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    farmId: 'farm-2',
    farmName: 'Sunrise Agro Fields'
  },
  lowConfidence: {
    id: 'scan-103',
    cropName: 'Bell Pepper',
    primaryCondition: 'Inconclusive Visual Sample',
    confidence: 42,
    status: 'Uncertain',
    isLowConfidence: true,
    isHealthy: false,
    visualFindings: 'The image may have blur, inconsistent lighting, or off-center foliage that prevents confident pattern classification.',
    nextSteps: [
      'Capture a fresh photo in natural daylight without heavy shadows.',
      'Hold the camera steady 15-20cm away from the single affected leaf.',
      'Ensure the main leaf blade fills at least 60% of the viewfinder.'
    ],
    topPredictions: [
      { diseaseName: 'Uncertain / Leaf Spot', confidence: 42, description: 'Low signal clarity.' },
      { diseaseName: 'Bacterial Spot', confidence: 31, description: 'Unverified resemblance.' },
      { diseaseName: 'Sunscald', confidence: 27, description: 'Environmental discoloration.' }
    ],
    scannedAt: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    farmId: 'farm-3',
    farmName: 'Narmada Organic Orchard'
  }
};
