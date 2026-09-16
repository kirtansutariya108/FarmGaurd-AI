import React, { useState } from 'react';
import { initialMockHistory } from '../../data/mockHistory';
import { ScanHistoryItem } from '../../types/history';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Calendar, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ScanSearch
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>(initialMockHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

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

  const filtered = historyItems.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Attention') return matchesSearch && item.status === 'Needs Attention';
    if (filter === 'Healthy') return matchesSearch && item.status === 'Healthy-looking';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <History className="w-7 h-7 text-emerald-600" />
              Crop Scan Archive
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Historical leaf diagnosis timeline across all registered farm plots
          </p>
        </div>

        <Link to="/app/scanner">
          <Button size="sm" icon={<ScanSearch className="w-4 h-4" />}>
            New Leaf Scan
          </Button>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search scans by crop, condition, or farm..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Attention', 'Healthy'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-white dark:bg-[#152019] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table / Cards */}
      <div className="space-y-3">
        {filtered.map(item => (
          <Card key={item.id} hoverable className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={item.thumbnailUrl}
                alt={item.crop}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.crop}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {item.condition}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.farmName} • {item.scanDate}
                </p>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>Confidence: <strong className="text-slate-700 dark:text-slate-200">{item.confidence}%</strong></span>
                  <span>Contribution: <strong className="text-emerald-600">+{item.healthScoreContribution} pts</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {getStatusBadge(item.status)}
              <Link to={`/app/history/${item.id}`}>
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Inspect
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
