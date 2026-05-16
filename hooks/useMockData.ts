
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Rep, TeamGoal, Entry, Habit, HabitCompletion, QuizQuestion, KpiKey, Kpi, PromoContent, ChatMessage, Client, StoreLocation, ServicePlan, TabletPlan, SalesPeriod, DailyPulse, PulseTimeSlot, PulseEntry } from '../types';

const INITIAL_REPS: Rep[] = [
  { id: 1, name: 'Cesar', avatar: 'C' },
  { id: 2, name: 'Alonzo', avatar: 'A' },
];

const INITIAL_TEAM_GOALS: TeamGoal = {
  activations: 0,
  vhi: 0,
  tablets: 0,
  protect: 0,
  accessories: 0,
  rewards: 0,
};

const INITIAL_PROMOS: PromoContent[] = [
  {
    id: 'promo_iphone_16e',
    title: 'iPhone 16e - Featured Promo',
    category: 'DEVICE',
    description: '$79.99 with port + ID/Veriff. $65 plan focus.',
    dates: 'Current',
    status: 'Active',
  },
  {
    id: 'promo_s25fe',
    title: 'Samsung Galaxy S25FE',
    category: 'DEVICE',
    description: '$99.99 with port + ID/Veriff. 5G/5G+ plan focus.',
    dates: 'Current',
    status: 'Active',
  },
  {
    id: 'promo_iphone_13',
    title: 'iPhone 13',
    category: 'DEVICE',
    description: 'Free with switch requirements. $65 plan focus.',
    dates: 'Current',
    status: 'Active',
  },
  {
    id: 'promo_vhi',
    title: 'VHI Promo',
    category: 'VHI',
    description: '$4.99 router promo and 2nd month free when eligible and bundled with voice service.',
    dates: 'Current',
    status: 'Active',
  },
  {
    id: 'promo_tab8',
    title: 'Free Tab 8',
    category: 'TABLET',
    description: 'Free Tab 8 with 1 month of service. Great family, student, kid, and entertainment add-on.',
    dates: 'Current',
    status: 'Active',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

const STORES: StoreLocation[] = [
  { id: "melrose", name: "2015 Mannheim", city: "Melrose Park", hours: "10AM - 7PM", phone: "708-223-4598" },
  { id: "narragansett", name: "2640 Narragansett", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "franklin", name: "2743 Mannheim", city: "Franklin Park", hours: "10AM - 7PM", phone: "" },
  { id: "aurora", name: "1012 Farnsworth", city: "Aurora", hours: "10AM - 7PM", phone: "" },
  { id: "milwaukee", name: "3321 Milwaukee", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "diversey", name: "4640 Diversey", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "armitage", name: "4801 Armitage", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "belmont", name: "5601 Belmont", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "irving", name: "6500 Irving Park", city: "Chicago", hours: "10AM - 7PM", phone: "" },
  { id: "villa", name: "74 North", city: "Villa Park", hours: "10AM - 7PM", phone: "" }
];

const INITIAL_CLIENTS: Client[] = [
    {
        id: 'client_mock_1',
        fullName: 'Alice Johnson',
        phoneNumber: '(555) 123-4567',
        email: 'alice.j@example.com',
        accountPin: '1234',
        servicePlan: 'Total STARTER',
        storeLocationId: 'store1',
        linesToPort: 2,
        phoneLines: ['(555) 123-4567', '(555) 123-4568'],
        providerAccount: '123456789',
        transferPin: '0000',
        interestedVHI: true,
        interestedTablet: false,
        monthlyPrice: 110,
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: 'client_mock_2',
        fullName: 'Bob Smith',
        phoneNumber: '(555) 987-6543',
        email: 'bob.smith@example.com',
        accountPin: '4321',
        servicePlan: 'Total MAX 5G',
        storeLocationId: 'store2',
        linesToPort: 1,
        phoneLines: ['(555) 987-6543'],
        providerAccount: '987654321',
        transferPin: '1111',
        interestedVHI: false,
        interestedTablet: true,
        numberOfTablets: 1,
        tabletPlan: 'Tablet 5G',
        monthlyPrice: 75,
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'client_mock_3',
        fullName: 'Charlie Davis',
        phoneNumber: '(555) 555-5555',
        email: 'charlie.d@example.com',
        accountPin: '5555',
        servicePlan: 'Base 5G',
        storeLocationId: 'store1',
        linesToPort: 3,
        phoneLines: ['(555) 555-5555', '(555) 555-5556', '(555) 555-5557'],
        providerAccount: '555555555',
        transferPin: '2222',
        interestedVHI: true,
        interestedTablet: true,
        numberOfTablets: 2,
        tabletPlan: 'Base Unlimited',
        monthlyPrice: 165,
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'client_mock_4',
        fullName: 'Diana Prince',
        phoneNumber: '(555) 444-4444',
        email: 'diana.p@example.com',
        accountPin: '4444',
        servicePlan: 'Total ALL ACCESS',
        storeLocationId: 'store3',
        linesToPort: 1,
        phoneLines: ['(555) 444-4444'],
        providerAccount: '444444444',
        transferPin: '3333',
        interestedVHI: false,
        interestedTablet: false,
        monthlyPrice: 65,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        id: 'client_mock_5',
        fullName: 'Evan Wright',
        phoneNumber: '(555) 333-3333',
        email: 'evan.w@example.com',
        accountPin: '3333',
        servicePlan: 'Total MAX 5G BYO',
        storeLocationId: 'store2',
        linesToPort: 4,
        phoneLines: ['(555) 333-3333', '(555) 333-3334', '(555) 333-3335', '(555) 333-3336'],
        providerAccount: '333333333',
        transferPin: '4444',
        interestedVHI: true,
        interestedTablet: false,
        monthlyPrice: 145,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    }
];

const generateInitialEntries = (): Entry[] => {
    const entries: Entry[] = [];
    const today = new Date();
    
    // Generate for current month
    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        if (new Date(today.getFullYear(), today.getMonth(), i).getDay() % 6 !== 0) {
            for (const rep of INITIAL_REPS) {
                 if (Math.random() > 0.2) {
                    const date = new Date(today.getFullYear(), today.getMonth(), i).toISOString().split('T')[0];
                    entries.push({
                        id: `entry_${rep.id}_${date}`,
                        repId: rep.id,
                        date: date,
                        activations: Math.random() > 0.5 ? (Math.random() > 0.8 ? 2 : 1) : 0,
                        vhi: Math.random() > 0.9 ? 1 : 0,
                        tablets: Math.random() > 0.9 ? 1 : 0,
                        protect: Math.random() > 0.6 ? 1 : 0,
                        accessories: Math.floor(Math.random() * 150),
                        rewards: Math.random() > 0.5 ? Math.floor(Math.random() * 20 + 30) : 0,
                        isPortIn: Math.random() > 0.5,
                    });
                }
            }
        }
    }
    return entries;
};

const INITIAL_ENTRIES = generateInitialEntries();

const MOCK_HABITS: Habit[] = [
    { id: 'h1', title: 'Audit Every Account', description: 'Address check + proper notes' },
    { id: 'h2', title: 'Pitch Every Time', description: 'Tablet + Protect combo' },
    { id: 'h3', title: 'Follow-Ups (3+)', description: 'Minimum 3 daily per rep' },
    { id: 'h4', title: 'Energy & Presentation', description: 'Positive tone, confident posture' },
    { id: 'h5', title: 'Visual Progress Board', description: 'Updated nightly' },
];

const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: "What is required to get the iPhone 16e ON US?", options: ["New number only", "Port + 3 months Multi-Month + Veriff ID", "Any activation", "Port only"], correctAnswer: "Port + 3 months Multi-Month + Veriff ID", category: 'DEVICE', difficulty: 'medium' },
];

