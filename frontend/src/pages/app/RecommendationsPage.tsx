import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { RecommendationFilter } from '../../components/recommendations/RecommendationFilter';
import { RecommendationCard } from '../../components/recommendations/RecommendationCard';
import { mockRecommendationService } from '../../services/mockRecommendationService';
import { ActionableRecommendation } from '../../types/recommendation';
import { initialMockRecommendations } from '../../data/mockRecommendations';
import { ListChecks, Sparkles, CheckCircle2 } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ActionableRecommendation[]>(initialMockRecommendations);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    mockRecommendationService.getRecommendations().then(recs => setRecommendations(recs));
  }, []);

  const handleComplete = async (id: string) => {
    await mockRecommendationService.markAsCompleted(id);
    const updated = await mockRecommendationService.getRecommendations();
    setRecommendations([...updated]);
  };

  const counts: Record<string, number> = {
    All: recommendations.length,
    Urgent: recommendations.filter(r => r.status === 'Urgent').length,
    Today: recommendations.filter(r => r.status === 'Today').length,
    Monitor: recommendations.filter(r => r.status === 'Monitor').length,
    Completed: recommendations.filter(r => r.status === 'Completed').length,
  };

  const filteredItems = recommendations.filter(r => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ListChecks className="w-7 h-7 text-emerald-600" />
              Actionable Farm Recommendations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritized tasks synthesized from leaf pathology, soil moisture, and meteorological signals
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{counts.Urgent + counts.Today} Tasks Need Attention</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <RecommendationFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      {/* Recommendation Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#152019] rounded-2xl border border-slate-200 dark:border-slate-800">
            No recommendation items in this filter.
          </div>
        ) : (
          filteredItems.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};
