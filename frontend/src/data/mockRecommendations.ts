import { ActionableRecommendation } from '../types/recommendation';

export const initialMockRecommendations: ActionableRecommendation[] = [
  {
    id: 'rec-1',
    category: 'Disease',
    status: 'Urgent',
    title: 'Inspect Lower Tomato Leaves',
    description: 'Possible Early Blight detected with 91% confidence. Isolate affected leaves and check neighboring rows.',
    actionText: 'View Scan Details',
    actionLink: '/app/history/scan-101',
    priority: 'High',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    createdAt: 'Today, 09:35 AM'
  },
  {
    id: 'rec-2',
    category: 'Irrigation',
    status: 'Today',
    title: 'Check Field Soil Moisture',
    description: 'Current moisture is 32% during critical flowering stage. Consider light drip irrigation before noon.',
    actionText: 'Open Irrigation Advisor',
    actionLink: '/app/irrigation',
    priority: 'Medium',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    createdAt: 'Today, 08:00 AM'
  },
  {
    id: 'rec-3',
    category: 'Weather',
    status: 'Today',
    title: 'Review Tomorrow Rain Forecast',
    description: '55% probability of scattered showers in Vadodara. Adjust fertilizer or chemical spray schedules accordingly.',
    actionText: 'View Weather Forecast',
    actionLink: '/app/weather',
    priority: 'Medium',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    createdAt: 'Today, 07:15 AM'
  },
  {
    id: 'rec-4',
    category: 'Field Care',
    status: 'Monitor',
    title: 'Update Growth Stage Parameters',
    description: 'Sunrise Agro Fields potato crop is transitioning from vegetative to tuber initiation.',
    actionText: 'Update Farm Details',
    actionLink: '/app/farms/farm-2',
    priority: 'Low',
    farmId: 'farm-2',
    farmName: 'Sunrise Agro Fields',
    crop: 'Potato',
    createdAt: 'Yesterday, 04:30 PM'
  },
  {
    id: 'rec-5',
    category: 'General',
    status: 'Completed',
    title: 'Complete Weekly Crop Health Audit',
    description: 'All 3 registered farm fields logged visual scans this week.',
    actionText: 'View Audit Log',
    actionLink: '/app/crop-health',
    priority: 'Low',
    farmId: 'farm-1',
    farmName: 'Green Valley Farm',
    crop: 'Tomato',
    createdAt: '3 days ago',
    completedAt: 'Yesterday, 11:00 AM'
  }
];
