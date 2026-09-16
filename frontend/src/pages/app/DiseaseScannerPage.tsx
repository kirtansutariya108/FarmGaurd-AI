import React, { useState } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { Dropzone } from '../../components/disease/Dropzone';
import { ImagePreview } from '../../components/disease/ImagePreview';
import { AnalysisProgress } from '../../components/disease/AnalysisProgress';
import { DiseaseResultCard } from '../../components/disease/DiseaseResultCard';
import { diseaseService } from '../../services/diseaseService';
import { DiseaseResult } from '../../types/disease';
import { ScanSearch, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const DiseaseScannerPage: React.FC = () => {
  const { selectedFarm, t } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<string>(selectedFarm?.crop || 'Rice');
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = (file: File | string, url: string) => {
    setSelectedImage(file);
    setPreviewUrl(url);
    setResult(null);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      let fileToUpload: File;

      if (typeof selectedImage === 'string') {
        // Fetch sample image URL and convert to File
        const res = await fetch(selectedImage);
        const blob = await res.blob();
        fileToUpload = new File([blob], 'sample_leaf.jpg', { type: blob.type || 'image/jpeg' });
      } else {
        fileToUpload = selectedImage;
      }

      // Call the real FastAPI /predict endpoint via diseaseService
      const diagnosis = await diseaseService.predictLeafDisease(fileToUpload, {
        cropName: selectedCrop,
        farmId: selectedFarm?.id,
        farmName: selectedFarm?.name,
      });

      setResult(diagnosis);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(
        err.message || 'Failed to communicate with the prediction backend at http://127.0.0.1:8000/predict'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsAnalyzing(false);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ScanSearch className="w-7 h-7 text-emerald-600" />
              {t.scanner.title}
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              AI Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.scanner.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Target Crop:</span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60">
            {selectedCrop} {selectedFarm?.name ? `(${selectedFarm.name})` : ''}
          </span>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">Prediction Request Failed</p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="danger" onClick={handleStartAnalysis} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Scanner Flow */}
      {isAnalyzing ? (
        <AnalysisProgress />
      ) : result ? (
        <DiseaseResultCard result={result} onScanAnother={handleReset} />
      ) : previewUrl ? (
        <ImagePreview
          imageUrl={previewUrl}
          cropName={selectedCrop}
          onAnalyze={handleStartAnalysis}
          onReset={handleReset}
          isLoading={isAnalyzing}
        />
      ) : (
        <Dropzone
          onImageSelected={handleImageSelected}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
        />
      )}
    </div>
  );
};
