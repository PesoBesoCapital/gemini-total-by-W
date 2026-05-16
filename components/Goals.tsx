import React, { useState } from 'react';
import type { Rep, Entry, KpiKey } from '../types';
import { QuickEntryIcon } from './icons';

interface QuickEntryProps {
  reps: Rep[];
  addEntry: (entry: Omit<Entry, 'id'>) => void;
}

const KPI_LABELS: Record<KpiKey, string> = {
  activations: 'Activations',
  vhi: 'VHI',
  tablets: 'Tablets',
  protect: 'Protect',
  accessories: 'Accessories ($)',
  rewards: 'Rewards (%)',
};

const QuickEntry: React.FC<QuickEntryProps> = React.memo(({ reps, addEntry }) => {
  const initialFormState = {
    repId: reps[0]?.id.toString() || '',
    date: new Date().toISOString().split('T')[0],
    activations: '',
    vhi: '',
    tablets: '',
    protect: '',
    accessories: '',
    rewards: '',
    notes: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData: Omit<Entry, 'id'> = {
      repId: Number(formData.repId),
      date: formData.date,
      activations: Number(formData.activations) || 0,
      vhi: Number(formData.vhi) || 0,
      tablets: Number(formData.tablets) || 0,
      protect: Number(formData.protect) || 0,
      accessories: Number(formData.accessories) || 0,
      rewards: Number(formData.rewards) || 0,
      notes: formData.notes,
    };
    addEntry(entryData);
    alert('Entry saved successfully!');
    clearForm();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-tw-red/20 rounded-lg">
                        <QuickEntryIcon className="h-6 w-6 text-tw-red" />
                    </div>
                    Quick Entry
                </h1>
                <p className="text-sm text-gray-400">Manually log sales and track progress</p>
            </div>
        </div>

        <div className="bg-tw-navy/40 p-5 sm:p-8 rounded-xl shadow-lg border border-tw-teal/20">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="repId" className="block text-sm font-medium text-gray-300">Rep Name</label>
                        <select id="repId" name="repId" value={formData.repId} onChange={handleChange} className="mt-1 block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md shadow-sm focus:ring-tw-red focus:border-transparent sm:text-sm p-2 transition-all">
                            {reps.map(rep => <option key={rep.id} value={rep.id} className="bg-tw-navy text-white">{rep.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md shadow-sm focus:ring-tw-red focus:border-transparent sm:text-sm p-2 transition-all"/>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(Object.keys(KPI_LABELS) as KpiKey[]).map(key => (
                         <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-300">{KPI_LABELS[key]}</label>
                            <input type="number" id={key} name={key} value={formData[key]} onChange={handleChange} className="mt-1 block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md shadow-sm focus:ring-tw-red focus:border-transparent sm:text-sm p-2 transition-all text-center tabular-nums"/>
                        </div>
                    ))}
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes (Optional)</label>
                    <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md shadow-sm focus:ring-tw-red focus:border-transparent sm:text-sm p-3 transition-all" placeholder="Add any context or notes about this entry..."></textarea>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={clearForm} className="bg-tw-navy/60 py-2 px-5 border border-tw-teal/20 rounded-md shadow-sm text-sm font-medium text-white hover:bg-tw-navy/40 transition-colors">Clear</button>
                    <button type="submit" className="bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2 px-8 rounded-md shadow-lg shadow-tw-red/20 transition-all transform active:scale-95">Save Entry</button>
                </div>
            </form>
        </div>
    </div>
  );
});

export default QuickEntry;