import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../hooks/useFarmContext';
import { mockFarmService } from '../../services/mockFarmService';
import { Farm, GrowthStage, SoilType } from '../../types/farm';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { HealthRing } from '../../components/common/HealthRing';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  ScanSearch, 
  ArrowLeft, 
  Save, 
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer
} from 'lucide-react';

export const FarmDetailsPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const { updateFarmData } = useApp();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [areaAcres, setAreaAcres] = useState('');
  const [crop, setCrop] = useState('');
  const [cropVariety, setCropVariety] = useState('');
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Flowering');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (farmId) {
      mockFarmService.getFarmById(farmId).then(f => {
        if (f) {
          setFarm(f);
          setName(f.name);
          setLocation(f.location);
          setAreaAcres(f.areaAcres.toString());
          setCrop(f.crop);
          setCropVariety(f.cropVariety);
          setSoilType(f.soilType);
          setGrowthStage(f.growthStage);
          setSoilMoisture(f.soilMoisture.toString());
        }
      });
    }
  }, [farmId]);

  if (!farm) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Loading farm details...</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateFarmData(farm.id, {
        name,
        location,
        areaAcres: Number(areaAcres) || 2.5,
        crop,
        cropVariety,
        soilType,
        growthStage,
        soilMoisture: Number(soilMoisture) || 35,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button & top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/app/farms">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Farms
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {farm.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {farm.location} • Registered Parcel ID: {farm.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/scanner">
            <Button size="sm" icon={<ScanSearch className="w-4 h-4" />}>
              Scan Leaf For This Farm
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Form & Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Attributes */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Farm Attributes & Growth Parameters
                </h3>
                <p className="text-xs text-slate-500">
                  Update growth stages and soil types to calibrate recommendation algorithms.
                </p>
              </div>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Farm Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  label="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Total Parcel Area (Acres)"
                  type="number"
                  step="0.1"
                  value={areaAcres}
                  onChange={e => setAreaAcres(e.target.value)}
                  required
                />
                <Input
                  label="Crop Category"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  required
                />
                <Input
                  label="Variety / Hybrid Code"
                  value={cropVariety}
                  onChange={e => setCropVariety(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Soil Texture</label>
                  <select
                    value={soilType}
                    onChange={e => setSoilType(e.target.value as SoilType)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121c15] p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silty">Silty</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Current Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={e => setGrowthStage(e.target.value as GrowthStage)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121c15] p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Maturity">Maturity</option>
                  </select>
                </div>

                <Input
                  label="Soil Moisture (%)"
                  type="number"
                  value={soilMoisture}
                  onChange={e => setSoilMoisture(e.target.value)}
                  leftIcon={<Droplets className="w-4 h-4" />}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" size="md" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
                  Save Farm Configuration
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col: Current Health Ring & Signals */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Calculated Health Index
            </h4>
            <HealthRing score={farm.healthScore} size={130} />
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Last Diagnostic: <span className="font-semibold text-slate-700 dark:text-slate-300">{farm.lastScanDate}</span>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Diagnostic Snapshot
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400">Pathogen Risk</span>
                <span className="font-bold text-emerald-600">{farm.diseaseRisk}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400">Days Since Irrigation</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{farm.lastIrrigationDaysAgo} days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
