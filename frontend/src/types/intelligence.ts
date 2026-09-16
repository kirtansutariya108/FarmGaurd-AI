export interface FarmIntelligenceRequest {
  disease: string;
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

export interface FarmIntelligenceData {
  disease: string;
  confidence: number;
  riskLevel: 'High' | 'Moderate' | 'Low' | string;
  weatherRisk: 'High' | 'Elevated' | 'Moderate' | 'Normal' | 'Low' | string;
  advisory: string;
  actions: string[];
  weatherFactors: string[];
  weatherSummary?: WeatherSummary;
}

export interface FarmIntelligenceApiResponse {
  success: boolean;
  data: FarmIntelligenceData;
  message?: string;
}
