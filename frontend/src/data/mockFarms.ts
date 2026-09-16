import { Farm } from '../types/farm';

export const initialMockFarms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Green Valley Farm',
    location: 'Vadodara, Gujarat',
    areaAcres: 2.5,
    crop: 'Tomato',
    cropVariety: 'Abhinav Hybrid',
    soilType: 'Loamy',
    growthStage: 'Flowering',
    healthScore: 82,
    soilMoisture: 32,
    lastIrrigationDaysAgo: 2,
    lastScanDate: 'Today, 09:30 AM',
    diseaseRisk: 'Low',
    coordinates: {
      lat: 22.3072,
      lng: 73.1812
    }
  },
  {
    id: 'farm-2',
    name: 'Sunrise Agro Fields',
    location: 'Anand, Gujarat',
    areaAcres: 4.0,
    crop: 'Potato',
    cropVariety: 'Kufri Pukhraj',
    soilType: 'Clay',
    growthStage: 'Vegetative',
    healthScore: 94,
    soilMoisture: 48,
    lastIrrigationDaysAgo: 1,
    lastScanDate: 'Yesterday, 04:15 PM',
    diseaseRisk: 'Low',
    coordinates: {
      lat: 22.5645,
      lng: 72.9289
    }
  },
  {
    id: 'farm-3',
    name: 'Narmada Organic Orchard',
    location: 'Bharuch, Gujarat',
    areaAcres: 3.2,
    crop: 'Bell Pepper',
    cropVariety: 'Indra Cap',
    soilType: 'Black Soil',
    growthStage: 'Fruiting',
    healthScore: 68,
    soilMoisture: 24,
    lastIrrigationDaysAgo: 4,
    lastScanDate: '3 days ago',
    diseaseRisk: 'Moderate',
    coordinates: {
      lat: 21.7051,
      lng: 72.9959
    }
  }
];
