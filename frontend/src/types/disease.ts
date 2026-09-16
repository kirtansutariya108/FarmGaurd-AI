export type DiseaseStatus = 'Needs Attention' | 'Healthy-looking' | 'Uncertain' | 'Critical';

export interface DiseasePrediction {
  diseaseName: string;
  confidence: number; // percentage, e.g. 91
  description?: string;
}

export interface DiseaseResult {
  id: string;
  cropName: string;
  primaryCondition: string;
  confidence: number;
  status: DiseaseStatus;
  isLowConfidence: boolean;
  isHealthy: boolean;
  visualFindings: string;
  nextSteps: string[];
  topPredictions: DiseasePrediction[];
  scannedAt: string;
  imageUrl: string;
  farmId?: string;
  farmName?: string;
}

export interface ImageQualityCheck {
  isValid: boolean;
  lightingQuality: 'Good' | 'Fair' | 'Poor';
  blurLevel: 'Low' | 'Moderate' | 'High';
  isLeafCentered: boolean;
  notes: string;
}
