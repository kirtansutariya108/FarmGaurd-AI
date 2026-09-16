import { ScanHistoryItem } from '../types/history';

export const initialMockHistory: ScanHistoryItem[] = [
  {
    id: 'scan-101',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    condition: 'Possible Early Blight',
    confidence: 91,
    status: 'Needs Attention',
    scanDate: 'Today, 09:30 AM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=400&q=80',
    healthScoreContribution: 78
  },
  {
    id: 'scan-102',
    farmId: 'farm-2',
    farmName: 'Sunrise Agro Fields',
    crop: 'Potato',
    condition: 'Healthy Foliage',
    confidence: 94,
    status: 'Healthy-looking',
    scanDate: 'Yesterday, 04:15 PM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
    healthScoreContribution: 95
  },
  {
    id: 'scan-103',
    farmId: 'farm-3',
    farmName: 'Narmada Organic Orchard',
    crop: 'Bell Pepper',
    condition: 'Inconclusive Visual Sample',
    confidence: 42,
    status: 'Uncertain',
    scanDate: '3 days ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80',
    healthScoreContribution: 65
  },
  {
    id: 'scan-104',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    condition: 'Healthy Leaf Baseline',
    confidence: 96,
    status: 'Healthy-looking',
    scanDate: '5 days ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=400&q=80',
    healthScoreContribution: 94
  },
  {
    id: 'scan-105',
    farmId: 'farm-2',
    farmName: 'Sunrise Agro Fields',
    crop: 'Potato',
    condition: 'Minor Leaf Curl',
    confidence: 76,
    status: 'Needs Attention',
    scanDate: '1 week ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
    healthScoreContribution: 72
  }
];
