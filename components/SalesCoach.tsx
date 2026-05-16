import React, { useState } from 'react';
import { getSalesCoaching } from '../services/geminiService';
import { MotivationIcon, WeeklyReviewIcon } from './icons';

const questions = [
  "Did we hit daily activation goals?",
  "Were all customers pitched on VHI & Tablets?",
  "How many follow-ups converted?",
  "How did presentation and energy improve?",
  "What will we adjust next week?",
];

const WeeklyReview: React.FC = () => {
    const [responses, setResponses] = useState<string[]>(Array(questions.length).fill(''));
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResponseChange = (index: number, value: string) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    const handleAskCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;
        setIsLoading(true);
        setError('');
        setAiResponse('');
        try {
            const response = await getSalesCoaching(aiPrompt);
            setAiResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };


    const getWeekRange = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-tw-red/20 rounded-lg">
                        <WeeklyReviewIcon className="h-6 w-6 text-tw-red" />
                    </div>
                    Review & Coach
                </h1>
                <p className="text-sm text-gray-400">Reflect on the past week and get AI-powered coaching</p>
            </div>
            
            <div className="bg-tw-navy/40 border border-tw-teal/20 p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-6 text-white">Week of {getWeekRange()}</h2>
                
                <form className="space-y-6">
                    {questions.map((q, index) => (
                         <div key={index}>
                            <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-300 mb-2">{q}</label>
                            <textarea
                                id={`question-${index}`}
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm bg-tw-navy/60 border border-tw-teal/20 text-white rounded-lg focus:ring-2 focus:ring-tw-red focus:border-transparent p-3 transition-all"
                                placeholder="Enter your response..."
                                value={responses[index]}
                                onChange={(e) => handleResponseChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-tw-red/20 transition-all transform active:scale-95">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>

             {/* AI Coach Section */}
            <div className="bg-tw-navy/40 border border-tw-teal/20 p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <div className="p-1.5 bg-tw-red/20 rounded-lg">
                         <MotivationIcon className="h-5 w-5 text-tw-red" />
                    </div>
                    AI Sales Coach
                </h2>
                <p className="text-sm text-gray-400 mb-4">Ask for advice on sales techniques, product knowledge, or handling objections.</p>
                
                <form onSubmit={handleAskCoach} className="space-y-4">
                    <div>
                        <label htmlFor="ai-prompt" className="sr-only">Your Question</label>
                        <textarea
                            id="ai-prompt"
                            rows={3}
                            className="block w-full shadow-sm sm:text-sm bg-tw-navy/60 border border-tw-teal/20 text-white rounded-lg focus:ring-2 focus:ring-tw-red focus:border-transparent mb-3 p-3 transition-all disabled:opacity-50"
                            placeholder="e.g., How can I better handle price objections?"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-tw-red/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={isLoading || !aiPrompt.trim()}
                        >
                            {isLoading ? 'Getting Advice...' : 'Ask Coach'}
                        </button>
                    </div>
                </form>
                
                {(isLoading || error || aiResponse) && (
                    <div className="mt-6 border-t border-tw-teal/10 pt-6">
                        {isLoading && (
                             <div className="flex items-center justify-center gap-2 text-gray-400">
                                <svg className="animate-spin h-5 w-5 text-tw-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Thinking...</span>
                            </div>
                        )}
                        {error && <div className="bg-tw-red/20 border border-tw-red/30 text-tw-red px-4 py-3 rounded-md" role="alert">{error}</div>}
                        {aiResponse && (
                             <div className="animate-fadeIn">
                                <h3 className="text-md font-semibold text-white mb-3">Coach's Advice:</h3>
                                <div className="p-5 bg-tw-navy/60 rounded-xl border border-tw-teal/10 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
                                    {aiResponse}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyReview;