
import React, { useState } from 'react';
import type { PromoContent } from '../types';
import { getRolePlayFeedback } from '../services/geminiService';
import { PracticeIcon, MotivationIcon } from './icons';

// A generic loading spinner component to reuse
const Loader: React.FC<{text?: string}> = ({text = "Thinking..."}) => (
    <div className="flex items-center justify-center gap-2 text-gray-400">
        <svg className="animate-spin h-5 w-5 text-tw-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{text}</span>
    </div>
);

const PracticeHub: React.FC<{ promos: PromoContent[] }> = React.memo(({ promos }) => {
    const [mode, setMode] = useState<'pitch' | 'objection'>('pitch');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Pitch practice state
    const [selectedPromoId, setSelectedPromoId] = useState<string>(promos[0]?.id || '');
    const [customerPersona, setCustomerPersona] = useState('');
    const [pitch, setPitch] = useState('');
    const [pitchFeedback, setPitchFeedback] = useState('');
    const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);


    // Objection handling state
    const [objection, setObjection] = useState('');
    const [objectionResponse, setObjectionResponse] = useState('');
    const [objectionFeedback, setObjectionFeedback] = useState('');
    const [isGeneratingObjection, setIsGeneratingObjection] = useState(false);

    const handleGeneratePersona = async () => {
        const selectedPromo = promos.find(p => p.id === selectedPromoId);
        if (!selectedPromo) return;
        
        setIsGeneratingPersona(true);
        setError('');
        setCustomerPersona('');
        setPitch('');
        setPitchFeedback('');

        const prompt = `Generate a brief, one-paragraph customer persona for someone interested in the following Total Wireless promotion. Make them realistic, with clear needs and a potential hesitation.
        
        Promotion: "${selectedPromo.title}" - ${selectedPromo.description}`;
        const systemInstruction = "You are a sales training simulator. Create a customer persona for a role-play exercise.";

        try {
            const persona = await getRolePlayFeedback(prompt, systemInstruction);
            setCustomerPersona(persona);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsGeneratingPersona(false);
        }
    };

    const handleGetPitchFeedback = async () => {
        const selectedPromo = promos.find(p => p.id === selectedPromoId);
        if (!pitch.trim() || !customerPersona || !selectedPromo) return;

        setIsLoading(true);
        setError('');
        setPitchFeedback('');

        const prompt = `A sales rep is pitching the "${selectedPromo.title}" promotion to the following customer:
        
        Customer Persona: "${customerPersona}"
        
        Sales Rep's Pitch: "${pitch}"
        
        Please provide constructive feedback on the pitch. Analyze its strengths and weaknesses. Offer specific suggestions for improvement. Format your response using markdown.`;
        const systemInstruction = "You are an expert sales coach for Total Wireless. Critique the sales pitch based on the provided customer persona and promotion details.";

        try {
            const feedback = await getRolePlayFeedback(prompt, systemInstruction);
            setPitchFeedback(feedback);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateObjection = async () => {
        setIsGeneratingObjection(true);
        setError('');
        setObjection('');
        setObjectionResponse('');
        setObjectionFeedback('');

        const prompt = `Generate a common customer objection that a Total Wireless sales rep might face. The objection should be a single sentence or two.`;
        const systemInstruction = "You are a sales training simulator. Create a customer objection for a role-play exercise.";
        
        try {
            const newObjection = await getRolePlayFeedback(prompt, systemInstruction);
            setObjection(newObjection);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsGeneratingObjection(false);
        }
    };
    
     const handleGetResponseFeedback = async () => {
        if (!objectionResponse.trim() || !objection) return;

        setIsLoading(true);
        setError('');
        setObjectionFeedback('');

        const prompt = `A customer has the following objection:
        
        Customer Objection: "${objection}"
        
        Sales Rep's Response: "${objectionResponse}"
        
        Please provide constructive feedback on the sales rep's response. Analyze its effectiveness and suggest better ways to handle the objection. Format your response using markdown.`;
        const systemInstruction = "You are an expert sales coach for Total Wireless. Critique the rep's response to the customer's objection.";

        try {
            const feedback = await getRolePlayFeedback(prompt, systemInstruction);
            setObjectionFeedback(feedback);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                 <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <PracticeIcon className="h-6 w-6 text-tw-red" />
                    Practice Hub
                </h1>
                <p className="text-sm text-gray-400">Hone your skills with AI-powered role-playing scenarios.</p>
            </div>

            <div className="bg-tw-navy border-t border-tw-teal/20">
                <div className="flex items-center gap-2 p-2">
                    <button onClick={() => setMode('pitch')} className={`px-4 py-2 text-sm font-medium rounded-md flex-1 ${mode === 'pitch' ? 'bg-tw-red text-white' : 'text-gray-300 hover:bg-tw-navy/60'}`}>Pitch Practice</button>
                    <button onClick={() => setMode('objection')} className={`px-4 py-2 text-sm font-medium rounded-md flex-1 ${mode === 'objection' ? 'bg-tw-red text-white' : 'text-gray-300 hover:bg-tw-navy/60'}`}>Objection Handling</button>
                </div>
            </div>

            {mode === 'pitch' && (
                <div className="bg-tw-navy/40 border border-tw-teal/20 p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Step 1: Select a Promotion & Generate a Customer</h2>
                        <label htmlFor="promo-select" className="block text-sm font-medium text-gray-300 mt-2">Promotion</label>
                         <select id="promo-select" value={selectedPromoId} onChange={(e) => setSelectedPromoId(e.target.value)} className="mt-1 block w-full bg-tw-navy/60 border-tw-teal/20 text-white rounded-md shadow-sm focus:ring-tw-red focus:border-tw-red sm:text-sm p-2">
                            {promos.map(promo => <option key={promo.id} value={promo.id}>{promo.title}</option>)}
                        </select>
                        <button onClick={handleGeneratePersona} disabled={isGeneratingPersona} className="mt-4 bg-tw-blue hover:bg-tw-blue/80 text-white font-bold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full">
                            {isGeneratingPersona ? <Loader text="Generating Persona..." /> : 'Generate Customer Persona'}
                        </button>
                    </div>

                    {isGeneratingPersona && <Loader text="Generating Persona..." />}
                    
                    {customerPersona && (
                        <div className="space-y-6 border-t border-tw-teal/20 pt-6">
                             <div>
                                <h3 className="text-md font-semibold text-white mb-2">Your Customer:</h3>
                                <div className="p-4 bg-tw-navy/60 rounded-md border border-tw-teal/10 text-gray-300 text-sm leading-relaxed">
                                    <p>{customerPersona}</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Step 2: Write Your Pitch</h2>
                                <textarea
                                    rows={5}
                                    className="block w-full shadow-sm sm:text-sm bg-tw-navy/60 border-tw-teal/20 text-white rounded-md focus:ring-tw-red focus:border-tw-red mt-2 disabled:bg-tw-navy/40 p-3"
                                    placeholder="Based on the customer and promo, write your best sales pitch here..."
                                    value={pitch}
                                    onChange={(e) => setPitch(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button onClick={handleGetPitchFeedback} disabled={isLoading || !pitch.trim()} className="mt-4 w-full bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2 px-6 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? <Loader /> : 'Get Pitch Feedback'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {isLoading && <Loader />}
                    {error && <div className="bg-tw-red/20 border border-tw-red text-tw-red px-4 py-3 rounded-md" role="alert">{error}</div>}
                    {pitchFeedback && (
                        <div className="border-t border-tw-teal/20 pt-6">
                            <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2"><MotivationIcon className="h-5 w-5 text-tw-red"/>Coach's Feedback:</h3>
                            <div className="p-4 bg-tw-navy/60 rounded-md border border-tw-teal/10 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {pitchFeedback}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {mode === 'objection' && (
                 <div className="bg-tw-navy/40 border border-tw-teal/20 p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Step 1: Generate a Customer Objection</h2>
                         <button onClick={handleGenerateObjection} disabled={isGeneratingObjection} className="mt-4 bg-tw-blue hover:bg-tw-blue/80 text-white font-bold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full">
                            {isGeneratingObjection ? <Loader text="Generating Objection..."/> : 'Generate New Objection'}
                        </button>
                    </div>

                    {isGeneratingObjection && <Loader text="Generating Objection..." />}
                    
                    {objection && (
                        <div className="space-y-6 border-t border-tw-teal/20 pt-6">
                            <div>
                                <h3 className="text-md font-semibold text-white mb-2">Customer's Objection:</h3>
                                <div className="p-4 bg-tw-navy/60 rounded-md border border-tw-teal/10 text-gray-300 text-sm leading-relaxed">
                                    <p className="italic">"{objection}"</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Step 2: Write Your Response</h2>
                                <textarea
                                    rows={5}
                                    className="block w-full shadow-sm sm:text-sm bg-tw-navy/60 border-tw-teal/20 text-white rounded-md focus:ring-tw-red focus:border-tw-red mt-2 disabled:bg-tw-navy/40 p-3"
                                    placeholder="How would you respond to this objection?"
                                    value={objectionResponse}
                                    onChange={(e) => setObjectionResponse(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button onClick={handleGetResponseFeedback} disabled={isLoading || !objectionResponse.trim()} className="mt-4 w-full bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2 px-6 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? <Loader /> : 'Get Response Feedback'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {isLoading && <Loader />}
                    {error && <div className="bg-tw-red/20 border border-tw-red text-tw-red px-4 py-3 rounded-md" role="alert">{error}</div>}
                    {objectionFeedback && (
                         <div className="border-t border-tw-teal/20 pt-6">
                            <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2"><MotivationIcon className="h-5 w-5 text-tw-red"/>Coach's Feedback:</h3>
                            <div className="p-4 bg-tw-navy/60 rounded-md border border-tw-teal/10 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {objectionFeedback}
                            </div>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
});

export default PracticeHub;
