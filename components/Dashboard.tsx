
import React, { useState } from 'react';
import type { useMockData, TimePeriod } from '../hooks/useMockData';
import type { KpiKey, Sale } from '../types';
import StatCard from './StatCard';
import SalesFeed from './SalesFeed';
import BarChart from './BarChart';

type DashboardProps = {
  data: ReturnType<typeof useMockData>;
};

const KPI_NAMES: Record<KpiKey, string> = {
  activations: 'Activations',
  vhi: 'VHI',
  tablets: 'Tablets',
  protect: 'Protect',
  accessories: 'Accessories',
  rewards: 'Rewards',
};

const TeamDashboard: React.FC<DashboardProps> = ({ data }) => {
  const { teamGoals, displayProgress, recentSales, reps, setTimePeriod, timePeriod, adjustRepKpi } = data;
  const [selectedRepId, setSelectedRepId] = useState<number>(reps[0]?.id);
  
  const { teamProgress } = displayProgress;

  const chartLabels = Object.keys(KPI_NAMES).map(key => KPI_NAMES[key as KpiKey]);
  const chartData = Object.keys(KPI_NAMES).map(key => {
      const k = key as KpiKey;
      // Chart always shows progress towards the total monthly goal
      const percentage = teamGoals[k] > 0 ? (teamProgress[k] / teamGoals[k]) * 100 : 0;
      return percentage;
  });

  const handleStatUpdate = (kpi: KpiKey, newValue: number) => {
    const currentValue = teamProgress[kpi];
    const difference = newValue - currentValue;
    if (difference !== 0) {
      adjustRepKpi(selectedRepId, kpi, difference);
    }
  };

  const salesFeedData: Sale[] = recentSales.flatMap(entry => {
    const rep = reps.find(r => r.id === entry.repId);
    const sales: Sale[] = [];
    const user = { name: rep?.name || 'Unknown', avatar: `https://ui-avatars.com/api/?name=${rep?.name}&background=random` };
    const timestamp = new Date(entry.date);

    if (entry.activations > 0) {
        for(let i = 0; i < entry.activations; i++) {
            sales.push({
                id: `${entry.id}_act_${i}`,
                user,
                product: 'Activation',
                value: 0,
                timestamp,
                type: 'Activation',
                isPortIn: entry.isPortIn
            });
        }
    }
    if (entry.accessories > 0) {
        sales.push({
            id: `${entry.id}_acc`,
            user,
            product: 'Accessory Sale',
            value: entry.accessories,
            timestamp,
            type: 'Accessory'
        });
    }
    if (entry.protect > 0) {
         for(let i = 0; i < entry.protect; i++) {
            sales.push({
                id: `${entry.id}_protect_${i}`,
                user,
                product: 'TotalWireless Protect',
                value: 12,
                timestamp,
                type: 'Protect'
            });
         }
    }
    if (entry.vhi > 0) {
        for(let i = 0; i < entry.vhi; i++) {
            sales.push({
                id: `${entry.id}_vhi_${i}`,
                user,
                product: 'Verizon Home Internet',
                value: 60,
                timestamp,
                type: 'VHI'
            });
        }
    }
    if (entry.tablets > 0) {
        for(let i = 0; i < entry.tablets; i++) {
            sales.push({
                id: `${entry.id}_tablet_${i}`,
                user,
                product: 'Tablet Add-on',
                value: 40,
                timestamp,
                type: 'Tablet'
            });
        }
    }
    if (entry.rewards > 0) {
        sales.push({
            id: `${entry.id}_rewards`,
            user,
            product: 'Total Rewards Signup',
            value: entry.rewards,
            timestamp,
            type: 'Rewards'
        });
    }

    return sales;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

  const timePeriodLabels: Record<TimePeriod, string> = {
    this_week: 'This Week',
    this_month: 'This Month',
    last_month: 'Last Month',
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-md text-gray-400">Welcome back, here's your team's performance overview.</p>
        </div>
        <div className="flex items-center gap-4">
            <div>
                <label htmlFor="rep-selector" className="text-xs text-gray-400 mr-2">Adjust for:</label>
                <select 
                    id="rep-selector"
                    value={selectedRepId} 
                    onChange={e => setSelectedRepId(Number(e.target.value))}
                    className="bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md text-sm p-2 focus:ring-tw-red focus:border-transparent transition-all"
                    aria-label="Select representative for adjustments"
                >
                    {reps.map(rep => <option key={rep.id} value={rep.id} className="bg-tw-navy text-white">{rep.name}</option>)}
                </select>
            </div>
            <select 
                value={timePeriod} 
                onChange={e => setTimePeriod(e.target.value as TimePeriod)}
                className="bg-tw-navy/60 border border-tw-teal/20 text-white rounded-md text-sm p-2 focus:ring-tw-red focus:border-transparent transition-all"
                aria-label="Select time period"
            >
                <option value="this_week" className="bg-tw-navy text-white">This Week</option>
                <option value="this_month" className="bg-tw-navy text-white">This Month</option>
                <option value="last_month" className="bg-tw-navy text-white">Last Month</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title={`Activations (${timePeriodLabels[timePeriod]})`} 
            value={teamProgress.activations.toString()}
            currentNumericValue={teamProgress.activations}
            onValueChange={(newValue) => handleStatUpdate('activations', newValue)}
        />
        <StatCard 
            title={`Accessories (${timePeriodLabels[timePeriod]})`} 
            value={`$${teamProgress.accessories.toLocaleString()}`}
            currentNumericValue={teamProgress.accessories}
            onValueChange={(newValue) => handleStatUpdate('accessories', newValue)}
        />
        <StatCard 
            title={`VHI (${timePeriodLabels[timePeriod]})`} 
            value={teamProgress.vhi.toString()} 
            subValue={`${((teamProgress.vhi / teamGoals.vhi) * 100).toFixed(0)}% of monthly goal`}
            currentNumericValue={teamProgress.vhi}
            onValueChange={(newValue) => handleStatUpdate('vhi', newValue)}
        />
        <StatCard 
            title={`Tablets (${timePeriodLabels[timePeriod]})`} 
            value={teamProgress.tablets.toString()} 
            subValue={`${((teamProgress.tablets / teamGoals.tablets) * 100).toFixed(0)}% of monthly goal`}
            currentNumericValue={teamProgress.tablets}
            onValueChange={(newValue) => handleStatUpdate('tablets', newValue)}
        />
        <p className="text-xs text-gray-500 text-center col-span-full -mt-2">
            Click any stat to edit. Adjustments will be applied to <span className="font-bold text-gray-300">{reps.find(r => r.id === selectedRepId)?.name || '...'}</span>.
        </p>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-tw-navy/40 p-6 rounded-xl shadow-lg border border-tw-teal/20">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Goal Progress ({timePeriodLabels[timePeriod]})</h2>
          <div className="h-96">
            <BarChart
              labels={chartLabels}
              data={chartData}
            />
          </div>
        </div>
        <div className="bg-tw-navy/40 p-6 rounded-xl shadow-lg border border-tw-teal/20">
            <h2 className="text-lg font-semibold text-white mb-4">Live Sales Feed</h2>
            <SalesFeed sales={salesFeedData} />
        </div>
       </div>

    </div>
  );
};

export default TeamDashboard;
