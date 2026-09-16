export type IrrigationStatus = 'Recommended' | 'Monitor' | 'Not Needed' | 'Insufficient Data';
export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface IrrigationRecommendation {
  status: IrrigationStatus;
  priority: RecommendationPriority;
  headline: string;
  summary: string;
  reasons: string[];
  actionAdvice: string;
  fieldSignals: {
    crop: string;
    growthStage: string;
    soilMoisture: number | null; // null if insufficient data
    temperature: number;
    humidity: number;
    rainProbability: number;
    lastIrrigationDaysAgo: number | null;
  };
  generatedAt: string;
}
