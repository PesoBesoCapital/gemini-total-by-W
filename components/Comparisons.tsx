

import React, { useState, useMemo } from 'react';
import type { useMockData } from '../hooks/useMockData';
import type { Kpi, KpiKey } from '../types';
import { ChartBarIcon, FireIcon } from './icons';

type ComparisonsProps = {
  data: ReturnType<typeof useMockData>;
};

const KPI_LABELS: Record<KpiKey, string> = {
  activations: 'Activations',
  vhi: 'VHI',
  tablets: 'Tablets',
  protect: 'Protect',
  accessories: 'Accessories',
  rewards: 'Rewards',
};

const Comparisons: React.FC<ComparisonsProps> = React.memo(({ data }) => {
    const { salesPeriods, getEntriesForPeriod, reps } = data;
    
    // Sort periods newest first
    const sortedPeriods = useMemo(() => [...salesPeriods].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()), [salesPeriods]);

    const [periodAId, setPeriodAId] = useState(sortedPeriods[0]?.id || '');
    const [periodBId, setPeriodBId] = useState(sortedPeriods[1]?.id || '');

    const periodA = salesPeriods.find(p => p.id === periodAId);
    const periodB = salesPeriods.find(p => p.id === periodBId);

    const statsA = useMemo(() => {
        const entries = getEntriesForPeriod(periodAId);
        const initialKpis: Kpi = { activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0 };
        
        const teamTotal = entries.reduce((acc, entry) => {
             (Object.keys(acc) as KpiKey[]).forEach(key => { acc[key] += entry[key] || 0; });
             return acc;
        }, { ...initialKpis });

        const repStats = reps.map(rep => {
            const repEntries = entries.filter(e => e.repId === rep.id);
            const total = repEntries.reduce((acc, entry) => {
                 (Object.keys(acc) as KpiKey[]).forEach(key => { acc[key] += entry[key] || 0; });
                 return acc;
            }, { ...initialKpis });
            return { repId: rep.id, total };
        });

        return { teamTotal, repStats };
    }, [periodAId, getEntriesForPeriod, reps]);

    const statsB = useMemo(() => {
        const entries = getEntriesForPeriod(periodBId);
        const initialKpis: Kpi = { activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0 };
        
         const teamTotal = entries.reduce((acc, entry) => {
             (Object.keys(acc) as KpiKey[]).forEach(key => { acc[key] += entry[key] || 0; });
             return acc;
        }, { ...initialKpis });

         const repStats = reps.map(rep => {
            const repEntries = entries.filter(e => e.repId === rep.id);
            const total = repEntries.reduce((acc, entry) => {
                 (Object.keys(acc) as KpiKey[]).forEach(key => { acc[key] += entry[key] || 0; });
                 return acc;
            }, { ...initialKpis });
            return { repId: rep.id, total };
        });

        return { teamTotal, repStats };
    }, [periodBId, getEntriesForPeriod, reps]);

    const renderDiff = (valA: number, valB: number, isCurrency = false) => {
        const diff = valA - valB;
        const percent = valB !== 0 ? ((diff / valB) * 100).toFixed(1) : (valA > 0 ? '100' : '0');
        const color = diff >= 0 ? 'text-tw-teal' : 'text-tw-red';
        const sign = diff > 0 ? '+' : '';
        return (
            <div className="text-right">
                <p className={`font-bold text-xl ${color}`}>{sign}{isCurrency ? '$' : ''}{diff.toLocaleString()}</p>
                <p className={`text-xs ${color} opacity-80`}>{sign}{percent}%</p>
            </div>
        );
    };

    const getRepStatus = (repTotalA: Kpi, repTotalB: Kpi, teamTotalA: Kpi) => {
        // Simple logic: Helping if better than last month OR if contributing > 20% to team activations
        // Hurting if worse than last month AND below average contribution
        
        const actDiff = repTotalA.activations - repTotalB.activations;
        const shareOfTeam = teamTotalA.activations > 0 ? repTotalA.activations / teamTotalA.activations : 0;
        
        let status = 'Neutral';
        let color = 'bg-tw-navy/40 border-tw-teal/10';
        let advice = "Maintain consistency.";

        if (shareOfTeam > (1 / reps.length) * 1.2 || actDiff > 5) {
            status = 'Helping';
            color = 'bg-tw-teal/10 border-tw-teal/40';
            advice = "Strong performance. Keep pushing VHI attach rates.";
        } else if (shareOfTeam < (1 / reps.length) * 0.8 || actDiff < -2) {
            status = 'Hurting';
            color = 'bg-tw-red/10 border-tw-red/40';
            advice = "Needs volume boost. Focus on pitch frequency.";
        }

        // Specific advice logic
        if (repTotalA.vhi === 0) advice = "Critical: 0 VHI sales. Pitch every customer.";
        else if (repTotalA.protect === 0 && repTotalA.activations > 5) advice = "Missed opportunity: Protect attach is 0.";

        return { status, color, advice };
    };

    return (
        <div className="space-y-8">
             <div>
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ChartBarIcon className="h-6 w-6 text-tw-red" />
                    Monthly Comparisons
                </h1>
                <p className="text-sm text-gray-400">Compare performance across sales periods and analyze team impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-tw-navy/40 p-6 rounded-xl border border-tw-teal/20">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Period (A)</label>
                    <select 
                        value={periodAId} 
                        onChange={e => setPeriodAId(e.target.value)}
                        className="w-full bg-tw-navy/60 border-tw-teal/20 text-white rounded-md shadow-sm p-2 focus:ring-tw-red focus:border-transparent transition-all"
                    >
                        {sortedPeriods.map(p => <option key={p.id} value={p.id} className="bg-tw-navy text-white">{p.name} ({p.status})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Comparison Period (B)</label>
                    <select 
                        value={periodBId} 
                        onChange={e => setPeriodBId(e.target.value)}
                        className="w-full bg-tw-navy/60 border-tw-teal/20 text-white rounded-md shadow-sm p-2 focus:ring-tw-red focus:border-transparent transition-all"
                    >
                        {sortedPeriods.map(p => <option key={p.id} value={p.id} className="bg-tw-navy text-white">{p.name} ({p.status})</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(KPI_LABELS) as KpiKey[]).map(key => (
                     <div key={key} className="bg-tw-navy/40 p-5 rounded-lg border border-tw-teal/20 shadow-md">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">{KPI_LABELS[key]}</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-2xl font-bold text-white">{statsA.teamTotal[key].toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{periodA?.name}</p>
                            </div>
                            <div className="h-8 w-px bg-tw-teal/10 mx-2"></div>
                            <div>
                                <p className="text-2xl font-bold text-gray-400">{statsB.teamTotal[key].toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{periodB?.name}</p>
                            </div>
                             <div className="h-8 w-px bg-tw-teal/10 mx-2"></div>
                             {renderDiff(statsA.teamTotal[key], statsB.teamTotal[key], key === 'accessories')}
                        </div>
                     </div>
                ))}
            </div>

            <div className="space-y-4">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FireIcon className="h-6 w-6 text-tw-red" />
                    Team Breakdown: Who's Helping, Who's Hurting
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                    {reps.map(rep => {
                        const repDataA = statsA.repStats.find(r => r.repId === rep.id)?.total || { activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0 };
                        const repDataB = statsB.repStats.find(r => r.repId === rep.id)?.total || { activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0 };
                        
                        const { status, color, advice } = getRepStatus(repDataA, repDataB, statsA.teamTotal);

                        return (
                            <div key={rep.id} className={`p-4 rounded-xl border ${color} shadow-lg transition-all hover:bg-opacity-80`}>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-full bg-tw-navy/80 border-2 border-tw-teal/20 flex items-center justify-center font-bold text-lg text-white">
                                            {rep.avatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{rep.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${status === 'Helping' ? 'bg-tw-teal text-white' : status === 'Hurting' ? 'bg-tw-red text-white' : 'bg-gray-600 text-gray-300'}`}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                         <div>
                                            <p className="text-xs text-gray-400">Activations</p>
                                            <p className="font-bold text-white text-lg">{repDataA.activations} <span className="text-xs text-gray-500 font-normal ml-0.5">vs {repDataB.activations}</span></p>
                                        </div>
                                         <div>
                                            <p className="text-xs text-gray-400">VHI</p>
                                            <p className="font-bold text-white text-lg">{repDataA.vhi} <span className="text-xs text-gray-500 font-normal ml-0.5">vs {repDataB.vhi}</span></p>
                                        </div>
                                         <div>
                                            <p className="text-xs text-gray-400">Tablets</p>
                                            <p className="font-bold text-white text-lg">{repDataA.tablets} <span className="text-xs text-gray-500 font-normal ml-0.5">vs {repDataB.tablets}</span></p>
                                        </div>
                                         <div>
                                            <p className="text-xs text-gray-400">Protect</p>
                                            <p className="font-bold text-white text-lg">{repDataA.protect} <span className="text-xs text-gray-500 font-normal ml-0.5">vs {repDataB.protect}</span></p>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/3 bg-tw-navy/60 p-3 rounded-lg border border-tw-teal/10">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">What can help</p>
                                        <p className="text-sm text-gray-200 mt-0.5">"{advice}"</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
});

export default Comparisons;
