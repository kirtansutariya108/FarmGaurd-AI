import React, { useState } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Activity, 
  Plus, 
  ArrowRight, 
  Calendar, 
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SoilType, GrowthStage } from '../../types/farm';

export const FarmsPage: React.FC = () => {
  const { farms, setSelectedFarm, addNewFarm } = useApp();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [areaAcres, setAreaAcres] = useState('2.5');
  const [crop, setCrop] = useState('Tomato');
  const [cropVariety, setCropVariety] = useState('Abhinav');
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Flowering');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await addNewFarm({
        name: name || 'New Farm Parcel',
        location: location || 'Gujarat, India',
        areaAcres: Number(areaAcres) || 2.0,
        crop,
        cropVariety: cropVariety || 'Standard Hybrid',
        soilType,
        growthStage,
        healthScore: 85,
        soilMoisture: 40,
        lastIrrigationDaysAgo: 1,
        lastScanDate: 'Today',
        diseaseRisk: 'Low',
      });
      setIsAddModalOpen(false);
      setSelectedFarm(created);
      navigate(`/app/farms/${created.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Registered Farms
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your crop parcels, soil characteristics, and active sensors
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Register New Farm
        </Button>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map(f => (
          <Card key={f.id} hoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {f.location}
                    </p>
                  </div>
                </div>

                <Badge variant={f.healthScore > 80 ? 'success' : 'warning'}>
                  Score: {f.healthScore}
                </Badge>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px]">Crop / Variety</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {f.crop} ({f.cropVariety})
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px]">Parcel Area</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {f.areaAcres} Acres
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px]">Soil Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {f.soilType}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px]">Growth Stage</span>
                  <span className="font-bold text-emerald-600 block">
                    {f.growthStage}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer metrics & CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Moisture: {f.soilMoisture}%</span>
              </div>

              <Link to={`/app/farms/${f.id}`} onClick={() => setSelectedFarm(f)}>
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Farm
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Farm Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Farm Parcel">
        <form onSubmit={handleCreateFarm} className="space-y-4 text-left">
          <Input
            label="Farm Parcel Name"
            placeholder="e.g. Narmada Riverbed Farm"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Location"
              placeholder="e.g. Anand, Gujarat"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
            <Input
              label="Area (Acres)"
              type="number"
              step="0.1"
              value={areaAcres}
              onChange={e => setAreaAcres(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Crop Category</label>
              <select
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121c15] p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Bell Pepper">Bell Pepper</option>
                <option value="Cotton">Cotton</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>

            <Input
              label="Crop Variety"
              placeholder="e.g. Abhinav F1"
              value={cropVariety}
              onChange={e => setCropVariety(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Growth Stage</label>
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
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save & Register Farm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
