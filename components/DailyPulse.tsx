
import React from 'react';
import type { useMockData } from '../hooks/useMockData';
import type { PulseTimeSlot, KpiKey } from '../types';
import { QuickEntryIcon, FireIcon } from './icons';

interface DailyPulseProps {
    data: ReturnType<typeof useMockData>;
}

// Fix: Changed Record<Partial<KpiKey>, string> to Partial<Record<KpiKey, string>>
// to correctly indicate that only a subset of KPI keys are provided in this map.
const KPI_SHORT_LABELS: Partial<Record<KpiKey, string>> = {
    activations: 'ACT',
    vhi: 'VHI',
    tablets: 'TAB',
    protect: 'PRO',
};

const DailyPulse: React.FC<DailyPulseProps> = React.memo(({ data }) => {
    const { dailyPulse, updatePulseEntry, teamGoals } = data;
    const today = new Date().toISOString().split('T')[0];
    const todaysPulse = dailyPulse[today] || {};
    const slots: PulseTimeSlot[] = ['11am', '2pm', '5pm', '7pm'];

    const handleInputChange = (slot: PulseTimeSlot, kpi: KpiKey, value: string) => {
        const numValue = parseInt(value) || 0;
        updatePulseEntry(today, slot, { [kpi]: numValue });
    };

    const getDailyGoal = (kpi: KpiKey) => {
        // Simple approximation of daily goal from monthly
        return Math.ceil(teamGoals[kpi] / 24); 
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <QuickEntryIcon className="h-6 w-6 text-tw-red" />
                        Daily Workday Pulse
                    </h1>
                    <p className="text-sm text-gray-400">Track team momentum throughout the day at key intervals.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-tw-navy/40 px-4 py-2 rounded-lg border border-tw-teal/20">
                        <p className="text-[10px] uppercase font-bold text-tw-teal">Daily ACT Goal</p>
                        <p className="text-xl font-black text-white">{getDailyGoal('activations')}</p>
                    </div>
                    <div className="bg-tw-navy/40 px-4 py-2 rounded-lg border border-tw-teal/20">
                        <p className="text-[10px] uppercase font-bold text-tw-teal">Daily VHI Goal</p>
                        <p className="text-xl font-black text-white">{getDailyGoal('vhi')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {slots.map((slot) => {
                    const entry = todaysPulse[slot] || { activations: 0, vhi: 0, tablets: 0, protect: 0 };
                    const isFuture = false; // Add logic if needed to disable future slots

                    return (
                        <div key={slot} className="bg-tw-navy/40 border border-tw-teal/20 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-tw-red/50">
                            <div className="bg-tw-navy/60 p-4 border-b border-tw-teal/10 flex justify-between items-center">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">{slot} Check-in</h3>
                                {entry.lastUpdated && (
                                    <span className="text-[10px] text-gray-500 font-mono">
                                        Updated {new Date(entry.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            
                            <div className="p-5 space-y-4">
                                {(Object.keys(KPI_SHORT_LABELS) as Array<keyof typeof KPI_SHORT_LABELS>).map(kpi => (
                                    <div key={kpi} className="flex items-center justify-between gap-4">
                                        <label className="text-xs font-bold text-gray-400 w-12">{KPI_SHORT_LABELS[kpi]}</label>
                                        <div className="flex-1">
                                            <input 
                                                type="number"
                                                min="0"
                                                value={entry[kpi] || 0}
                                                onChange={(e) => handleInputChange(slot, kpi, e.target.value)}
                                                className="w-full bg-tw-navy/60 border border-tw-teal/20 text-white font-bold rounded-lg px-3 py-2 focus:ring-2 focus:ring-tw-red focus:outline-none text-center tabular-nums"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-tw-navy/80 p-3 px-5 border-t border-tw-teal/10 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Pacing Status</span>
                                <div className="flex items-center gap-2">
                                    {(entry.activations || 0) >= (getDailyGoal('activations') * 0.7) ? (
                                        <span className="text-[10px] font-bold text-tw-teal flex items-center gap-1">
                                            <FireIcon className="w-3 h-3" /> ON TRACK
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-tw-red">PUSH VOLUME</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-tw-red/10 border border-tw-red/30 p-6 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-4">Pulse Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300">
                    <p>
                        The Daily Pulse feed is designed to keep management and the team synchronized during peak retail hours. 
                        Entries made at 11am, 2pm, 5pm, and 7pm allow the team to pivot strategies if volume is low.
                    </p>
                    <div className="bg-tw-navy/40 p-4 rounded-xl space-y-2">
                        <p className="font-bold text-white text-xs uppercase tracking-widest text-tw-red">Coach Advice</p>
                        <p className="italic text-gray-400">
                            "If the 2pm pulse shows less than 3 activations, prioritize port-in pitches for the afternoon rush. 
                            Ensure every tablet demo is logged before the 5pm check-in."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DailyPulse;