const generateDefaultPeriods = (): SalesPeriod[] => {
    const today = new Date();
    const periods: SalesPeriod[] = [];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    periods.push({
        id: `period_${today.getFullYear()}_${today.getMonth()}`,
        name: `${monthNames[today.getMonth()]} ${today.getFullYear()}`,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0],
        status: 'active'
    });
    return periods;
}

const useLocalStorage = <T,>(key: string, initialValue: T | (() => T)) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsed = JSON.parse(item);
                if (key === 'tw_chatMessages') {
                    return parsed.map((msg: ChatMessage) => ({...msg, timestamp: new Date(msg.timestamp)}));
                }
                return parsed;
            }
        } catch (error) {
            console.error(error);
        }
        return initialValue instanceof Function ? initialValue() : initialValue;
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(error);
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(timeout);
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
};

export type TimePeriod = 'this_week' | 'this_month' | 'last_month';

const getFilteredEntriesForPeriod = (entries: Entry[], timePeriod: TimePeriod): Entry[] => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    switch (timePeriod) {
        case 'this_week':
            startDate = new Date(now);
            const dayOfWeek = now.getDay();
            const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'this_month':
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
    }
    
    return entries.filter(e => {
      const [year, month, day] = e.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      return entryDate >= startDate && entryDate <= endDate;
    });
};

