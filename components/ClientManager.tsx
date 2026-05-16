
import React, { useState, useMemo, useEffect } from 'react';
import type { useMockData } from '../hooks/useMockData';
import type { Client, ServicePlan, TabletPlan, StoreLocation } from '../types';
import { UserPlusIcon, ChartPieIcon, PlusIcon, PencilIcon } from './icons';

type ClientManagerProps = {
  data: ReturnType<typeof useMockData>;
};

const calculatePrice = (
    plan: ServicePlan, 
    lines: number, 
    autoBillPay: boolean, 
    byod: boolean, 
    interestedVHI: boolean, 
    vhiAutoBillPay: boolean,
    numberOfTablets: number,
    tabletPlan: TabletPlan
): number => {
    const numLines = Number(lines);
    const numTablets = Number(numberOfTablets);

    if (numLines <= 0 && numTablets <= 0) return 0;
    
    let phonePrice = 0;

    if (numLines > 0) {
        // NEW 2026 PLANS LOGIC
        if (plan === 'Total STARTER') {
            if (numLines === 1) phonePrice = 40;
            else if (numLines === 2) phonePrice = 75;
            else if (numLines === 3) phonePrice = 90;
            else phonePrice = 90 + (numLines - 3) * 10;
        } else if (plan === 'Total MAX 5G') {
            if (numLines === 1) phonePrice = 55;
            else if (numLines === 2) phonePrice = 85;
            else if (numLines === 3) phonePrice = 110;
            else phonePrice = 110 + (numLines - 3) * 10;
        } else if (plan === 'Total ALL ACCESS') {
            if (numLines === 1) phonePrice = 65;
            else if (numLines === 2) phonePrice = 95;
            else if (numLines === 3) phonePrice = 120;
            else phonePrice = 120 + (numLines - 3) * 10;
        } else if (plan === 'Total MAX 5G BYO') {
            if (numLines === 1) phonePrice = 30;
            else if (numLines === 2) phonePrice = 60;
            else if (numLines === 3) phonePrice = 90;
            else phonePrice = 90 + (numLines - 3) * 20;
        } 
        // OLD PLANS LOGIC
        else if (byod) {
            switch (plan) {
                case 'Base 5G':
                    if (numLines === 1) phonePrice = 20;
                    else if (numLines === 2) phonePrice = 60;
                    else if (numLines === 3 || numLines === 4) phonePrice = 80;
                    else if (numLines >= 5) phonePrice = 80 + (numLines - 4) * 15;
                    break;
                case 'Total 5G':
                    if (numLines === 1) phonePrice = autoBillPay ? 25 : 30;
                    else if (numLines === 2) phonePrice = 60;
                    else if (numLines === 3 || numLines === 4) phonePrice = 85;
                    else if (numLines >= 5) phonePrice = 85 + (numLines - 4) * 15;
                    break;
                case 'Total 5G+':
                    if (numLines === 1) phonePrice = autoBillPay ? 30 : 35;
                    else if (numLines === 2) phonePrice = 65;
                    else if (numLines === 3 || numLines === 4) phonePrice = 90;
                    else if (numLines >= 5) phonePrice = 90 + (numLines - 4) * 15;
                    break;
            }
        } else { // Regular pricing
            switch (plan) {
                case 'Base 5G':
                    if (numLines === 1) phonePrice = 40;
                    else if (numLines === 2) phonePrice = 80;
                    else if (numLines === 3 || numLines === 4) phonePrice = 100;
                    else if (numLines >= 5) phonePrice = 100 + (numLines - 4) * 15;
                    break;
                case 'Total 5G':
                    if (numLines === 1) phonePrice = autoBillPay ? 50 : 55;
                    else if (numLines === 2) phonePrice = 85;
                    else if (numLines === 3 || numLines === 4) phonePrice = 110;
                    else if (numLines >= 5) phonePrice = 110 + (numLines - 4) * 15;
                    break;
                case 'Total 5G+':
                    if (numLines === 1) phonePrice = autoBillPay ? 60 : 65;
                    else if (numLines === 2) phonePrice = 95;
                    else if (numLines === 3 || numLines === 4) phonePrice = 120;
                    else if (numLines >= 5) phonePrice = 120 + (numLines - 4) * 15;
                    break;
            }
        }
    }


    let totalPrice = phonePrice;
    
    // Add Tablet price
    let tabletPrice = 0;
    if (numTablets > 0 && tabletPlan !== 'None') {
        const isBundled = numLines > 0;
        if (tabletPlan === 'Base Unlimited') {
            tabletPrice = (isBundled ? 10 : 50) * numTablets;
        } else if (tabletPlan === '5G Unlimited') {
            tabletPrice = (isBundled ? 20 : 60) * numTablets;
        } else if (tabletPlan === 'Tablet Base') { // 2026 Plan
            tabletPrice = (isBundled ? 10 : 50) * numTablets;
        } else if (tabletPlan === 'Tablet 5G') { // 2026 Plan
            tabletPrice = (isBundled ? 20 : 60) * numTablets;
        }
    }
    totalPrice += tabletPrice;

    // Add VHI price (bundled, post-promo)
    // 2026 Bundle price is $35 ($60 standalone, $25 off bundle)
    if (interestedVHI) {
        if (plan === 'Total STARTER' || plan === 'Total MAX 5G' || plan === 'Total ALL ACCESS' || plan === 'Total MAX 5G BYO') {
             totalPrice += (numLines > 0 ? 35 : 60);
        } else {
             totalPrice += vhiAutoBillPay ? 35 : 45;
        }
    }
    
    return totalPrice;
};

