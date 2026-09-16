import { Farm } from '../types/farm';
import { initialMockFarms } from '../data/mockFarms';

const STORAGE_KEY_FARMS = 'farmguard_farms_list';

export const mockFarmService = {
  async getFarms(): Promise<Farm[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem(STORAGE_KEY_FARMS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initialMockFarms;
      }
    }
    return initialMockFarms;
  },

  async getFarmById(id: string): Promise<Farm | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const farms = await this.getFarms();
    return farms.find(f => f.id === id) || null;
  },

  async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const farms = await this.getFarms();
    const index = farms.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farm not found');
    
    const updated = { ...farms[index], ...updates };
    farms[index] = updated;
    localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(farms));
    return updated;
  },

  async createFarm(newFarmData: Omit<Farm, 'id'>): Promise<Farm> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const farms = await this.getFarms();
    const newFarm: Farm = {
      ...newFarmData,
      id: `farm-${Date.now()}`,
    };
    farms.push(newFarm);
    localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(farms));
    return newFarm;
  }
};
