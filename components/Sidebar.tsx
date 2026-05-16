
import React from 'react';
import type { View } from '../App';
import { AdminIcon, ChatIcon, ClientManagerIcon, HabitsIcon, PracticeIcon, PromotionsIcon, QuickEntryIcon, RepsIcon, TeamDashboardIcon, WeeklyReviewIcon, ChartBarIcon, FireIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem = React.memo<{
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}>(({ id, icon, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-tw-red text-white shadow-lg shadow-tw-red/20' : 'text-gray-300 hover:bg-tw-teal/10 hover:text-tw-teal'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
));

const Sidebar: React.FC<SidebarProps> = React.memo(({ activeView, setActiveView }) => {
    const handleNavClick = React.useCallback((id: string) => {
        setActiveView(id as View);
    }, [setActiveView]);

    const mainNavItems = React.useMemo(() => [
        { id: 'team-dashboard', icon: <TeamDashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
        { id: 'daily-pulse', icon: <FireIcon className="w-5 h-5" />, label: 'Workday Pulse' },
        { id: 'comparisons', icon: <ChartBarIcon className="w-5 h-5" />, label: 'Comparisons' },
        { id: 'client-manager', icon: <ClientManagerIcon className="w-5 h-5" />, label: 'Client Manager' },
        { id: 'quick-entry', icon: <QuickEntryIcon className="w-5 h-5" />, label: 'Quick Entry' },
        { id: 'reps', icon: <RepsIcon className="w-5 h-5" />, label: 'Rep Performance' },
        { id: 'team-chat', icon: <ChatIcon className="w-5 h-5" />, label: 'Team Chat' },
    ], []);

     const trainingNavItems = React.useMemo(() => [
        { id: 'plan-refresh', icon: <PracticeIcon className="w-5 h-5" />, label: '2026 Plan Refresh' },
        { id: 'promotions', icon: <PromotionsIcon className="w-5 h-5" />, label: 'Promotions' },
        { id: 'practice', icon: <PracticeIcon className="w-5 h-5" />, label: 'Practice Hub' },
        { id: 'habits', icon: <HabitsIcon className="w-5 h-5" />, label: 'Habits Tracker' },
        { id: 'weekly-review', icon: <WeeklyReviewIcon className="w-5 h-5" />, label: 'Review & Coach' },
    ], []);

    return (
        <aside className="w-64 bg-tw-navy text-white flex flex-col p-4 border-r border-tw-teal/20">
            <div className="flex items-center gap-2 flex-shrink-0 px-2 mb-8">
                 <svg className="h-9 w-auto text-tw-red" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="currentColor"/><path d="M12 12h7v16h-7z" fill="#fff"/><path d="M21 12h7v16h-7z" fill="#fff" fillOpacity=".7"/></svg>
                <span className="font-bold text-xl text-white">TotalWireless <span className="text-tw-teal">Hub</span></span>
            </div>
            
            <nav className="flex-1 flex flex-col gap-6">
                <div>
                    <h3 className="px-3 text-xs font-semibold text-tw-teal uppercase tracking-wider mb-2">Analytics</h3>
                    <div className="flex flex-col gap-1">
                        {mainNavItems.map(item => (
                            <NavItem
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                isActive={activeView === item.id}
                                onClick={handleNavClick}
                            />
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="px-3 text-xs font-semibold text-tw-teal uppercase tracking-wider mb-2">Development</h3>
                    <div className="flex flex-col gap-1">
                        {trainingNavItems.map(item => (
                            <NavItem
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                isActive={activeView === item.id}
                                onClick={handleNavClick}
                            />
                        ))}
                    </div>
                </div>
            </nav>
            
            <div className="mt-auto">
                 <NavItem
                    id="admin"
                    icon={<AdminIcon className="w-5 h-5" />}
                    label="Admin Center"
                    isActive={activeView === 'admin'}
                    onClick={handleNavClick}
                />
            </div>
        </aside>
    );
});

export default Sidebar;
