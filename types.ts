
export interface Rep {
  id: number;
  name: string;
  avatar: string; // A or C for Alonzo/Cesar
}

export interface Kpi {
  activations: number;
  vhi: number;
  tablets: number;
  protect: number;
  accessories: number;
  rewards: number;
}

export type KpiKey = keyof Kpi;

export interface TeamGoal extends Kpi {}

export interface Entry extends Kpi {
  id: string;
  repId: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  isPortIn?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
}

export interface HabitCompletion {
  [date: string]: string[]; // date: ['habitId1', 'habitId2']
}

export interface PromoContent {
  id: string;
  title: string;
  category: string;
  description: string;
  dates: string;
  status: 'Active' | 'Inactive';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  promoId?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type SaleType = 'Activation' | 'Accessory' | 'Protect' | 'VHI' | 'Tablet' | 'Rewards';

export interface Sale {
  id: string | number;
  user: {
    name: string;
    avatar: string;
  };
  product: string;
  value: number;
  timestamp: Date;
  type: SaleType;
  isPortIn?: boolean;
}

export interface ChatMessage {
    id: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    text: string;
    timestamp: Date;
}


export interface StoreLocation {
    id: string;
    name: string;
    city?: string;
    hours?: string;
    phone?: string;
}

export type ServicePlan = 'Base 5G' | 'Total 5G' | 'Total 5G+' | 'Total STARTER' | 'Total MAX 5G' | 'Total ALL ACCESS' | 'Total MAX 5G BYO';
export type TabletPlan = 'None' | 'Base Unlimited' | '5G Unlimited' | 'Tablet Base' | 'Tablet 5G';


export interface Client {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    accountPin: string;
    servicePlan: ServicePlan;
    storeLocationId: string;
    linesToPort: number;
    phoneLines: string[];
    providerAccount: string;
    transferPin: string;
    interestedVHI: boolean;
    interestedTablet: boolean;
    numberOfTablets?: number;
    tabletPlan?: TabletPlan;
    appointmentDateTime?: string;
    notes?: string;
    status: 'pending' | 'active';
    monthlyPrice: number;
    createdAt: string; // ISO String
    autoBillPay?: boolean;
    byod?: boolean;
    vhiAutoBillPay?: boolean;
}

export interface SalesPeriod {
    id: string;
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    status: 'active' | 'closed';
}

export type PulseTimeSlot = '11am' | '2pm' | '5pm' | '7pm';

export interface PulseEntry extends Partial<Kpi> {
    lastUpdated: string;
}

export interface DailyPulse {
    [date: string]: {
        [slot in PulseTimeSlot]?: PulseEntry;
    };
}