const useMockData = () => {
  const [reps, setRps] = useLocalStorage<Rep[]>('tw_reps', INITIAL_REPS);
  const [teamGoals, setTeamGoals] = useLocalStorage<TeamGoal>('tw_teamGoals', INITIAL_TEAM_GOALS);
  const [entries, setEntries] = useLocalStorage<Entry[]>('tw_entries', INITIAL_ENTRIES);
  const [habits] = useState<Habit[]>(MOCK_HABITS);
  const [completedHabits, setCompletedHabits] = useLocalStorage<HabitCompletion>('tw_completedHabits', {});
  const [quizQuestions] = useState<QuizQuestion[]>(MOCK_QUIZ_QUESTIONS);
  const [promos, setPromos] = useLocalStorage<PromoContent[]>('tw_promos', INITIAL_PROMOS);

  useEffect(() => {
      // Force update to new promos if the user's localStorage has the old ones
      if (!promos.some(p => p.id === 'promo_iphone_16e')) {
          setPromos(INITIAL_PROMOS);
      }
  }, [promos, setPromos]);

  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>('tw_chatMessages', INITIAL_CHAT_MESSAGES);
  const [clients, setClients] = useLocalStorage<Client[]>('tw_clients', INITIAL_CLIENTS);
  const [storeLocations] = useState<StoreLocation[]>(STORES);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('this_month');
  const [salesPeriods, setSalesPeriods] = useLocalStorage<SalesPeriod[]>('tw_salesPeriods', generateDefaultPeriods());
  const [dailyPulse, setDailyPulse] = useLocalStorage<DailyPulse>('tw_dailyPulse', {});

  const addRep = useCallback((name: string) => {
    setRps(prev => [...prev, { id: Date.now(), name, avatar: name.charAt(0).toUpperCase() }]);
  }, [setRps]);

  const removeRep = useCallback((id: number) => {
    setRps(prev => prev.filter(r => r.id !== id));
  }, [setRps]);

  const addEntry = useCallback((newEntry: Omit<Entry, 'id'>) => {
    setEntries(prev => [{ ...newEntry, id: `entry_${Date.now()}` }, ...prev]);
  }, [setEntries]);

  const adjustRepKpi = useCallback((repId: number, kpi: KpiKey, adjustment: number) => {
    const today = new Date().toISOString().split('T')[0];
    setEntries(prevEntries => {
        const newEntries = [...prevEntries];
        const todaysEntryIndex = newEntries.findIndex(e => e.repId === repId && e.date === today);
        if (todaysEntryIndex > -1) {
            const entryToUpdate = { ...newEntries[todaysEntryIndex] };
            const currentKpiValue = entryToUpdate[kpi] || 0;
            if (currentKpiValue + adjustment < 0) entryToUpdate[kpi] = 0;
            else entryToUpdate[kpi] = currentKpiValue + adjustment;
            newEntries[todaysEntryIndex] = entryToUpdate;
        } else if (adjustment > 0) {
            const newEntry: Entry = {
                id: `entry_adj_${Date.now()}`,
                repId,
                date: today,
                activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0,
                [kpi]: adjustment
            };
            newEntries.unshift(newEntry);
        }
        return newEntries;
    });
  }, [setEntries]);
  
  const toggleHabit = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setCompletedHabits(prev => {
        const todayHabits = prev[today] || [];
        if (todayHabits.includes(habitId)) {
            return { ...prev, [today]: todayHabits.filter(id => id !== habitId) };
        } else {
            return { ...prev, [today]: [...todayHabits, habitId] };
        }
    });
  }, [setCompletedHabits]);

  const addPromo = useCallback((promo: Omit<PromoContent, 'id'>) => {
      setPromos(prev => [{...promo, id: `promo_${Date.now()}`}, ...prev]);
  }, [setPromos]);
  
  const updatePromo = useCallback((updatedPromo: PromoContent) => {
      setPromos(prev => prev.map(p => p.id === updatedPromo.id ? updatedPromo : p));
  }, [setPromos]);
  
  const removePromo = useCallback((id: string) => {
      setPromos(prev => prev.filter(p => p.id !== id));
  }, [setPromos]);
  
  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, [setChatMessages]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
        ...client,
        id: `client_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
  }, [setClients]);

  const updateClient = useCallback((clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === clientId ? {...c, ...updates} : c));
  }, [setClients]);

  const updatePulseEntry = useCallback((date: string, slot: PulseTimeSlot, entry: Partial<PulseEntry>) => {
      setDailyPulse(prev => {
          const dateEntries = prev[date] || {};
          const currentSlot = dateEntries[slot] || { lastUpdated: new Date().toISOString() };
          return {
              ...prev,
              [date]: {
                  ...dateEntries,
                  [slot]: { ...currentSlot, ...entry, lastUpdated: new Date().toISOString() }
              }
          };
      });
  }, [setDailyPulse]);

  const addPeriod = useCallback((period: Omit<SalesPeriod, 'id' | 'status'>) => {
      setSalesPeriods(prev => [...prev, { ...period, id: `period_${Date.now()}`, status: 'active' }]);
  }, [setSalesPeriods]);
  
  const updatePeriod = useCallback((updatedPeriod: SalesPeriod) => {
      setSalesPeriods(prev => prev.map(p => p.id === updatedPeriod.id ? updatedPeriod : p));
  }, [setSalesPeriods]);
  
  const removePeriod = useCallback((id: string) => {
      setSalesPeriods(prev => prev.filter(p => p.id !== id));
  }, [setSalesPeriods]);

  const getEntriesForPeriod = useCallback((periodId: string) => {
      const period = salesPeriods.find(p => p.id === periodId);
      if (!period) return [];
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      end.setHours(23, 59, 59, 999);
      return entries.filter(e => {
          const entryDate = new Date(e.date);
          return entryDate >= start && entryDate <= end;
      });
  }, [salesPeriods, entries]);

  const displayProgress = useMemo(() => {
    const filteredEntries = getFilteredEntriesForPeriod(entries, timePeriod);
    const initialKpis: Kpi = { activations: 0, vhi: 0, tablets: 0, protect: 0, accessories: 0, rewards: 0 };
    const teamProgress = filteredEntries.reduce((acc, entry) => {
      (Object.keys(acc) as KpiKey[]).forEach(key => {
        acc[key] += entry[key] || 0;
      });
      return acc;
    }, { ...initialKpis });
    const repProgress = reps.map(rep => {
      const repEntries = filteredEntries.filter(e => e.repId === rep.id);
      const progress = repEntries.reduce((acc, entry) => {
        (Object.keys(acc) as KpiKey[]).forEach(key => {
          acc[key] += entry[key] || 0;
        });
        return acc;
      }, { ...initialKpis });
      return { rep, progress };
    });
    return { teamProgress, repProgress };
  }, [entries, reps, timePeriod]);
  
  const recentSales = useMemo<Entry[]>(() => {
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [entries]);

  return { 
    reps, teamGoals, entries, habits, completedHabits, quizQuestions, promos, chatMessages, clients, storeLocations, recentSales, salesPeriods, dailyPulse,
    addRep, removeRep, addEntry, toggleHabit, setTeamGoals, addPromo, updatePromo, removePromo, addChatMessage, addClient, updateClient, updatePulseEntry,
    timePeriod, setTimePeriod, displayProgress, adjustRepKpi, addPeriod, updatePeriod, removePeriod, getEntriesForPeriod,
  };
};

export { useMockData };
