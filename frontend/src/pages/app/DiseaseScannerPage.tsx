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
        // Fetch sample image URL and convert to File with a descriptive filename
        const sampleUrlToName: Record<string, string> = {
          'earlyBlight': 'sample_early_blight.jpg',
          'healthy': 'sample_healthy_leaf.jpg',
          'lowConfidence': 'sample_low_confidence.jpg',
        };
        const matchedName = Object.entries(sampleUrlToName).find(([key]) =>
          selectedImage.includes(key)
        );
        const fileName = matchedName?.[1] || 'sample_leaf.jpg';

        const res = await fetch(selectedImage);
        if (!res.ok) throw new Error('Could not download the sample image. Please try uploading your own photo.');
        const blob = await res.blob();
        fileToUpload = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
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
        err.message || 'Scan analysis failed. Please try again with a clearer, well-lit leaf photo.'
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
              <p className="text-xs font-bold">Scan Failed</p>
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
        result.isCropMismatch ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border-2 border-amber-500/30 dark:border-amber-500/40 text-slate-900 dark:text-white space-y-6 animate-fade-in shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      Crop Gating Safety Check
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-300 mt-0.5 tracking-tight">
                    LEAF DOES NOT MATCH SELECTED CROP
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#121c15]/80 p-5 rounded-2xl border border-amber-500/20 space-y-3">
              <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
                You selected <span className="font-extrabold text-amber-600 dark:text-amber-400">{result.selectedCrop || selectedCrop}</span>, but the uploaded leaf does not match this crop. Please upload a valid <span className="font-extrabold text-amber-600 dark:text-amber-400">{result.selectedCrop || selectedCrop}</span> leaf image.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                FarmGuard AI safety guardrails automatically prevent disease diagnosis when the uploaded leaf does not match your selected target crop. This safeguards against incorrect diagnostic findings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Selected Target Crop</span>
                <span className="text-base font-black text-slate-700 dark:text-slate-200 mt-1 block">
                  {result.selectedCrop || selectedCrop}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Validation Status</span>
                <span className="text-base font-black text-amber-700 dark:text-amber-300 mt-1 block">
                  Does Not Match {result.selectedCrop || selectedCrop}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" onClick={handleReset} icon={<RefreshCw className="w-4 h-4" />}>
                Upload {result.selectedCrop || selectedCrop} Leaf Image
              </Button>
            </div>
          </div>
        ) : (
          <DiseaseResultCard result={result} onScanAnother={handleReset} />
        )
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
