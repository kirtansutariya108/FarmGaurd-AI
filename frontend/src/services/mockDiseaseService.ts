import { DiseaseResult, ImageQualityCheck } from '../types/disease';
import { mockDiseaseScenarios } from '../data/mockDiseaseResults';

export interface AnalysisOptions {
  cropName?: string;
  farmId?: string;
  scenario?: 'earlyBlight' | 'healthy' | 'lowConfidence';
}

export const mockDiseaseService = {
  async validateImageQuality(file: File): Promise<ImageQualityCheck> {
    // Simulate brief client-side visual checks
    await new Promise(resolve => setTimeout(resolve, 400));
    const isSmall = file.size < 50000;
    return {
      isValid: true,
      lightingQuality: isSmall ? 'Fair' : 'Good',
      blurLevel: 'Low',
      isLeafCentered: true,
      notes: 'Good contrast and illumination detected.'
    };
  },

  async analyzeLeafImage(
    imageFile: File | string,
    options: AnalysisOptions = {}
  ): Promise<DiseaseResult> {
    // 1.5s simulated progressive processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Choose scenario based on options or random demo
    const scenarioKey = options.scenario || 'earlyBlight';
    const base = mockDiseaseScenarios[scenarioKey] || mockDiseaseScenarios.earlyBlight;

    const result: DiseaseResult = {
      ...base,
      id: `scan-${Date.now()}`,
      cropName: options.cropName || base.cropName,
      farmId: options.farmId || base.farmId,
      scannedAt: 'Just now',
      imageUrl: typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile)
    };

    return result;
  },

  async getScanResultById(id: string): Promise<DiseaseResult | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (id === 'scan-102') return mockDiseaseScenarios.healthy;
    if (id === 'scan-103') return mockDiseaseScenarios.lowConfidence;
    return mockDiseaseScenarios.earlyBlight;
  }
};
