
import React from 'react';
import type { Sale, SaleType } from '../types';
import { ActivationIcon, AccessoryIcon, ProtectIcon, VhiIcon, TabletIcon, RewardsIcon } from './icons';

interface SalesFeedProps {
  sales: Sale[];
}

const SaleTypeDetails: Record<SaleType, { icon: React.FC<{className?: string}>, color: string }> = {
    'Activation': { icon: ActivationIcon, color: 'text-tw-blue' },
    'Accessory': { icon: AccessoryIcon, color: 'text-tw-teal' },
    'Protect': { icon: ProtectIcon, color: 'text-tw-red' },
    'VHI': { icon: VhiIcon, color: 'text-tw-teal' },
    'Tablet': { icon: TabletIcon, color: 'text-tw-blue' },
    'Rewards': { icon: RewardsIcon, color: 'text-tw-teal' },
};


const SalesFeed: React.FC<SalesFeedProps> = ({ sales }) => {
  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };
  
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {sales.map((sale, index) => {
          const details = SaleTypeDetails[sale.type];
          const Icon = details.icon;
          return (
            <div 
                key={sale.id} 
                className={`flex items-start space-x-4 p-3 rounded-lg bg-tw-navy/40 border border-tw-teal/10 animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms`}}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-tw-navy/60 border border-tw-teal/20`}>
                <Icon className={`w-5 h-5 ${details.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">{sale.user.name}</p>
                    <p className="text-xs font-medium text-gray-400">{timeSince(sale.timestamp)}</p>
                </div>
                <div className="mt-1 flex justify-between items-end">
                    <div>
                        <p className="font-medium text-gray-300">{sale.product}</p>
                         {sale.type === 'Activation' && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${sale.isPortIn ? 'bg-blue-800/50 text-blue-300' : 'bg-green-800/50 text-green-300'}`}>
                                {sale.isPortIn ? 'Port-In' : 'New Number'}
                            </span>
                        )}
                    </div>
                    {sale.value > 0 && (
                        <p className="text-lg font-bold text-white">
                            {['Accessory', 'VHI', 'Tablet', 'Protect'].includes(sale.type) && `$${sale.value.toLocaleString()}`}
                            {sale.type === 'Rewards' && `${sale.value}%`}
                        </p>
                    )}
                </div>
              </div>
            </div>
        )
      })}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SalesFeed;