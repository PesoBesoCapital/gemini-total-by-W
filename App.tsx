
import React, { useState, Suspense } from 'react';
import { useMockData } from './hooks/useMockData';
import { ResponsiveAppShell } from './components/ResponsiveAppShell';

const DashboardRefresh = React.lazy(() => import('./components/DashboardRefresh'));
const QuickEntry = React.lazy(() => import('./components/Goals'));
const TeamChat = React.lazy(() => import('./components/Chat'));
const RepPerformance = React.lazy(() => import('./components/RepPerformanceFixed'));
const Promotions = React.lazy(() => import('./components/Promotions'));
const Habits = React.lazy(() => import('./components/SalesLogModal'));
const WeeklyReview = React.lazy(() => import('./components/SalesCoach'));
const Admin = React.lazy(() => import('./components/Header'));
const PracticeHub = React.lazy(() => import('./components/PracticeHub'));
const ClientManager = React.lazy(() => import('./components/ClientManager'));
const Comparisons = React.lazy(() => import('./components/Comparisons'));
const DailyPulse = React.lazy(() => import('./components/DailyPulse'));
const PlanRefresh2026 = React.lazy(() => import('./components/PlanRefresh2026'));

export type View = 'team-dashboard' | 'quick-entry' | 'reps' | 'promotions' | 'practice' | 'habits' | 'weekly-review' | 'team-chat' | 'admin' | 'client-manager' | 'comparisons' | 'daily-pulse' | 'plan-refresh';

const LoadingFallback = () => (
  <div className="flex h-full min-h-[50vh] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-tw-teal/20 border-t-tw-teal"></div>
      <p className="text-sm font-black uppercase tracking-widest text-tw-teal">Loading Module...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('team-dashboard');
  
  const mockData = useMockData();

  const renderView = () => {
    switch (activeView) {
      case 'team-dashboard':
        return <DashboardRefresh onNavigateToClientManager={() => setActiveView('client-manager')} />;
      case 'daily-pulse':
        return <DailyPulse data={mockData} />;
      case 'comparisons':
        return <Comparisons data={mockData} />;
      case 'plan-refresh':
        return <PlanRefresh2026 />;
      case 'quick-entry':
        return <QuickEntry reps={mockData.reps} addEntry={mockData.addEntry} />;
      case 'client-manager':
        return <ClientManager data={mockData} />;
      case 'reps':
        return <RepPerformance data={mockData} />;
      case 'promotions':
        return <Promotions promos={mockData.promos} />;
      case 'practice':
        return <PracticeHub promos={mockData.promos} />;
      case 'habits':
        return <Habits 
                  habits={mockData.habits} 
                  completedHabits={mockData.completedHabits} 
                  toggleHabit={mockData.toggleHabit} 
                />;
      case 'weekly-review':
        return <WeeklyReview />;
      case 'team-chat':
        return <TeamChat 
                  messages={mockData.chatMessages} 
                  reps={mockData.reps}
                  addMessage={mockData.addChatMessage}
                />;
      case 'admin':
        return <Admin 
                reps={mockData.reps}
                teamGoals={mockData.teamGoals}
                updateTeamGoals={mockData.setTeamGoals}
                addRep={mockData.addRep}
                removeRep={mockData.removeRep}
                promos={mockData.promos}
                addPromo={mockData.addPromo}
                updatePromo={mockData.updatePromo}
                removePromo={mockData.removePromo}
                displayProgress={mockData.displayProgress}
                adjustRepKpi={mockData.adjustRepKpi}
                timePeriod={mockData.timePeriod}
                setTimePeriod={mockData.setTimePeriod}
                salesPeriods={mockData.salesPeriods}
                addPeriod={mockData.addPeriod}
                updatePeriod={mockData.updatePeriod}
                removePeriod={mockData.removePeriod}
              />;
      default:
        return <DashboardRefresh onNavigateToClientManager={() => setActiveView('client-manager')} />;
    }
  };

  return (
    <ResponsiveAppShell activePage={activeView} onNavigate={setActiveView as any}>
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
    </ResponsiveAppShell>
  );
};

export default App;
