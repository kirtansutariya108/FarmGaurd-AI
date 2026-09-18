import React, { useRef, useState } from 'react';
import { Button } from '../common/Button';
import { Camera, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';

interface DropzoneProps {
  onImageSelected: (file: File | string, previewUrl: string) => void;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onImageSelected,
  selectedCrop,
  setSelectedCrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const loadSample = (type: 'earlyBlight' | 'healthy' | 'lowConfidence') => {
    const samples = {
      earlyBlight: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=800&q=80',
      healthy: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      lowConfidence: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    };
    onImageSelected(samples[type], samples[type]);
  };

  return (
    <div className="space-y-6">
      {/* Target Crop Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#152019] border border-slate-200 dark:border-[#223326]">
        <div>
          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Select Target Crop
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Model parameters are calibrated for specialized crop foliage
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['Rice', 'Tomato', 'Potato'].map(crop => (
            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-[#243528] bg-white/70 dark:bg-[#152019]/60 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 shadow-inner">
            <ImageIcon className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Drop your leaf photo here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports high-resolution JPG, PNG, WEBP (Up to 15MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Camera className="w-4 h-4 text-emerald-600" />}
              onClick={e => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
            >
              Take Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Demo Sample Selector */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16221b] border border-slate-200/80 dark:border-[#223326]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Try Curated Demo Samples (Instant Test)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Demo Mode</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => loadSample('earlyBlight')}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#121a14] border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 text-left transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=120&q=80"
              alt="Early Blight Sample"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Early Blight</div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400">Tomato • High Signal</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loadSample('healthy')}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#121a14] border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 text-left transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=120&q=80"
              alt="Healthy Sample"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Healthy Foliage</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Potato • Optimal</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loadSample('lowConfidence')}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#121a14] border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 text-left transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80"
              alt="Low Confidence Sample"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Low Confidence</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400">Pepper • Low Contrast</div>
            </div>
          </button>
        </div>
      </div>

      {/* Image Quality Capture Tips */}
      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
        <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2">
          Image Quality Guidelines for Reliable AI Classification
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Good natural light</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Single clear leaf</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sharp focus, no blur</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Leaf centered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Avoid deep shadows</span>
          </div>
        </div>
      </div>
    </div>
  );
};
