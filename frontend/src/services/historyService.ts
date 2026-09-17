/**
 * historyService.ts
 *
 * Manages scan history persistence using browser localStorage synchronized
 * with baseline demonstration history. Ensures scans performed in the Disease Scanner
 * are immediately visible in Scan History, Dashboard Recent Activity, and Scan Details.
 */

import { ScanHistoryItem } from '../types/history';
import { DiseaseResult } from '../types/disease';
import { initialMockHistory } from '../data/mockHistory';

const STORAGE_KEY = 'farmguard_scan_history';

export const historyService = {
  /**
   * Retrieves all scan history items (user-generated scans + baseline archive).
   */
  getHistory(): ScanHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userItems: ScanHistoryItem[] = JSON.parse(stored);
        // Deduplicate with baseline items
        const userIds = new Set(userItems.map(i => i.id));
        const filteredInitial = initialMockHistory.filter(i => !userIds.has(i.id));
        return [...userItems, ...filteredInitial];
      }
    } catch (e) {
      console.warn('Could not read scan history from localStorage:', e);
    }
    return initialMockHistory;
  },

  /**
   * Saves a newly diagnosed scan result into history.
   */
  saveScan(result: DiseaseResult): ScanHistoryItem {
    const newItem: ScanHistoryItem = {
      id: result.id || `scan-${Date.now()}`,
      farmId: result.farmId || 'farm-1',
      farmName: result.farmName || 'Green Valley Farm',
      crop: result.cropName || 'Tomato',
      condition: result.primaryCondition || 'Field Scan',
      confidence: Math.round(result.confidence || 0),
      status: (result.isHealthy ? 'Healthy-looking' : result.isLowConfidence ? 'Uncertain' : 'Needs Attention') as 'Needs Attention' | 'Healthy-looking' | 'Uncertain',
      scanDate: 'Today, Just now',
      thumbnailUrl: result.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=400&q=80',
      healthScoreContribution: result.isHealthy ? 95 : result.isLowConfidence ? 65 : 75,
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const userItems: ScanHistoryItem[] = stored ? JSON.parse(stored) : [];
      // Prepend the new item
      const updated = [newItem, ...userItems.filter(i => i.id !== newItem.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Also store full details for ScanDetailsPage lookup
      localStorage.setItem(`farmguard_scan_detail_${newItem.id}`, JSON.stringify(result));
    } catch (e) {
      console.warn('Could not save scan history to localStorage:', e);
    }

    return newItem;
  },

  /**
   * Fetches full scan result details by id.
   */
  getScanDetailById(id: string): DiseaseResult | null {
    try {
      const stored = localStorage.getItem(`farmguard_scan_detail_${id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read scan detail from localStorage:', e);
    }
    return null;
  }
};
