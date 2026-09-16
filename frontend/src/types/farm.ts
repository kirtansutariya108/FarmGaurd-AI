export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
export type SoilType = 'Loamy' | 'Clay' | 'Sandy' | 'Silty' | 'Black Soil' | 'Other';

export interface Farm {
  id: string;
  name: string;
  location: string;
  areaAcres: number;
  crop: string;
  cropVariety: string;
  soilType: SoilType;
  growthStage: GrowthStage;
  healthScore: number; // 0-100
  soilMoisture: number; // percentage
  lastIrrigationDaysAgo: number;
  lastScanDate: string;
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  coordinates?: {
    lat: number;
    lng: number;
  };
}
