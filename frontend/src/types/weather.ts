export interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  icon: string;
  precipitationMm?: number;
  uvIndex?: number;
}

export interface WeatherData {
  location: string;
  latitude?: number;
  longitude?: number;
  currentTemp: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  windSpeedKmH: number;
  uvIndex: number;
  soilTemp: number;
  precipitationMm?: number;
  forecast: ForecastDay[];
  farmInsight: string;
  lastUpdated: string;
  source?: 'open-meteo' | 'fallback' | string;
}

export interface WeatherApiResponse {
  success: boolean;
  message?: string;
  data: WeatherData;
}
