import React from 'react';
import type { Habit, HabitCompletion } from '../types';
import { FireIcon, HabitsIcon } from './icons';

interface HabitsProps {
    habits: Habit[];
    completedHabits: HabitCompletion;
    toggleHabit: (habitId: string) => void;
}

const Habits: React.FC<HabitsProps> = ({ habits, completedHabits, toggleHabit }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysCompletions = completedHabits[today] || [];
    const progress = habits.length > 0 ? (todaysCompletions.length / habits.length) * 100 : 0;
    
    // Calculate streak
    const calculateStreak = () => {
        let streak = 0;
        let currentDate = new Date();
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayCompletions = completedHabits[dateStr] || [];
            if (dayCompletions.length === habits.length) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                if (streak === 0 && dateStr === today) {} 
                else if (dateStr !== today) { break; }
                 if(dateStr === today && dayCompletions.length < habits.length) {
                     currentDate.setDate(currentDate.getDate() - 1);
                     continue;
                 }
                 break;
            }
        }
        return streak;
    };

    const streak = calculateStreak();

    return (
        <div className="space-y-6">
            <div>
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <HabitsIcon className="h-6 w-6 text-red-500" />
                    Daily Habits Tracker
                </h1>
                <p className="text-sm text-gray-400">Build discipline through consistent daily actions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4">
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg text-white">Today's Progress</h2>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-right text-sm text-gray-400 mt-1">{progress.toFixed(0)}%</p>
                    </div>

                    {habits.map(habit => (
                        <label key={habit.id} htmlFor={`habit-${habit.id}`} className="flex items-center p-4 rounded-lg border-2 border-gray-700 has-[:checked]:bg-red-900/50 has-[:checked]:border-red-500 cursor-pointer transition-colors">
                            <input
                                id={`habit-${habit.id}`}
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                                checked={todaysCompletions.includes(habit.id)}
                                onChange={() => toggleHabit(habit.id)}
                            />
                            <div className="ml-4">
                                <p className="font-medium text-white">{habit.title}</p>
                                <p className="text-sm text-gray-400">{habit.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
                
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-xl shadow-lg text-center">
                        <FireIcon className="w-16 h-16 mx-auto" />
                        <p className="text-6xl font-bold mt-2">{streak}</p>
                        <p className="font-semibold text-xl">Day Streak</p>
                        <p className="text-sm opacity-90 mt-2">Complete all habits daily to maintain your streak!</p>
                    </div>
                     <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold text-white mb-3">This Week</h3>
                        <div className="space-y-2">
                           {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIndex) => {
                               return (
                                <div key={day} className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-gray-400">{day}</span>
                                    <div className="flex items-center gap-1">
                                        {habits.map(habit => {
                                            const d = new Date();
                                            const dayOffset = (d.getDay() - dayIndex + 7) % 7;
                                            const date = new Date(d);
                                            date.setDate(d.getDate() - dayOffset);
                                            const dateStr = date.toISOString().split('T')[0];
                                            const isComplete = (completedHabits[dateStr] || []).includes(habit.id);
                                            return <div key={habit.id} className={`w-4 h-4 rounded ${isComplete ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                        })}
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Habits;