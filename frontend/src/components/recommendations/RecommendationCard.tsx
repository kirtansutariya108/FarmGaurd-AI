import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ActionableRecommendation } from '../../types/recommendation';
import { Link } from 'react-router-dom';
import { 
  ScanSearch, 
  Droplets, 
  CloudSun, 
  Sprout, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: ActionableRecommendation;
  onComplete: (id: string) => Promise<void>;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onComplete,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const getCategoryIcon = () => {
    switch (recommendation.category) {
      case 'Disease':
        return <ScanSearch className="w-5 h-5 text-rose-500" />;
      case 'Irrigation':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Weather':
        return <CloudSun className="w-5 h-5 text-amber-500" />;
      default:
        return <Sprout className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getPriorityBadge = () => {
    switch (recommendation.priority) {
      case 'High':
        return <Badge variant="danger">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="neutral">Routine</Badge>;
    }
  };

  const handleDone = async () => {
    setIsCompleting(true);
    try {
      await onComplete(recommendation.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const isDone = recommendation.status === 'Completed';

  return (
    <Card
      hoverable
      className={`p-5 flex flex-col justify-between transition-all ${
        isDone ? 'opacity-60 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Top meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {getCategoryIcon()}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {recommendation.category}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {recommendation.farmName} ({recommendation.crop})
              </span>
            </div>
          </div>
          <div>{getPriorityBadge()}</div>
        </div>

        {/* Title & Description */}
        <div>
          <h4 className={`text-sm font-bold text-slate-900 dark:text-white ${isDone ? 'line-through text-slate-500' : ''}`}>
            {recommendation.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {recommendation.description}
          </p>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{recommendation.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isDone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDone}
              isLoading={isCompleting}
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Mark Done
            </Button>
          )}

          {recommendation.actionLink && (
            <Link to={recommendation.actionLink}>
              <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                {recommendation.actionText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};
