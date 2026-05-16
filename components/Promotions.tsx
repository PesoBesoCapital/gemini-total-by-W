import React from 'react';
import type { PromoContent } from '../types';
import { PromotionsIcon } from './icons';

interface PromotionsProps {
    promos: PromoContent[];
}

const getCategoryColor = (category: string) => {
    switch(category.toUpperCase()) {
        case 'DEVICE': return 'bg-tw-blue text-white';
        case 'TABLET': return 'bg-tw-blue/80 text-white';
        case 'PLANS': return 'bg-tw-teal text-white';
        case 'VHI': return 'bg-tw-teal/80 text-white';
        default: return 'bg-gray-500 text-white';
    }
}

const Promotions: React.FC<PromotionsProps> = ({ promos }) => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <PromotionsIcon className="h-6 w-6 text-tw-red" />
                    Promotions
                </h1>
                <p className="text-sm text-gray-400">Current active promotional content and details.</p>
            </div>
            
            <div className="space-y-4">
                {promos.filter(p => p.status === 'Active').map(promo => (
                    <div key={promo.id} className="bg-tw-navy/40 border border-tw-teal/20 rounded-xl shadow-lg p-6">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                            <h2 className="text-xl font-bold text-white">{promo.title}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryColor(promo.category)}`}>{promo.category}</span>
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-tw-teal text-white">{promo.status}</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">{promo.description}</p>
                        <p className="text-xs text-tw-teal font-mono">PROMO DATES: {promo.dates}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Promotions;