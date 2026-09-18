export type DiseaseStatus = 'Needs Attention' | 'Healthy-looking' | 'Uncertain' | 'Critical';

export interface DiseasePrediction {
  diseaseName: string;
  confidence: number; // percentage, e.g. 91
  description?: string;
}

export interface DiseaseResult {
  id: string;
  cropName: string;
  selectedCrop?: string;
  detectedCrop?: string;
  cropConfidence?: number;
  cropMatch?: boolean;
  predictionAllowed?: boolean;
  isCropMismatch?: boolean;
  errorCode?: string;
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

export interface BackendPredictResponse {
  success: boolean;
  status: 'success' | 'low_confidence' | 'unsupported_image' | 'crop_mismatch' | 'error';
  selectedCrop?: string | null;
  detectedCrop?: string | null;
  cropConfidence?: number | null;
  cropMatch?: boolean | null;
  predictionAllowed?: boolean | null;
  errorCode?: string | null;
  crop?: string | null;
  disease?: string | null;
  class_name?: string | null;
  confidence: number;
  message?: string | null;
}

