export interface FarmIntelligenceRequest {
  disease: string;
  crop?: string;
  confidence: number;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface WeatherSummary {
  location?: string;
  currentTemp?: number;
  condition?: string;
  humidity?: number;
  rainProbability?: number;
  windSpeedKmH?: number;
  precipitationMm?: number;
  soilTemp?: number;
  uvIndex?: number;
}

export type WeatherRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'UNAVAILABLE';
export type SeverityLevel = 'low' | 'moderate' | 'high';

export interface FarmIntelligenceData {
  disease: string;
  crop?: string;
  confidence: number;
  severity?: SeverityLevel | string;
  summary?: string;
  weatherRisk: WeatherRiskLevel | string;
  weatherAvailable?: boolean;
  riskFactors?: string[];
  immediateActions?: string[];
  monitoringActions?: string[];
  preventionActions?: string[];
  weatherAdvice?: string[];
  weatherSummary?: WeatherSummary;
  disclaimer?: string;

  // Backwards compatibility
  riskLevel?: 'High' | 'Moderate' | 'Low' | string;
  advisory?: string;
  actions?: string[];
  weatherFactors?: string[];
}

export interface FarmIntelligenceApiResponse {
  success: boolean;
  data: FarmIntelligenceData;
  message?: string;
}

