import { ActionableRecommendation, RecommendationCategory, RecommendationStatus } from '../types/recommendation';
import { initialMockRecommendations } from '../data/mockRecommendations';

const STORAGE_KEY_RECS = 'farmguard_recommendations_list';

export const mockRecommendationService = {
  async getRecommendations(): Promise<ActionableRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    const stored = localStorage.getItem(STORAGE_KEY_RECS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initialMockRecommendations;
      }
    }
    return initialMockRecommendations;
  },

  async markAsCompleted(id: string): Promise<ActionableRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const recs = await this.getRecommendations();
    const item = recs.find(r => r.id === id);
    if (!item) throw new Error('Recommendation not found');
    
    item.status = 'Completed';
    item.completedAt = 'Just now';
    localStorage.setItem(STORAGE_KEY_RECS, JSON.stringify(recs));
    return item;
  }
};
