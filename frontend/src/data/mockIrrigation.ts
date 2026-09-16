import { IrrigationRecommendation } from '../types/irrigation';

export const mockIrrigationScenarios: Record<string, IrrigationRecommendation> = {
  recommendedSoon: {
    status: 'Recommended',
    priority: 'Medium',
    headline: 'Consider Irrigation Soon',
    summary: 'Soil moisture is approaching lower threshold (32%) while Tomato is in active flowering stage where moisture stress can reduce blossom retention.',
    reasons: [
      'Soil moisture is at 32% (optimal baseline is 45-60% for loamy soil).',
      'Crop is in Flowering stage — water stress during blossom causes blossom drop.',
      'Upcoming 24h weather forecast shows mild evaporative demand with 30% rain probability.'
    ],
    actionAdvice: 'Perform physical soil check at 4-6 inch depth. If dry, apply light to moderate drip irrigation during early morning or evening hours.',
    fieldSignals: {
      crop: 'Tomato',
      growthStage: 'Flowering',
      soilMoisture: 32,
      temperature: 28,
      humidity: 72,
      rainProbability: 30,
      lastIrrigationDaysAgo: 2,
    },
    generatedAt: 'Today, 08:00 AM'
  },
  notNeeded: {
    status: 'Not Needed',
    priority: 'Low',
    headline: 'Adequate Moisture Available',
    summary: 'Current soil moisture (48%) is well within the healthy vegetative buffer. No irrigation required today.',
    reasons: [
      'Soil moisture is optimal at 48%.',
      'Recent irrigation completed yesterday.',
      'Transpiration demand is low under partly overcast skies.'
    ],
    actionAdvice: 'Hold irrigation. Re-check moisture in 48 hours.',
    fieldSignals: {
      crop: 'Potato',
      growthStage: 'Vegetative',
      soilMoisture: 48,
      temperature: 27,
      humidity: 75,
      rainProbability: 40,
      lastIrrigationDaysAgo: 1,
    },
    generatedAt: 'Today, 08:00 AM'
  },
  insufficientData: {
    status: 'Insufficient Data',
    priority: 'Low',
    headline: 'Field Data Incomplete',
    summary: 'Missing recent soil moisture readings or irrigation timestamp for this farm.',
    reasons: [
      'No sensor or manual soil moisture measurement recorded in the last 7 days.',
      'Last irrigation date is unknown.'
    ],
    actionAdvice: 'Update your farm field measurements to calculate reliable irrigation advice.',
    fieldSignals: {
      crop: 'Bell Pepper',
      growthStage: 'Fruiting',
      soilMoisture: null,
      temperature: 29,
      humidity: 68,
      rainProbability: 20,
      lastIrrigationDaysAgo: null,
    },
    generatedAt: 'Today, 08:00 AM'
  }
};
