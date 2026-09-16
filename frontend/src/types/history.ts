export interface ScanHistoryItem {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  condition: string;
  confidence: number;
  status: 'Needs Attention' | 'Healthy-looking' | 'Uncertain';
  scanDate: string;
  thumbnailUrl: string;
  healthScoreContribution: number;
}

export interface FarmNotification {
  id: string;
  title: string;
  message: string;
  category: 'scanner' | 'weather' | 'irrigation' | 'system';
  isRead: boolean;
  timestamp: string;
  linkUrl?: string;
}
