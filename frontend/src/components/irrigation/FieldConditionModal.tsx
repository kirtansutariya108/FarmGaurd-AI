import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Droplets, Calendar } from 'lucide-react';

interface FieldConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMoisture: number;
  currentDaysAgo: number;
  onSave: (moisture: number, daysAgo: number) => Promise<void>;
}

export const FieldConditionModal: React.FC<FieldConditionModalProps> = ({
  isOpen,
  onClose,
  currentMoisture,
  currentDaysAgo,
  onSave,
}) => {
  const [moisture, setMoisture] = useState(currentMoisture.toString());
  const [daysAgo, setDaysAgo] = useState(currentDaysAgo.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(Number(moisture) || 30, Number(daysAgo) || 1);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Field Measurements">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter latest manual soil probe reading or sensor telemetry to recalculate irrigation recommendations in real-time.
        </p>

        <Input
          label="Soil Moisture Level (%)"
          type="number"
          min="0"
          max="100"
          value={moisture}
          onChange={e => setMoisture(e.target.value)}
          leftIcon={<Droplets className="w-4 h-4" />}
          helperText="Standard root zone threshold: 45-65% for tomato/potato"
          required
        />

        <Input
          label="Last Watered (Days Ago)"
          type="number"
          min="0"
          max="30"
          value={daysAgo}
          onChange={e => setDaysAgo(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4" />}
          helperText="Days elapsed since the previous drip/furrow cycle"
          required
        />

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="sm">
            Recalculate Decision
          </Button>
        </div>
      </form>
    </Modal>
  );
};