const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const isNewPlansLive = new Date() >= new Date('2026-05-13T00:00:00');

const ClientForm: React.FC<{ 
    initialClient: Partial<Client>; 
    onSubmit: (clientData: any) => void;
    onCancel?: () => void;
    storeLocations: StoreLocation[];
    isEditing: boolean;
}> = React.memo(({ initialClient, onSubmit, onCancel, storeLocations, isEditing }) => {
    const defaultPlan = isNewPlansLive ? 'Total STARTER' : 'Base 5G';
    const initialFormState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        accountPin: '',
        servicePlan: defaultPlan as ServicePlan,
        storeLocationId: storeLocations[0]?.id || '',
        linesToPort: 1,
        phoneLines: [''],
        providerAccount: '',
        transferPin: '',
        interestedVHI: false,
        interestedTablet: false,
        numberOfTablets: 1,
        tabletPlan: 'None' as TabletPlan,
        autoBillPay: false,
        byod: false,
        vhiAutoBillPay: false,
        deviceFinancingMonthly: 0,
        appointmentDateTime: '',
        notes: '',
        ...initialClient,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [monthlyPrice, setMonthlyPrice] = useState(0);

    useEffect(() => {
        if (isEditing) return;

        const loadPendingQuote = () => {
            const pending = localStorage.getItem("tw_pending_client_quote");
            if (!pending) return;

            const quote = JSON.parse(pending);

            setFormData((current) => {
                let quoteDetails = `Dashboard Quote: ${quote.selectedPlan?.name} - $${quote.estimatedMonthly}/mo. Add-ons: ${(quote.selectedAddOns || []).map((item: any) => item.name).join(", ") || "None"}.`;
                if (quote.financing) {
                    quoteDetails += ` Financing: ${quote.financing.device?.name} (Status: ${quote.financing.status}, Est. $${quote.financing.estimatedMonthly}/mo).`;
                }
                const quoteString = `Dashboard Quote: ${quote.selectedPlan?.name}`;
                let nextNotes = current.notes;
                if (!nextNotes.includes(quoteString)) {
                   nextNotes = `${current.notes || ""}\n\n${quoteDetails} ${quote.customer?.notes || ""}`.trim();
                }

                return {
                    ...current,
                    fullName: quote.customer?.fullName || current.fullName,
                    phoneNumber: quote.customer?.phoneNumber || current.phoneNumber,
                    appointmentDateTime: quote.customer?.appointmentDate || current.appointmentDateTime,
                    notes: nextNotes,
                    servicePlan: quote.selectedPlan?.name || current.servicePlan,
                    interestedVHI: (quote.selectedAddOns || []).some((item: any) => item.id === "vhi") || current.interestedVHI,
                    interestedTablet: (quote.selectedAddOns || []).some((item: any) => item.id?.includes("tablet")) || current.interestedTablet,
                    deviceFinancingMonthly: quote.financing ? Number(quote.financing.estimatedMonthly) : current.deviceFinancingMonthly,
                };
            });
        };

        loadPendingQuote();
        window.addEventListener("tw:client-profile-created", loadPendingQuote);
        return () => window.removeEventListener("tw:client-profile-created", loadPendingQuote);
    }, [isEditing]);

    useEffect(() => {
        const price = calculatePrice(
            formData.servicePlan,
            formData.linesToPort,
            formData.autoBillPay,
            formData.byod,
            formData.interestedVHI,
            formData.vhiAutoBillPay,
            formData.interestedTablet ? formData.numberOfTablets : 0,
            formData.interestedTablet ? formData.tabletPlan : 'None'
        );
        setMonthlyPrice(price);
    }, [formData]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            phoneLines: Array.from({ length: Number(prev.linesToPort) }, (_, i) => prev.phoneLines[i] || '')
        }));
    }, [formData.linesToPort]);

    useEffect(() => {
        const isEligibleForDiscount = (formData.servicePlan === 'Total 5G' || formData.servicePlan === 'Total 5G+') && Number(formData.linesToPort) === 1;
        if (!isEligibleForDiscount && formData.autoBillPay) {
            setFormData(prev => ({ ...prev, autoBillPay: false }));
        }
    }, [formData.servicePlan, formData.linesToPort]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => {
            const newState = { ...prev, [name]: isCheckbox ? checked : value };
            if (name === 'phoneNumber') newState.phoneNumber = formatPhoneNumber(value);
            if (name === 'interestedTablet' && !checked) {
                newState.numberOfTablets = 1;
                newState.tabletPlan = 'None';
            }
            if (name === 'interestedTablet' && checked && newState.tabletPlan === 'None') {
                newState.tabletPlan = 'Base Unlimited';
            }
            return newState;
        });
    };
    
    const handlePhoneLineChange = (index: number, value: string) => {
        const newPhoneLines = [...formData.phoneLines];
        newPhoneLines[index] = formatPhoneNumber(value);
        setFormData(prev => ({ ...prev, phoneLines: newPhoneLines }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            linesToPort: Number(formData.linesToPort),
            numberOfTablets: formData.interestedTablet ? Number(formData.numberOfTablets) : 0,
            tabletPlan: formData.interestedTablet ? formData.tabletPlan : 'None',
            monthlyPrice: monthlyPrice + Number(formData.deviceFinancingMonthly || 0),
        });
        if(!isEditing) {
            setFormData(initialFormState);
        }
    };

    const isEligibleForDiscount = (formData.servicePlan === 'Total 5G' || formData.servicePlan === 'Total 5G+') && Number(formData.linesToPort) === 1;
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 input-field" placeholder="Enter client name" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 input-field" placeholder="(xxx) xxx-xxxx" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 input-field" placeholder="Enter email address"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">New 4-Digit Account PIN</label>
                    <input type="text" name="accountPin" maxLength={4} value={formData.accountPin} onChange={handleChange} className="mt-1 input-field" placeholder="New 4-Digit Account PIN"/>
                </div>
                 <div>
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-300">Service Plan</label>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="byod" name="byod" checked={formData.byod} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-tw-navy/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tw-red"></div>
                            </div>
                            <span>BYOD</span>
                        </label>
                    </div>
                    <select name="servicePlan" value={formData.servicePlan} onChange={handleChange} className="mt-1 input-field">
                        {isNewPlansLive ? (
                            <>
                                <option value="Total STARTER">Total STARTER</option>
                                <option value="Total MAX 5G">Total MAX 5G</option>
                                <option value="Total ALL ACCESS">Total ALL ACCESS</option>
                                <option value="Total MAX 5G BYO">Total MAX 5G BYO</option>
                            </>
                        ) : (
                            <>
                                <option>Base 5G</option>
                                <option>Total 5G</option>
                                <option>Total 5G+</option>
                            </>
                        )}
                    </select>
                    {formData.servicePlan === "Total STARTER" && <p className="text-xs text-gray-400 mt-1">Includes Unlimited 5G Data, 10GB Hotspot.</p>}
                    {formData.servicePlan === "Total MAX 5G" && <p className="text-xs text-gray-400 mt-1">Includes Unl. UWB 5G, Unl. Hotspot, Disney+ 6mo.</p>}
                    {formData.servicePlan === "Total ALL ACCESS" && <p className="text-xs text-gray-400 mt-1">Includes Unl. UWB 5G, Fast Hotspot, Disney+, 1TB Cloud.</p>}
                    {formData.servicePlan === "Total MAX 5G BYO" && <p className="text-xs text-gray-400 mt-1">Includes Unl. UWB 5G, Unl. Hotspot, Disney+ 6mo.</p>}
                     {!isNewPlansLive && isEligibleForDiscount && (
                        <label className="flex items-center gap-2 mt-3 text-sm text-gray-300 cursor-pointer">
                            <input type="checkbox" name="autoBillPay" checked={formData.autoBillPay} onChange={handleChange} className="checkbox-field" /> 
                            Apply $5 Auto Bill Pay Discount
                        </label>
                    )}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Store Location</label>
                    <select name="storeLocationId" value={formData.storeLocationId} onChange={handleChange} className="mt-1 input-field">
                       {storeLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Number of lines to port (1-10)</label>
                    <select name="linesToPort" value={formData.linesToPort} onChange={handleChange} className="mt-1 input-field">
                        {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Device Fin. (Monthly Est.)</label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input type="number" name="deviceFinancingMonthly" value={formData.deviceFinancingMonthly} onChange={handleChange} className="input-field pl-7" placeholder="0.00" min="0" step="0.01" />
                    </div>
                </div>
                 <div className="flex items-end md:col-span-2 xl:col-span-1">
                    <div className="p-3 bg-tw-navy/60 rounded-lg text-center w-full border border-tw-teal/10">
                        <p className="text-gray-400 text-sm">Estimated Monthly Due</p>
                        <p className="text-white font-bold text-2xl">${(monthlyPrice + Number(formData.deviceFinancingMonthly || 0)).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {formData.phoneLines.map((line, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium text-gray-300">Phone Line {index + 1}</label>
                    <input type="tel" value={line} onChange={(e) => handlePhoneLineChange(index, e.target.value)} className="mt-1 input-field" placeholder={`Enter phone number for line ${index+1}`} required/>
                </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Current Provider Account #</label>
                    <input type="text" name="providerAccount" value={formData.providerAccount} onChange={handleChange} className="mt-1 input-field" placeholder="Account number for porting"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Transfer PIN</label>
                    <input type="text" name="transferPin" value={formData.transferPin} onChange={handleChange} className="mt-1 input-field" placeholder="PIN for porting"/>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Interests</label>
                <div className="flex flex-col gap-3">
                     <div>
                       <label className="flex items-center gap-2"><input type="checkbox" name="interestedVHI" checked={formData.interestedVHI} onChange={handleChange} className="checkbox-field" /> VHI Included / Interested</label>
                        {formData.interestedVHI && (
                            <div className="pl-6 mt-2 space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                    <input type="checkbox" name="vhiAutoBillPay" checked={formData.vhiAutoBillPay} onChange={handleChange} className="checkbox-field" /> 
                                    Apply $10 Auto Bill Pay Discount for VHI
                                </label>
                                <p className="text-xs text-tw-teal">
                                    Promo: $50 for first 3 months. Estimated price reflects monthly cost from 4th month onwards.
                                </p>
                            </div>
                        )}
                    </div>
                    <div>
                       <label className="flex items-center gap-2"><input type="checkbox" name="interestedTablet" checked={formData.interestedTablet} onChange={handleChange} className="checkbox-field" /> Tablet Add-on</label>
                       {formData.interestedTablet && (
                            <div className="pl-6 mt-2 space-y-3 p-4 bg-tw-navy/40 rounded-lg border border-tw-teal/10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Number of Tablets</label>
                                    <select name="numberOfTablets" value={formData.numberOfTablets} onChange={handleChange} className="mt-1 input-field">
                                        {[...Array(2).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Tablet Plan</label>
                                    <select name="tabletPlan" value={formData.tabletPlan} onChange={handleChange} className="mt-1 input-field">
                                        <option value="None">Select a plan...</option>
                                        {isNewPlansLive ? (
                                            <>
                                                <option value="Tablet Base">Tablet Base</option>
                                                <option value="Tablet 5G">Tablet 5G</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Base Unlimited">Base Unlimited</option>
                                                <option value="5G Unlimited">5G Unlimited</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300">Appointment Date & Time</label>
                <input type="datetime-local" name="appointmentDateTime" value={formData.appointmentDateTime || ''} onChange={handleChange} className="mt-1 input-field"/>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 input-field" placeholder="Any additional notes..."></textarea>
            </div>
            
            <div className="flex justify-end pt-4 gap-4">
                {isEditing && <button type="button" onClick={onCancel} className="bg-tw-navy/60 text-white font-bold py-2 px-4 rounded-md border border-tw-teal/20">Cancel</button>}
                <button type="submit" className="bg-tw-red hover:bg-tw-red/80 text-white font-bold py-2 px-6 rounded-md shadow-sm flex items-center gap-2 transition-colors">
                    {isEditing ? 'Save Changes' : <><PlusIcon className="w-5 h-5"/> Add Client</>}
                </button>
            </div>
        </form>
    );
});

const AddClientForm: React.FC<{ addClient: ClientManagerProps['data']['addClient'], storeLocations: ClientManagerProps['data']['storeLocations'] }> = React.memo(({ addClient, storeLocations }) => {
    
    const handleSubmit = React.useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'status'>) => {
        addClient({...clientData, status: 'pending'});
        alert('Client added successfully!');
    }, [addClient]);

    return (
        <div className="bg-tw-navy/40 p-6 sm:p-8 rounded-xl shadow-lg border border-tw-teal/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <UserPlusIcon className="w-6 h-6 text-tw-red" />
                Add New Client
            </h2>
            <ClientForm
                initialClient={{}}
                onSubmit={handleSubmit}
                storeLocations={storeLocations}
                isEditing={false}
            />
            <style>{`
                .input-field { display: block; width: 100%; background-color: var(--color-tw-navy); opacity: 0.6; border: 1px solid var(--color-tw-teal); --tw-border-opacity: 0.2; color: white; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; padding: 0.5rem 0.75rem; }
                .input-field:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: var(--color-tw-red); box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: var(--color-tw-red); }
                .checkbox-field { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; border-color: var(--color-tw-teal); --tw-border-opacity: 0.3; background-color: var(--color-tw-navy); color: var(--color-tw-red); }
                .checkbox-field:focus { --tw-ring-color: var(--color-tw-red); }
            `}</style>
        </div>
    )
});

const PlanSummary: React.FC<{clients: Client[]}> = React.memo(({ clients }) => {
    const summary = useMemo(() => {
        return clients.reduce((acc, client) => {
            if (client.status === 'pending') {
                if (client.servicePlan === 'Base 5G') acc.base5G++;
                if (client.servicePlan === 'Total 5G') acc.total5G++;
                if (client.servicePlan === 'Total 5G+') acc.total5GPlus++;
                if (client.interestedVHI) acc.vhiInterested++;
                if (client.interestedTablet) acc.tabletsInterested++;
                if (client.appointmentDateTime && new Date(client.appointmentDateTime) > new Date()) {
                    acc.upcomingAppointments++;
                }
            }
            return acc;
        }, { base5G: 0, total5G: 0, total5GPlus: 0, vhiInterested: 0, tabletsInterested: 0, upcomingAppointments: 0 });
    }, [clients]);

    return (
        <div className="bg-tw-navy/40 p-6 rounded-xl shadow-lg border border-tw-teal/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <ChartPieIcon className="w-6 h-6 text-tw-red" />
                Prospect Summary
            </h2>
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-tw-blue/20 border border-tw-blue/10">
                    <p className="text-sm font-medium text-tw-blue">Base 5G</p>
                    <p className="text-3xl font-bold text-white">{summary.base5G}<span className="text-base font-normal text-gray-400 ml-2">clients</span></p>
                </div>
                 <div className="p-4 rounded-lg bg-tw-blue/30 border border-tw-blue/10">
                    <p className="text-sm font-medium text-tw-blue">Total 5G</p>
                    <p className="text-3xl font-bold text-white">{summary.total5G}<span className="text-base font-normal text-gray-400 ml-2">clients</span></p>
                </div>
                 <div className="p-4 rounded-lg bg-tw-red/10 border border-tw-red/10">
                    <p className="text-sm font-medium text-tw-red">Total 5G+</p>
                    <p className="text-3xl font-bold text-white">{summary.total5GPlus}<span className="text-base font-normal text-gray-400 ml-2">clients</span></p>
                </div>
                <div className="p-4 rounded-lg bg-tw-teal/20 border border-tw-teal/10">
                    <p className="text-sm font-medium text-tw-teal">VHI Interested</p>
                    <p className="text-3xl font-bold text-white">{summary.vhiInterested}<span className="text-base font-normal text-gray-400 ml-2">clients</span></p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-600/10">
                    <p className="text-sm font-medium text-yellow-400">Tablets Interested</p>
                    <p className="text-3xl font-bold text-white">{summary.tabletsInterested}<span className="text-base font-normal text-gray-400 ml-2">clients</span></p>
                </div>
                 <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-600/10">
                    <p className="text-sm font-medium text-cyan-400">Upcoming Appointments</p>
                    <p className="text-3xl font-bold text-white">{summary.upcomingAppointments}<span className="text-base font-normal text-gray-400 ml-2">this month</span></p>
                </div>
            </div>
        </div>
    )
});

const VhiPromoDetails = React.memo(() => (
    <div className="bg-tw-navy/40 p-6 mt-6 rounded-xl shadow-lg border border-tw-teal/20">
        <h3 className="text-lg font-bold text-white mb-4">Verizon Home Internet Offer</h3>
        <div className="space-y-4 text-sm">
            <div className="p-3 bg-tw-navy/60 rounded-lg border border-tw-teal/10">
                <p className="font-semibold text-tw-red">Current Promo (Bundled)</p>
                <p className="text-gray-300">
                    <span className="font-bold text-white">$35/mo guaranteed for 5 years.</span> 
                    (When bundled with an eligible active voice plan).
                </p>
            </div>
            
            <div>
                <p className="font-semibold text-white">Bundled Pricing</p>
                <ul className="list-disc list-inside text-gray-400 pl-2">
                    <li><span className="font-bold text-white">$35/month</span> with active phone plan</li>
                    <li>One-time router cost: <span className="font-bold text-white">$4.99</span></li>
                </ul>
            </div>

            <div>
                <p className="font-semibold text-white">Standalone Pricing</p>
                <ul className="list-disc list-inside text-gray-400 pl-2">
                    <li><span className="font-bold text-white">$60/month</span> standard</li>
                    <li><span className="font-bold text-white">$50/month</span> with Auto Bill Pay</li>
                    <li>One-time router cost: <span className="font-bold text-white">$49.99</span></li>
                </ul>
            </div>
             <p className="text-xs text-center text-gray-500 pt-2 border-t border-tw-teal/10">All monthly prices are guaranteed for 5 years.</p>
        </div>
    </div>
));

const TabletPromoDetails = React.memo(() => (
    <div className="bg-tw-navy/40 p-6 mt-6 rounded-xl shadow-lg border border-tw-teal/20">
        <h3 className="text-lg font-bold text-white mb-4">Tablet Plan Details</h3>
        <div className="space-y-4 text-sm">
            <div className="p-3 bg-tw-navy/60 rounded-lg border border-tw-teal/10">
                <p className="font-semibold text-tw-red">Save up to $40/mo per tablet</p>
                <p className="text-gray-300">
                    Get a massive discount on tablet unlimited plans when you have at least one phone line.
                </p>
            </div>
            
            <div>
                <p className="font-semibold text-white">Base Unlimited Plan</p>
                <ul className="list-disc list-inside text-gray-400 pl-2">
                    <li><span className="font-bold text-white">$10/month</span> bundled with phone plan</li>
                    <li><span className="font-bold text-gray-500">$50/month</span> standalone</li>
                    <li>Unlimited 5G Data, 5GB Hotspot, 720p Streaming</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold text-white">5G Unlimited Plan</p>
                <ul className="list-disc list-inside text-gray-400 pl-2">
                    <li><span className="font-bold text-white">$20/month</span> bundled with phone plan</li>
                     <li><span className="font-bold text-gray-500">$60/month</span> standalone</li>
                    <li>Unlimited 5G & 5G UWB Data, 30GB Hotspot, 1080p Streaming</li>
                </ul>
            </div>
             <p className="text-xs text-center text-gray-500 pt-2 border-t border-tw-teal/10">All monthly prices are guaranteed for 5 years.</p>
        </div>
    </div>
));

const ClientList: React.FC<{clients: Client[], updateClient: ClientManagerProps['data']['updateClient'], storeLocations: StoreLocation[]}> = React.memo(({ clients, updateClient, storeLocations }) => {
    const [view, setView] = useState<'pending' | 'active'>('pending');
    const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
    const [editingClientId, setEditingClientId] = useState<string | null>(null);

    const filteredClients = clients.filter(c => c.status === view).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleUpdate = (clientData: Client) => {
        updateClient(clientData.id!, clientData);
        alert('Client updated successfully!');
        setEditingClientId(null);
    };

    return (
        <div className="bg-tw-navy/40 p-4 sm:p-6 mt-8 rounded-xl shadow-lg border border-tw-teal/20">
             <div className="flex overflow-x-auto items-center border-b border-tw-teal/20 mb-4 scrollbar-hide">
                <button onClick={() => setView('pending')} className={`px-4 py-2 text-sm whitespace-nowrap font-medium -mb-px border-b-2 transition-colors ${view === 'pending' ? 'border-tw-red text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                    Pending Prospects ({clients.filter(c => c.status === 'pending').length})
                </button>
                <button onClick={() => setView('active')} className={`px-4 py-2 text-sm whitespace-nowrap font-medium -mb-px border-b-2 transition-colors ${view === 'active' ? 'border-tw-red text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                    Active Clients ({clients.filter(c => c.status === 'active').length})
                </button>
            </div>
            <div className="space-y-3 max-h-[40rem] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {filteredClients.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No clients in this list.</p>}
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-tw-navy/60 rounded-lg overflow-hidden border border-tw-teal/5">
                        {editingClientId === client.id ? (
                            <div className="p-4">
                               <ClientForm
                                    initialClient={client}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setEditingClientId(null)}
                                    storeLocations={storeLocations}
                                    isEditing={true}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="p-3 cursor-pointer hover:bg-tw-navy transition-colors" onClick={() => setExpandedClientId(prev => prev === client.id ? null : client.id)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-white">{client.fullName}</p>
                                            <p className="text-sm text-gray-400">{client.phoneNumber}</p>
                                            <p className="text-xs text-tw-teal/80">{client.linesToPort} line(s) on {client.servicePlan} {client.byod && <span className="text-yellow-400">(BYOD)</span>}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-lg text-white">${client.monthlyPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                {expandedClientId === client.id && (
                                    <div className="p-4 bg-tw-navy/80 border-t border-tw-teal/10 space-y-3">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="font-semibold text-gray-400">VHI:</span> <span className={client.interestedVHI ? 'text-tw-teal font-bold' : 'text-gray-500'}>{client.interestedVHI ? 'Yes' : 'No'}</span></div>
                                            <div><span className="font-semibold text-gray-400">Tablet:</span> <span className={client.interestedTablet ? 'text-tw-teal font-bold' : 'text-gray-500'}>{client.interestedTablet ? `${client.numberOfTablets} on ${client.tabletPlan}` : 'No'}</span></div>
                                            <div><span className="font-semibold text-gray-400">Email:</span> <span className="text-gray-300">{client.email || 'N/A'}</span></div>
                                            <div><span className="font-semibold text-gray-400">Provider Acct:</span> <span className="text-gray-300">{client.providerAccount || 'N/A'}</span></div>
                                        </div>
                                        {client.notes && <div><p className="font-semibold text-gray-400 text-sm">Notes:</p><p className="text-sm text-gray-300 bg-tw-navy/50 p-2 rounded-md whitespace-pre-wrap">{client.notes}</p></div>}
                                        <div className="flex justify-between items-center pt-2 border-t border-tw-teal/10">
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingClientId(client.id)} className="text-xs bg-tw-blue hover:bg-tw-blue/80 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5"><PencilIcon className="w-3 h-3"/> Edit</button>
                                                {view === 'pending' && <button onClick={() => updateClient(client.id, { status: 'active' })} className="text-xs bg-tw-teal hover:bg-tw-teal/80 text-white px-3 py-1.5 rounded-md">Mark as Ported</button>}
                                            </div>
                                            <p className="text-xs text-gray-500">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
});

const ClientManager: React.FC<ClientManagerProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2">
                <AddClientForm addClient={data.addClient} storeLocations={data.storeLocations} />
            </div>
            <div>
                <PlanSummary clients={data.clients}/>
                <VhiPromoDetails />
                <TabletPromoDetails />
                <ClientList clients={data.clients} updateClient={data.updateClient} storeLocations={data.storeLocations} />
            </div>
        </div>
    );
};

export default ClientManager;
