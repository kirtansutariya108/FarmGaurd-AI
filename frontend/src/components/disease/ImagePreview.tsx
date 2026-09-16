import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Sparkles, RefreshCw, Trash2, CheckCircle, Info } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  cropName: string;
  onAnalyze: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  cropName,
  onAnalyze,
  onReset,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Large Image Stage */}
      <div className="lg:col-span-2">
        <Card padded={false} className="overflow-hidden relative group bg-black rounded-3xl">
          <img
            src={imageUrl}
            alt="Selected Crop Leaf"
            className="w-full h-80 sm:h-[420px] object-contain bg-slate-950/90 transition-transform duration-300"
          />
          {/* Laser Grid Scanner Overlay Simulation */}
          <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 rounded-3xl overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute shadow-glow-green animate-scan-laser"></div>
            <div className="absolute top-4 left-4 text-[10px] font-mono font-bold bg-slate-900/80 text-emerald-400 px-2.5 py-1 rounded-md backdrop-blur-sm">
              RAW_INPUT // {cropName.toUpperCase()}_LEAF_FRAME
            </div>
          </div>
        </Card>
      </div>

      {/* Right: Inspection Summary & Action Box */}
      <div className="space-y-4 flex flex-col justify-between">
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Selected Image Info
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {cropName} Foliage Sample
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Crop Category:</span>
              <span className="font-bold text-slate-900 dark:text-white">{cropName}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Image Quality:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> High Signal
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Pipeline:</span>
              <span className="font-bold text-slate-900 dark:text-white">Pathogen Pattern Model</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Ready for multi-pathogen visual pattern analysis and decision mapping.</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2.5">
          <Button
            onClick={onAnalyze}
            isLoading={isLoading}
            size="lg"
            className="w-full text-base font-bold shadow-lg shadow-emerald-900/20"
            icon={<Sparkles className="w-5 h-5 text-lime-300" />}
          >
            Analyze Crop Health
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="flex-1"
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Choose Another
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              icon={<Trash2 className="w-4 h-4" />}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
