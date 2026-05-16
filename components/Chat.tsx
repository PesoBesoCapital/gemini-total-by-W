

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Rep, KpiKey, Entry } from '../types';
import { ChatIcon, RepsIcon, XIcon, PlusCircleIcon, MinusCircleIcon, ActivationIcon, AccessoryIcon, ProtectIcon, VhiIcon, TabletIcon, RewardsIcon } from './icons';
import type { useMockData, TimePeriod } from '../hooks/useMockData';
import ProgressBar from './ProgressBar';

interface TeamChatProps {
    messages: ChatMessage[];
    reps: Rep[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const KPI_NAMES_REPS: Record<KpiKey, string> = {
  activations: 'Activations',
  accessories: 'Accessories',
  protect: 'Protect',
  vhi: 'VHI',
  tablets: 'Tablets',
  rewards: 'Rewards',
};

const KPI_DETAILS: Record<KpiKey, { icon: React.FC<{className?: string}>, color: string }> = {
    activations: { icon: ActivationIcon, color: 'text-tw-blue' },
    accessories: { icon: AccessoryIcon, color: 'text-tw-teal' },
    protect: { icon: ProtectIcon, color: 'text-tw-red' },
    vhi: { icon: VhiIcon, color: 'text-tw-teal' },
    tablets: { icon: TabletIcon, color: 'text-tw-blue' },
    rewards: { icon: RewardsIcon, color: 'text-tw-teal' },
};

const LogSaleModal: React.FC<{
  rep: Rep;
  onClose: () => void;
  addEntry: (entry: Omit<Entry, 'id'>) => void;
}> = ({ rep, onClose, addEntry }) => {
    const initialForm = {
        activations: '', vhi: '', tablets: '', protect: '', accessories: '', rewards: '', notes: '', isPortIn: false
    };
    const [formData, setFormData] = useState(initialForm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const entryData: Omit<Entry, 'id'> = {
          repId: rep.id,
          date: new Date().toISOString().split('T')[0],
          activations: Number(formData.activations) || 0,
          vhi: Number(formData.vhi) || 0,
          tablets: Number(formData.tablets) || 0,
          protect: Number(formData.protect) || 0,
          accessories: Number(formData.accessories) || 0,
          rewards: Number(formData.rewards) || 0,
          notes: formData.notes,
          isPortIn: formData.isPortIn,
        };
        addEntry(entryData);
        onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true">
        <div className="bg-tw-navy border border-tw-teal/20 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fadeIn">
           <div className="flex justify-between items-center p-6 border-b border-tw-teal/10 bg-tw-navy/50 rounded-t-2xl">
               <div>
                   <h2 className="text-xl font-bold text-white">Log Sale</h2>
                   <p className="text-sm text-gray-400">Adding entry for <span className="text-white font-semibold">{rep.name}</span></p>
               </div>
               <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><XIcon className="w-6 h-6"/></button>
           </div>
           <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-5">
                    {Object.keys(KPI_NAMES_REPS).map(key => (
                         <div key={key}>
                            <label htmlFor={key} className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{KPI_NAMES_REPS[key as KpiKey]}</label>
                            <input type="number" id={key} name={key} value={formData[key as KpiKey]} onChange={handleChange} className="block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-tw-red focus:border-transparent sm:text-sm p-2.5 transition-all text-center tabular-nums"/>
                        </div>
                    ))}
                </div>
                 <div className="flex items-center bg-tw-navy/40 p-3 rounded-lg border border-tw-teal/10">
                    <input id="isPortIn" name="isPortIn" type="checkbox" checked={formData.isPortIn} onChange={handleChange} className="h-5 w-5 rounded border-tw-teal/20 bg-tw-navy/60 text-tw-red focus:ring-tw-red transition-colors"/>
                    <label htmlFor="isPortIn" className="ml-3 block text-sm font-medium text-gray-200 cursor-pointer select-none">Port-In Activation</label>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Notes (Optional)</label>
                    <textarea id="notes" name="notes" rows={2} value={formData.notes} onChange={handleChange} className="block w-full bg-tw-navy/60 border border-tw-teal/20 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-tw-red focus:border-transparent sm:text-sm p-3 transition-all"></textarea>
                </div>
                 <div className="flex justify-end gap-3 pt-4 border-t border-tw-teal/10">
                    <button type="button" onClick={onClose} className="bg-tw-navy/60 hover:bg-tw-navy/40 text-white font-medium py-2.5 px-5 rounded-lg border border-tw-teal/20 transition-colors">Cancel</button>
                    <button type="submit" className="bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-tw-red/20 transition-all transform active:scale-95">Log Sale</button>
                </div>
           </form>
        </div>
      </div>
    );
};

const KpiAdjuster: React.FC<{
  value: number;
  onAdjust: (adjustment: number) => void;
  isCurrency?: boolean;
}> = ({ value, onAdjust, isCurrency }) => {
  const increment = isCurrency ? 10 : 1;
  const safeValue = value || 0;

  return (
    <div className="flex items-center gap-1 bg-gray-900/50 rounded-full p-1 border border-gray-700">
      <button
        onClick={() => onAdjust(-increment)}
        className="text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors p-1 rounded-full focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrement value"
        disabled={safeValue <= 0}
      >
        <MinusCircleIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onAdjust(increment)}
        className="text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-colors p-1 rounded-full focus:outline-none"
        aria-label="Increment value"
      >
        <PlusCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};


// Component to display individual rep performance
export const RepPerformance: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
    const { repProgress } = data.displayProgress;
    const { teamGoals, setTimePeriod, timePeriod, adjustRepKpi, reps, addEntry } = data;
    const [isLogSaleModalOpen, setIsLogSaleModalOpen] = useState(false);
    const [selectedRepForSale, setSelectedRepForSale] = useState<Rep | null>(null);

    const getGoalForPeriod = (monthlyGoal: number, period: TimePeriod) => {
        if (period === 'this_week') return Math.max(1, Math.round(monthlyGoal / 4.33));
        return monthlyGoal;
    };

    const handleRepStatUpdate = (repId: number, kpi: KpiKey, adjustment: number) => {
        adjustRepKpi(repId, kpi, adjustment);
    };
    
    const openLogSaleModal = (rep: Rep) => {
        setSelectedRepForSale(rep);
        setIsLogSaleModalOpen(true);
    };


    return (
        <div className="space-y-8">
             <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-tw-red/20 rounded-lg">
                            <RepsIcon className="h-8 w-8 text-tw-red" />
                        </div>
                        Rep Performance
                    </h1>
                    <p className="text-base text-gray-400 mt-1 ml-1">Track progress, identify wins, and spot coaching opportunities.</p>
                </div>
                 <div className="flex items-center gap-3 bg-tw-navy/40 p-1.5 rounded-lg border border-tw-teal/20">
                    <select 
                        value={timePeriod} 
                        onChange={e => setTimePeriod(e.target.value as TimePeriod)}
                        className="bg-transparent border-none text-white text-sm font-medium focus:ring-0 cursor-pointer px-2 py-1"
                        aria-label="Select time period"
                    >
                        <option value="this_week">This Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                    </select>
                </div>
            </div>

            {timePeriod === 'last_month' && (
                <div className="bg-tw-blue/20 border border-tw-blue/30 text-tw-blue px-6 py-4 rounded-xl flex items-start gap-3" role="alert">
                    <div className="text-xl">⚠️</div>
                    <div>
                        <p className="font-bold">Viewing Historical Data</p>
                        <p className="text-sm opacity-80 mt-1">You are viewing last month's performance. Using the +/- adjustment buttons will affect <strong>today's</strong> numbers only.</p>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {repProgress.map(({ rep, progress }) => (
                    <div key={rep.id} className="bg-tw-navy/40 border border-tw-teal/20 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        {/* Rep Header */}
                        <div className="flex items-center justify-between p-6 bg-tw-navy/60 border-b border-tw-teal/10">
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-tw-navy/80 border-2 border-tw-teal/20 text-white flex items-center justify-center font-bold text-2xl shadow-md">{rep.avatar}</div>
                                <div>
                                    <p className="font-bold text-xl text-white">{rep.name}</p>
                                    <p className="text-xs font-medium text-tw-teal bg-tw-teal/10 px-2 py-0.5 rounded-full inline-block mt-1">Sales Representative</p>
                                </div>
                            </div>
                            <button onClick={() => openLogSaleModal(rep)} className="text-xs bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-tw-red/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                + Log Sale
                            </button>
                        </div>
                        
                        {/* KPIs List */}
                        <div className="p-6 space-y-6 bg-transparent">
                             {(Object.keys(KPI_NAMES_REPS) as KpiKey[]).map(key => {
                                const totalMonthlyGoal = teamGoals[key];
                                const numReps = reps.length || 1;
                                const repMonthlyGoal = totalMonthlyGoal / numReps;
                                const periodGoal = getGoalForPeriod(repMonthlyGoal, timePeriod);
                                const currentValue = progress[key] || 0;
                                
                                // Calculate percentage and determine status
                                const percentage = periodGoal > 0 ? (currentValue / periodGoal) * 100 : 0;
                                
                                let progressColor: 'teal' | 'yellow' | 'red' = 'red';
                                let statusLabel = 'Needs Focus';
                                let statusTextColor = 'text-tw-red';

                                if (percentage >= 100) {
                                    progressColor = 'teal';
                                    statusLabel = 'Goal Met!';
                                    statusTextColor = 'text-tw-teal';
                                } else if (percentage >= 70) {
                                    progressColor = 'yellow';
                                    statusLabel = 'Close';
                                    statusTextColor = 'text-yellow-400';
                                }

                                const isCurrency = key === 'accessories';
                                const details = KPI_DETAILS[key];
                                const Icon = details.icon;

                                return (
                                    <div key={key} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl bg-tw-navy/60 group-hover:bg-tw-navy/80 transition-colors border border-tw-teal/10`}>
                                                    <Icon className={`w-5 h-5 ${details.color}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-gray-200">{KPI_NAMES_REPS[key]}</p>
                                                        {periodGoal > 0 && (
                                                             <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-tw-navy/80 ${statusTextColor}`}>
                                                                {statusLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Target: {isCurrency && '$'}{Math.round(periodGoal).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <p className="text-white font-bold text-xl tabular-nums">
                                                        {isCurrency && '$'}{currentValue.toLocaleString()}
                                                    </p>
                                                    <KpiAdjuster
                                                        value={currentValue}
                                                        isCurrency={isCurrency}
                                                        onAdjust={(adjustment) => handleRepStatUpdate(rep.id, key, adjustment)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="relative mt-2">
                                            <ProgressBar percentage={percentage} color={progressColor === 'teal' ? 'teal' : progressColor} height="h-3" />
                                        </div>
                                    </div>
                                )
                             })}
                        </div>
                    </div>
                ))}
            </div>

            {isLogSaleModalOpen && selectedRepForSale && (
                <LogSaleModal rep={selectedRepForSale} onClose={() => setIsLogSaleModalOpen(false)} addEntry={addEntry} />
            )}
             <style>{`
                .tabular-nums {
                    font-variant-numeric: tabular-nums;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};


const TeamChat: React.FC<TeamChatProps> = ({ messages, reps, addMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [currentUser] = useState(reps.length > 0 ? reps[0] : null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser) return;
        
        addMessage({
            user: currentUser,
            text: newMessage,
        });
        setNewMessage('');
    };
    
    if (!currentUser) {
        return (
             <div className="flex flex-col h-[calc(100vh-10rem)] items-center justify-center text-center">
                <ChatIcon className="h-16 w-16 text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white">No Reps Available</h2>
                <p className="text-gray-400 mt-3 max-w-md">Please add a sales representative in the Admin Center to enable team chat and performance tracking.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
             <div className="mb-6">
                 <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-tw-red/20 rounded-lg">
                        <ChatIcon className="h-8 w-8 text-tw-red" />
                    </div>
                    Team Chat
                </h1>
                <p className="text-base text-gray-400 mt-1 ml-1">Collaborate, celebrate wins, and share updates with the squad.</p>
            </div>

            <div className="flex-1 bg-tw-navy/40 border border-tw-teal/20 rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gradient-to-b from-tw-navy/40 to-tw-navy/60">
                    {messages.length === 0 && (
                         <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50">
                            <ChatIcon className="w-12 h-12 mb-2"/>
                            <p>No messages yet. Start the conversation!</p>
                         </div>
                    )}
                    {messages.map((msg) => {
                        const isCurrentUser = msg.user.id === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                                {!isCurrentUser && (
                                    <div className="w-8 h-8 rounded-full bg-tw-navy/80 text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-tw-teal/20">{msg.user.avatar}</div>
                                )}
                                <div className={`max-w-[75%] p-4 rounded-2xl shadow-md ${isCurrentUser ? 'bg-tw-red text-white rounded-br-sm' : 'bg-tw-navy/80 text-gray-100 rounded-bl-sm border border-tw-teal/10'}`}>
                                    {!isCurrentUser && <p className="font-bold text-xs text-tw-teal mb-1">{msg.user.name}</p>}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-2 opacity-60 ${isCurrentUser ? 'text-white/80' : 'text-gray-400'} text-right`}>{msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                </div>
                                {isCurrentUser && (
                                    <div className="w-8 h-8 rounded-full bg-tw-red text-white flex items-center justify-center font-bold text-xs flex-shrink-0 border-2 border-tw-navy shadow-sm">{msg.user.avatar}</div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-5 bg-tw-navy/60 border-t border-tw-teal/10">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-tw-navy/40 border-tw-teal/20 text-white rounded-xl shadow-inner focus:ring-2 focus:ring-tw-red focus:border-transparent sm:text-sm px-5 py-3 transition-all"
                        />
                        <button type="submit" className="bg-tw-red hover:bg-tw-red/80 text-white font-bold p-3 rounded-xl shadow-lg shadow-tw-red/20 transition-all transform active:scale-95" disabled={!newMessage.trim()}>
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default TeamChat;