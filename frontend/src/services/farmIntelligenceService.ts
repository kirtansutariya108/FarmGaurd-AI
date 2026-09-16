import {
  FarmIntelligenceRequest,
  FarmIntelligenceData,
  FarmIntelligenceApiResponse
} from '../types/intelligence';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const farmIntelligenceService = {
  /**
   * Sends AI disease prediction result and geo-coordinates to backend
   * to obtain a correlated agro-climatic advisory and recommended actions.
   */
  async getFarmIntelligence(
    request: FarmIntelligenceRequest
  ): Promise<FarmIntelligenceData> {
    try {
      const response = await fetch(`${API_BASE_URL}/farm-intelligence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = `Intelligence API returned status ${response.status}`;
        try {
          const errData = await response.json();
          errorMessage = errData.detail || errData.message || errorMessage;
        } catch {
          // fallback error message
        }
        throw new Error(errorMessage);
      }

      const result: FarmIntelligenceApiResponse = await response.json();

      if (!result.data) {
        throw new Error('Malformed intelligence response from server.');
      }

      return result.data;
    } catch (error: any) {
      console.warn('Farm intelligence request failed:', error);
      throw error;
    }
  }
};
