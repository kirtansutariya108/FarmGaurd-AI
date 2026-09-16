import { IrrigationRecommendation } from '../types/irrigation';
import { mockIrrigationScenarios } from '../data/mockIrrigation';

export const mockIrrigationService = {
  async getRecommendation(farmId?: string): Promise<IrrigationRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 350));
    if (farmId === 'farm-2') return mockIrrigationScenarios.notNeeded;
    if (farmId === 'farm-3') return mockIrrigationScenarios.insufficientData;
    return mockIrrigationScenarios.recommendedSoon;
  },

  async updateFieldConditions(
    farmId: string,
    conditions: { soilMoisture: number; lastIrrigationDaysAgo: number }
  ): Promise<IrrigationRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Dynamically calculate decision status
    let status: 'Recommended' | 'Monitor' | 'Not Needed' = 'Monitor';
    let headline = 'Moisture Conditions Monitored';
    let summary = 'Field measurements recorded. Soil moisture levels are moderate.';
    
    if (conditions.soilMoisture < 35) {
      status = 'Recommended';
      headline = 'Consider Irrigation Soon';
      summary = `Soil moisture is at ${conditions.soilMoisture}%, which is below optimal levels for current crop stage.`;
    } else if (conditions.soilMoisture >= 45) {
      status = 'Not Needed';
      headline = 'Adequate Moisture Available';
      summary = `Soil moisture is healthy at ${conditions.soilMoisture}%. No irrigation is required for the next 24-48 hours.`;
    }

    return {
      status,
      priority: status === 'Recommended' ? 'High' : 'Low',
      headline,
      summary,
      reasons: [
        `Soil moisture updated to ${conditions.soilMoisture}%.`,
        `Last irrigation logged ${conditions.lastIrrigationDaysAgo} days ago.`,
        'Weather forecast evaporative demand evaluated.'
      ],
      actionAdvice: status === 'Recommended' 
        ? 'Schedule irrigation during cooler morning hours.' 
        : 'Maintain routine moisture tracking.',
      fieldSignals: {
        crop: 'Tomato',
        growthStage: 'Flowering',
        soilMoisture: conditions.soilMoisture,
        temperature: 28,
        humidity: 72,
        rainProbability: 30,
        lastIrrigationDaysAgo: conditions.lastIrrigationDaysAgo,
      },
      generatedAt: 'Just now'
    };
  }
};
