import { FarmNotification } from '../types/history';

export const initialMockNotifications: FarmNotification[] = [
  {
    id: 'notif-1',
    title: 'Crop Scan Ready',
    message: 'Your Tomato leaf scan for Green Valley Farm has been analyzed. Possible Early Blight identified (91% confidence).',
    category: 'scanner',
    isRead: false,
    timestamp: '15 minutes ago',
    linkUrl: '/app/history/scan-101'
  },
  {
    id: 'notif-2',
    title: 'Rain Forecast Alert',
    message: 'Vadodara weather forecast shows 55% rain probability tomorrow. Check field drainage and delay planned foliar spray.',
    category: 'weather',
    isRead: false,
    timestamp: '2 hours ago',
    linkUrl: '/app/weather'
  },
  {
    id: 'notif-3',
    title: 'Irrigation Window Approaching',
    message: 'Soil moisture is approaching lower threshold (32%) in Green Valley Farm. Consider morning irrigation.',
    category: 'irrigation',
    isRead: true,
    timestamp: '5 hours ago',
    linkUrl: '/app/irrigation'
  },
  {
    id: 'notif-4',
    title: 'Weekly Farm Health Summary',
    message: 'Average crop health score across your 3 farms is 81/100. Sunrise Agro Fields is in optimal condition.',
    category: 'system',
    isRead: true,
    timestamp: '1 day ago',
    linkUrl: '/app/crop-health'
  }
];
