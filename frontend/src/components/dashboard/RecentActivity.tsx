import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { historyService } from '../../services/historyService';
import { ScanHistoryItem } from '../../types/history';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const [recentItems, setRecentItems] = useState<ScanHistoryItem[]>(() => historyService.getHistory().slice(0, 3));

  useEffect(() => {
    setRecentItems(historyService.getHistory().slice(0, 3));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Needs Attention':
        return <Badge variant="danger" icon={<AlertTriangle className="w-3 h-3" />}>Needs Attention</Badge>;
      case 'Healthy-looking':
        return <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>Healthy</Badge>;
      default:
        return <Badge variant="warning" icon={<HelpCircle className="w-3 h-3" />}>Uncertain</Badge>;
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity & Scans</h3>
        </div>
        <Link to="/app/history" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
          Full History <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
        {recentItems.map(item => (
          <Link
            key={item.id}
            to={`/app/history/${item.id}`}
            className="py-3 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.thumbnailUrl}
                alt={item.crop}
                className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {item.crop}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {item.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.scanDate}
                  </span>
                  <span>•</span>
                  <span>Confidence: {item.confidence}%</span>
                </div>
              </div>
            </div>
            <div>
              {getStatusBadge(item.status)}
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-[11px] text-slate-400">
          Showing 3 most recent field diagnostic events
        </span>
      </div>
    </Card>
  );
};
