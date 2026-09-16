export type RecommendationCategory = 'Disease' | 'Irrigation' | 'Weather' | 'Field Care' | 'General';
export type RecommendationStatus = 'Urgent' | 'Today' | 'Monitor' | 'Completed';

export interface ActionableRecommendation {
  id: string;
  category: RecommendationCategory;
  status: RecommendationStatus;
  title: string;
  description: string;
  actionText: string;
  actionLink?: string;
  priority: 'High' | 'Medium' | 'Low';
  farmId: string;
  farmName: string;
  crop: string;
  createdAt: string;
  completedAt?: string;
}
