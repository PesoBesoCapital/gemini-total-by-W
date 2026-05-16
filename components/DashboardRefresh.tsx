import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  FilePlus2,
  HeartHandshake,
  Home,
  Minus,
  Phone,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tablet,
  UserPlus,
  Wifi,
  X,
} from "lucide-react";

/* =========================================
   TOTAL WIRELESS HUB - PROMO ENGINE
   UPDATED 4.23 - 5.12
========================================= */

/* ---------- ACTIVE PROMOS ---------- */
const PROMOS = {
  accessCharge: {
    oneLine: 25,
    multiLine: 50
  },
  plans: [
    { id: "base", name: "Base Unlimited", monthly: 40 },
    { id: "5g", name: "Total 5G", monthly: 50 },
    { id: "5gplus", name: "Total 5G+", monthly: 60 }
  ],
  vhi: {
    enabled: true,
    monthly: 45,
    router: 4.99,
    bundlePrice: 35,
    promo: "1 month free"
  },
  tablets: [
    { id: "tab8plus", name: "TCL Tab 8 Plus 4G", upfront: 0, requiredPlan: "1 month Base Unlimited" },
    { id: "tab8nxt", name: "TCL Tab 8 NXT", upfront: 0, requiredPlan: "1 month Base Unlimited" },
    { id: "a11", name: "Samsung Tab A11+", upfront: 49.99, requiredPlan: "3 month Base $49.99" },
    { id: "tab10", name: "TCL Tab 10 NXTPaper 5G", upfront: 34.99, requiredPlan: "1 month Base $34.99" },
    { id: "a9plus", name: "Samsung Tab A9+ 5G", upfront: 0, requiredPlan: "6 month 5G Unlimited" }
  ],
  phones: [
    { name: "iPhone 16e", promoPrice: 79.99 },
    { name: "Samsung S25 FE", promoPrice: 99.99 },
    { name: "Pixel 10a", promoPrice: 49.99 },
    { name: "iPhone 14", promoPrice: 49.99 },
    { name: "iPhone 13", promoPrice: 0 },
    { name: "Galaxy A16 5G", promoPrice: 0 },
    { name: "Galaxy A26", promoPrice: 0 },
    { name: "Moto G Power 2026", promoPrice: 0 },
    { name: "Moto G Play 2026", promoPrice: 0 },
    { name: "Moto Razr 2025 FIFA", promoPrice: 99.99 }
  ]
};

/* =========================================
   TODAY ESTIMATE CALCULATOR
========================================= */
function calculateTodayEstimate({
  lines = 1,
  selectedPlan = 60,
  phones = [],
  tablet = null,
  addVHI = false,
  taxes = 0.08
}: any) {
  let accessCharge = lines === 1 ? PROMOS.accessCharge.oneLine : PROMOS.accessCharge.multiLine;
  let monthlyPlanTotal = selectedPlan * lines;
  
  let phoneTotal = 0;
  phones.forEach((phone: any) => { phoneTotal += phone.promoPrice; });
  
  let tabletTotal = tablet ? tablet.upfront : 0;
  
  let vhiTotal = 0;
  if (addVHI) {
    vhiTotal = PROMOS.vhi.monthly + PROMOS.vhi.router;
  }
  
  let subtotal = monthlyPlanTotal + accessCharge + phoneTotal + tabletTotal + vhiTotal;
  let estimatedTaxes = subtotal * taxes;
  let todayTotal = subtotal + estimatedTaxes;
  
  return {
    lines,
    accessCharge,
    monthlyPlanTotal,
    phoneTotal,
    tabletTotal,
    vhiTotal,
    estimatedTaxes: estimatedTaxes.toFixed(2),
    todayTotal: todayTotal.toFixed(2)
  };
}

const PLAN_CATALOG = [
  {
    id: "max-byo",
    name: "Total MAX 5G BYO",
    price: 30,
    badge: "Bring Your Own Phone",
    color: "from-cyan-400 to-teal-300",
    data: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot at 5Mbps",
    perks: ["Spam Protection", "Disney+ 6 months", "100GB Cloud"],
    bestFor: "Customers with compatible phones who want the lowest premium entry point.",
    requirement: "Bring your own compatible device required",
  },
  {
    id: "starter",
    name: "Total STARTER",
    price: 40,
    badge: "Simple Unlimited",
    color: "from-emerald-400 to-cyan-300",
    data: "Unlimited 5G",
    hotspot: "10GB hotspot",
    perks: ["Spam Protection", "Canada & Mexico roaming", "International texting"],
    bestFor: "Everyday customers who want a clean bill and reliable unlimited service.",
    requirement: "Great starter plan",
  },
  {
    id: "max-5g",
    name: "Total MAX 5G",
    price: 55,
    badge: "Best Value",
    color: "from-blue-400 to-cyan-300",
    data: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot at 5Mbps",
    perks: ["Spam Protection", "Disney+ 6 months", "100GB Cloud"],
    bestFor: "Families, students, streamers, and customers who want stronger value.",
    requirement: "Premium value plan",
  },
  {
    id: "all-access",
    name: "Total ALL ACCESS",
    price: 65,
    badge: "Elite Plan",
    color: "from-fuchsia-400 to-cyan-300",
    data: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot at 10Mbps",
    perks: ["Spam Protection", "Disney+ on us", "1TB Cloud", "$10 international credit"],
    bestFor: "Power users, business users, and customers who want the strongest benefits.",
    requirement: "Top-tier plan",
  },
];

const ADD_ONS = [
  {
    id: "protect",
    name: "TotalWireless+ Protection",
    price: 0,
    icon: ShieldCheck,
    short: "Lost/stolen, damage support, and online security value.",
    details: "Adds peace of mind for the phone customers depend on every day.",
  },
  {
    id: "vhi",
    name: "Home Internet 5G",
    price: 35,
    icon: Wifi,
    short: "$35/mo bundled pricing after eligible discount.",
    details: "Good for customers paying too much for cable internet or needing simple plug-and-play Wi-Fi.",
  },
  {
    id: "tablet-base",
    name: "Tablet Base",
    price: 10,
    icon: Tablet,
    short: "$10/mo bundled tablet plan.",
    details: "Great for kids, school, work, streaming, appointments, and family accounts.",
  },
  {
    id: "tablet-5g",
    name: "Tablet 5G",
    price: 20,
    icon: Tablet,
    short: "$20/mo bundled 5G tablet plan.",
    details: "Better for mobility, stronger connectivity, and tablet use away from home.",
  },
];

const FINANCING_DEVICES = [
  {
    id: "iphone-16e-128",
    brand: "Apple",
    name: "iPhone 16e",
    storage: "128GB",
    promoPrice: 79.99,
    estimatedRetail: 600,
    termMonths: 24,
    estimatedMonthly: 25,
    promo: "with Switch",
    requirements: "Port, Veriff, and 2 months Multi-Month on a 5G+ plan",
    edgeEligible: true,
  },
  {
    id: "samsung-s25-fe",
    brand: "Samsung",
    name: "Galaxy S25 FE",
    storage: "",
    promoPrice: 99.99,
    estimatedRetail: 650,
    termMonths: 24,
    estimatedMonthly: 27.09,
    promo: "with Switch",
    requirements: "Port, Veriff, and 3 months Multi-Month on a 5G/5G+ plan",
    edgeEligible: true,
  },
  {
    id: "pixel-10a",
    brand: "Google",
    name: "Pixel 10a",
    storage: "",
    promoPrice: 49.99,
    estimatedRetail: 500,
    termMonths: 24,
    estimatedMonthly: 20.84,
    promo: "with Switch",
    requirements: "Port, Veriff, and 3 months Multi-Month on a 5G/5G+ plan",
    edgeEligible: true,
  },
  {
    id: "iphone-14-128",
    brand: "Apple",
    name: "iPhone 14",
    storage: "128GB",
    promoPrice: 49.99,
    estimatedRetail: 600,
    termMonths: 24,
    estimatedMonthly: 25,
    promo: "with Switch",
    requirements: "Port, Veriff, and 1 month on a 5G/5G+ plan",
    edgeEligible: true,
  },
  {
    id: "iphone-13-128",
    brand: "Apple",
    name: "iPhone 13",
    storage: "128GB",
    promoPrice: 0,
    estimatedRetail: 500,
    termMonths: 24,
    estimatedMonthly: 20.84,
    promo: "Free with Switch",
    requirements: "Port, Veriff, and 2 months Multi-Month on a 5G+ plan",
    edgeEligible: true,
  },
  {
    id: "moto-razr-2025-fifa",
    brand: "motorola",
    name: "razr 2025 FIFA World Cup 26 Edition",
    storage: "",
    promoPrice: 99.99,
    estimatedRetail: 700,
    termMonths: 24,
    estimatedMonthly: 29.17,
    promo: "with Switch",
    requirements: "Port, Veriff, and 2 months Multi-Month on a 5G/5G+ plan",
    edgeEligible: true,
  },
  {
    id: "galaxy-a16-5g",
    brand: "Samsung",
    name: "Galaxy A16 5G",
    storage: "",
    promoPrice: 0,
    estimatedRetail: 200,
    termMonths: 24,
    estimatedMonthly: 8.34,
    promo: "Free with Switch",
    requirements: "Port, Veriff, and 1 month on a Base/5G/5G+ plan",
    edgeEligible: false,
  },
  {
    id: "tcl-k33-5g",
    brand: "TCL",
    name: "K33 5G",
    storage: "",
    promoPrice: 0,
    estimatedRetail: 160,
    termMonths: 24,
    estimatedMonthly: 6.67,
    promo: "Free with No Hassle",
    requirements: "Port, Veriff, and 1 month on a 5G/5G+ plan",
    edgeEligible: false,
  },
];

function addFinancingDevice(currentDevices: any[], newDevice: any) {
  const normalizedDevice = {
    id: newDevice.id || `device-${Date.now()}`,
    brand: newDevice.brand || "New Brand",
    name: newDevice.name || "New Device",
    storage: newDevice.storage || "",
    promoPrice: Number(newDevice.promoPrice || 0),
    estimatedRetail: Number(newDevice.estimatedRetail || 0),
    termMonths: Number(newDevice.termMonths || 24),
    estimatedMonthly: Number(newDevice.estimatedMonthly || 0),
    promo: newDevice.promo || "Promo details pending",
    requirements: newDevice.requirements || "Requirements pending",
    edgeEligible: Boolean(newDevice.edgeEligible),
  };

  return [...currentDevices, normalizedDevice];
}

const FINANCING_FLOW = [
  {
    step: "Step 1",
    title: "Identify customer",
    detail: "Wants a new phone today, open to monthly payments, activating eligible service, financing one device.",
  },
  {
    step: "Step 2",
    title: "Position offer",
    detail: "Check if they qualify. Phone today with payments over 24 months. Auto Pay may combine bill and device payment.",
  },
  {
    step: "Step 3",
    title: "Qualify customer",
    detail: "18+, valid photo ID, valid SSN, eligible plan, approved application, and no active financing conflicts.",
  },
  {
    step: "Step 4",
    title: "Submit application",
    detail: "Run the Glow financing application, review result, and keep wording positive and simple.",
  },
  {
    step: "Step 5A",
    title: "If approved",
    detail: "Complete device purchase, set up Auto Pay, and reinforce one simple monthly payment.",
  },
  {
    step: "Step 5B",
    title: "If not approved",
    detail: "Do not say denied. Say financing is not available today, but they may still qualify for other promos.",
  },
];

const DEFAULT_DASHBOARD_STATS = [
  { id: "activations", label: "Activations", value: 0, goal: 40, icon: Phone, accent: "text-cyan-300" },
  { id: "accessories", label: "Accessories", value: 0, goal: 850, icon: ShoppingCart, accent: "text-emerald-300", currency: true },
  { id: "vhi", label: "Home Internet", value: 0, goal: 4, icon: Wifi, accent: "text-blue-300" },
  { id: "tablets", label: "Tablets", value: 0, goal: 4, icon: Tablet, accent: "text-violet-300" },
];

const CUSTOMER_STEPS = [
  {
    title: "We review your needs",
    text: "We look at lines, phone usage, hotspot, home internet, tablets, and protection before recommending anything.",
  },
  {
    title: "You see the price clearly",
    text: "Taxes and fees are included on the plan pricing, so the quote is easier to understand.",
  },
  {
    title: "You choose what fits",
    text: "No pressure. We compare options and help you pick what actually makes sense.",
  },
  {
    title: "We save it for follow-up",
    text: "If you need time, we can save the quote and appointment details so you do not have to start over.",
  },
];

function money(value: number) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function percent(value: number, goal: number) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

function classNames(...items: (string | undefined | null | false)[]) {
  return items.filter(Boolean).join(" ");
}

interface DashboardRefreshProps {
  onNavigateToClientManager: (payload?: any) => void;
}

const DashboardRefresh = React.memo(({ onNavigateToClientManager }: DashboardRefreshProps) => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("tw_dashboard_stats");
    return saved ? JSON.parse(saved) : DEFAULT_DASHBOARD_STATS;
  });

  const [lines, setLines] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedFinanceDeviceId, setSelectedFinanceDeviceId] = useState<string | null>(null);
  const [financingDevices, setFinancingDevices] = useState(() => {
    const saved = localStorage.getItem("tw_financing_devices");
    return saved ? JSON.parse(saved) : FINANCING_DEVICES;
  });
  const [financingStatus, setFinancingStatus] = useState("not-started");
  const [customerDraft, setCustomerDraft] = useState({
    fullName: "",
    phoneNumber: "",
    notes: "",
    appointmentDate: "",
  });
  const [toast, setToast] = useState("");

  const selectedPlan = PLAN_CATALOG.find((plan) => plan.id === selectedPlanId);
  const selectedFinanceDevice = financingDevices.find((device: any) => device.id === selectedFinanceDeviceId);

  const selectedAddOnObjects = useMemo(
    () => ADD_ONS.filter((addon) => selectedAddOns.includes(addon.id)),
    [selectedAddOns]
  );

  const estimatedMonthly = useMemo(() => {
    const planPrice = selectedPlan?.price || 0;
    const addOnTotal = selectedAddOnObjects.reduce((sum, item) => sum + (item.price || 0), 0);
    const financeMonthly = financingStatus === "approved" ? Number(selectedFinanceDevice?.estimatedMonthly || 0) : 0;
    return Number(((planPrice * lines) + addOnTotal + financeMonthly).toFixed(2));
  }, [selectedPlan, selectedAddOnObjects, selectedFinanceDevice, financingStatus, lines]);

  const todayEstimateDetails = useMemo(() => {
    return calculateTodayEstimate({
      lines,
      selectedPlan: selectedPlan?.price || 0,
      phones: selectedFinanceDevice && financingStatus === "approved" ? [selectedFinanceDevice] : [],
      tablet: selectedAddOnObjects.find(a => a.id.includes("tablet")) ? { upfront: 0 } : null,
      addVHI: selectedAddOnObjects.some(a => a.id === "vhi"),
      taxes: 0.08
    });
  }, [lines, selectedPlan, selectedFinanceDevice, financingStatus, selectedAddOnObjects]);

  const toggleAddOn = React.useCallback((id: string) => {
    setSelectedAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const selectPlan = React.useCallback((planId: string) => {
    setSelectedPlanId((current) => (current === planId ? null : planId));
    setActiveTab("builder");
  }, []);

  const discardQuote = React.useCallback(() => {
    setSelectedPlanId(null);
    setSelectedAddOns([]);
    setSelectedFinanceDeviceId(null);
    setFinancingStatus("not-started");
    setCustomerDraft({ fullName: "", phoneNumber: "", notes: "", appointmentDate: "" });
    localStorage.removeItem("tw_pending_client_quote");
    showToast("Quote discarded. Clean slate ready.");
  }, []);

  const saveToClientManager = () => {
    if (!selectedPlan) {
      showToast("Select a plan first before saving to Client Manager.");
      setActiveTab("plans");
      return;
    }

    const payload = {
      id: `pending-${Date.now()}`,
      status: "pending_appointment",
      createdAt: new Date().toISOString(),
      source: "Dashboard Plan Builder",
      customer: customerDraft,
      selectedPlan,
      selectedAddOns: selectedAddOnObjects,
      financing: selectedFinanceDevice
        ? {
            status: financingStatus,
            device: selectedFinanceDevice,
            estimatedMonthly: financingStatus === "approved" ? selectedFinanceDevice.estimatedMonthly : 0,
          }
        : null,
      estimatedMonthly,
      todayTotal: todayEstimateDetails.todayTotal,
      nextAction: customerDraft.appointmentDate ? "Appointment scheduled" : "Follow up and schedule appointment",
    };

    localStorage.setItem("tw_pending_client_quote", JSON.stringify(payload));

    const savedProfiles = JSON.parse(localStorage.getItem("tw_client_profiles") || "[]");
    localStorage.setItem("tw_client_profiles", JSON.stringify([payload, ...savedProfiles]));

    window.dispatchEvent(new CustomEvent("tw:client-profile-created", { detail: payload }));
    showToast("Saved to Client Manager as a pending customer profile.");

    if (typeof onNavigateToClientManager === "function") {
      setTimeout(() => onNavigateToClientManager(payload), 400);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  };

  const quickAdjustStat = React.useCallback((statId: string, amount: number) => {
    setStats((prevStats: any) => {
      const next = prevStats.map((stat: any) =>
        stat.id === statId ? { ...stat, value: Math.max(0, Number(stat.value || 0) + amount) } : stat
      );
      localStorage.setItem("tw_dashboard_stats", JSON.stringify(next));
      return next;
    });
  }, []);

  const resetStats = () => {
    setStats(DEFAULT_DASHBOARD_STATS);
    localStorage.setItem("tw_dashboard_stats", JSON.stringify(DEFAULT_DASHBOARD_STATS));
    showToast("Dashboard stats reset.");
  };

  return (
    <div className="bg-[#062f66] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-tw-navy" />
        <div className="relative mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {toast && (
            <div className="fixed right-6 top-6 z-50 rounded-2xl border border-cyan-300/30 bg-[#082b5c]/95 px-5 py-3 text-sm font-semibold text-cyan-100 shadow-2xl backdrop-blur-xl">
              {toast}
            </div>
          )}

          <header className="mb-4 sm:mb-8 grid gap-4 sm:gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-2xl sm:rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-4 sm:p-7 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="rounded-2xl bg-[#ec1745] p-4 shadow-lg shadow-red-950/30">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Welcome to Total Wireless</p>
                  <h1 className="text-4xl font-black leading-tight md:text-5xl">Let’s make this simple and safe.</h1>
                </div>
              </div>
              <p className="max-w-4xl text-lg leading-8 text-blue-100/85">
                We’ll help you compare plans, understand your monthly price, protect your device, and save your quote for an appointment if you need time. No confusion, no rushed decisions, no tiny-print scavenger hunt cooked up by corporate goblins.
              </p>

              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                <SoftBadge icon={ShieldCheck} title="Peace of mind" text="Protection and security options explained clearly." />
                <SoftBadge icon={FilePlus2} title="Saved quote" text="Keep your plan details ready for follow-up." />
                <SoftBadge icon={CalendarDays} title="Appointment" text="Move from quote to Client Manager smoothly." />
              </div>
            </section>

            <section className="hidden xl:block rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Today’s guide</p>
                  <h2 className="mt-1 text-2xl font-black">Start here</h2>
                </div>
                <Home className="h-10 w-10 text-cyan-300" />
              </div>
              <p className="mt-4 leading-7 text-blue-100/80">
                Choose a tab below. Start with the welcome page, compare plans, build a quote, then save it when ready.
              </p>
              <button
                onClick={resetStats}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
              >
                <RefreshCcw className="h-4 w-4" /> Reset dashboard stats
              </button>
            </section>
          </header>

          <nav className="mb-4 sm:mb-8 rounded-2xl sm:rounded-[1.5rem] border border-cyan-300/15 bg-white/[0.06] p-1.5 sm:p-2 shadow-xl backdrop-blur-xl">
            <div className="grid grid-cols-5 gap-1">
              <TabButton active={activeTab === "welcome"} onClick={() => setActiveTab("welcome")} icon={Sparkles} label="Welcome" shortLabel="Home" />
              <TabButton active={activeTab === "plans"} onClick={() => setActiveTab("plans")} icon={Phone} label="Plans" shortLabel="Plans" />
              <TabButton active={activeTab === "financing"} onClick={() => setActiveTab("financing")} icon={DollarSign} label="Financing" shortLabel="Finance" />
              <TabButton active={activeTab === "builder"} onClick={() => setActiveTab("builder")} icon={FilePlus2} label="Build Quote" shortLabel="Quote" />
              <TabButton active={activeTab === "progress"} onClick={() => setActiveTab("progress")} icon={Clock} label="Progress" shortLabel="Goals" />
            </div>
          </nav>

          {activeTab === "welcome" && (
            <section className="space-y-4 sm:space-y-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {CUSTOMER_STEPS.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-cyan-300/15 bg-white/[0.06] p-4 sm:p-6 shadow-xl backdrop-blur-xl">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-lg font-black text-cyan-200">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="mt-3 leading-7 text-blue-100/70">{step.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Ice breaker</p>
                    <h2 className="mt-2 text-3xl font-black">Not sure what plan you need?</h2>
                    <p className="mt-4 leading-8 text-blue-100/75">
                      That’s normal. Most people only know their bill is too high, their internet is annoying, or their phone is one bad drop away from financial comedy. We’ll compare your options and keep the process simple.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TrustCard title="Clear monthly price" text="Plans show taxes and fees included." />
                    <TrustCard title="No pressure quote" text="Build the option first, decide after." />
                    <TrustCard title="Protection explained" text="Lost, stolen, damage, and online security value." />
                    <TrustCard title="Appointment ready" text="Save the profile so the customer does not restart." />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "plans" && (
            <section className="space-y-8">
              <SectionIntro
                eyebrow="Plan options"
                title="Choose the plan that fits the customer"
                text="Give each plan room to breathe. Cleaner cards, simpler language, and no cluttered wall of numbers trying to win a staring contest."
              />
              <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
                {PLAN_CATALOG.map((plan) => <PlanCard key={plan.id} plan={plan} selected={selectedPlanId === plan.id} onSelect={() => selectPlan(plan.id)} />)}
              </div>
            </section>
          )}

          {activeTab === "financing" && (
            <section className="space-y-8">
              <SectionIntro
                eyebrow="Device financing"
                title="Total Wireless Edge financing flow"
                text="Use this section to explain the financing path clearly, keep the customer calm, and avoid harsh wording if financing is not available today. Because saying things like a brick through a window is bad salesmanship, apparently."
              />

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-[#ec1745] p-3">
                      <FilePlus2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Step-by-step</p>
                      <h2 className="text-2xl font-black">Financing guide</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {FINANCING_FLOW.map((item) => (
                      <div key={item.step} className="rounded-2xl border border-cyan-300/10 bg-[#06356f] p-5">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-[#062f66]">{item.step}</span>
                          <p className="font-black">{item.title}</p>
                        </div>
                        <p className="text-sm leading-6 text-blue-100/70">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/15 p-5">
                    <p className="font-black text-red-100">Golden rule</p>
                    <p className="mt-2 text-sm leading-6 text-red-50/85">
                      Do not say: “You were denied.” Say: “This financing option is not available today, but you may still qualify for other promotions.”
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Device selector</p>
                      <h2 className="text-2xl font-black">Add financing to estimate</h2>
                      <p className="mt-2 text-sm leading-6 text-blue-100/65">Select a device and approval status. Approved financing adds the estimated monthly loan payment into the quote calculator.</p>
                    </div>
                    <select
                      value={financingStatus}
                      onChange={(event) => setFinancingStatus(event.target.value)}
                      className="rounded-2xl border border-cyan-300/15 bg-[#06356f] px-4 py-3 font-bold text-white outline-none"
                    >
                      <option value="not-started">Not started</option>
                      <option value="approved">Approved</option>
                      <option value="not-approved">Not available today</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {financingDevices.map((device: any) => (
                      <button
                        key={device.id}
                        onClick={() => setSelectedFinanceDeviceId((current) => current === device.id ? null : device.id)}
                        className={classNames(
                          "rounded-2xl border p-5 text-left transition hover:-translate-y-1 block w-full",
                          selectedFinanceDeviceId === device.id ? "border-cyan-300 bg-cyan-300/15" : "border-cyan-300/10 bg-[#06356f] hover:bg-[#094486]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{device.brand}</p>
                            <h3 className="mt-1 text-lg font-black leading-tight">{device.name} {device.storage}</h3>
                          </div>
                          <div className="rounded-2xl bg-[#ec1745] px-3 py-2 text-right shadow-lg shadow-red-950/30">
                            <p className="text-[10px] font-black uppercase">promo</p>
                            <p className="text-xl font-black">{device.promoPrice === 0 ? "Free" : `$${device.promoPrice}`}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-blue-100/70">
                          <p><strong className="text-white">Monthly est:</strong> ${device.estimatedMonthly}/mo for {device.termMonths} months</p>
                          <p><strong className="text-white">Promo:</strong> {device.promo}</p>
                          <p><strong className="text-cyan-300">Requires:</strong> {device.requirements}</p>
                        </div>
                        <div className="mt-4 inline-flex rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
                          {device.edgeEligible ? "Edge eligible" : "Promo device"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-black/15 p-5">
                    <p className="font-black text-cyan-200">Future device updates</p>
                    <p className="mt-2 text-sm leading-6 text-blue-100/65">
                      The code includes an addFinancingDevice(currentDevices, newDevice) helper so AI Studio can add future devices without rebuilding the calculator. The estimated monthly field feeds directly into the customer quote when financing is approved.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "builder" && (
            <section className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
              <div className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Plan builder</p>
                    <h2 className="text-3xl font-black">Build a clean quote</h2>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100/70">
                      Select one plan, then add protection or connected devices. The quote stays clean so the customer feels guided, not trapped in a math dungeon.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/20 bg-black/15 px-5 py-4 text-right">
                    <p className="text-xs font-black uppercase text-blue-100/50">Estimated monthly</p>
                    <p className="text-4xl font-black text-cyan-200">${estimatedMonthly}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-cyan-300/10 bg-black/15 p-4">
                  <div>
                    <h3 className="font-bold text-white">Number of Lines</h3>
                    <p className="text-sm text-blue-100/60">Select lines to port or activate</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setLines(l => Math.max(1, l - 1))} className="rounded-full bg-[#06356f] p-2 text-cyan-300 hover:bg-[#094486]"><Minus className="h-5 w-5" /></button>
                    <span className="w-8 text-center text-xl font-black text-white">{lines}</span>
                    <button onClick={() => setLines(l => Math.min(10, l + 1))} className="rounded-full bg-[#06356f] p-2 text-cyan-300 hover:bg-[#094486]"><Plus className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {PLAN_CATALOG.map((plan) => <CompactPlanButton key={plan.id} plan={plan} selected={selectedPlanId === plan.id} onClick={() => selectPlan(plan.id)} />)}
                </div>

                <div className="rounded-[1.5rem] border border-cyan-300/10 bg-black/10 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-300" />
                    <h3 className="text-2xl font-black">Add-ons and protection</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {ADD_ONS.map((addon) => <AddOnCard key={addon.id} addon={addon} selected={selectedAddOns.includes(addon.id)} onClick={() => toggleAddOn(addon.id)} />)}
                  </div>
                </div>
              </div>

              <aside className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#ec1745] p-3">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Client Manager</p>
                    <h2 className="text-2xl font-black">Save for appointment</h2>
                  </div>
                </div>

                <div className="space-y-5">
                  <Field label="Customer name" value={customerDraft.fullName} onChange={(value: string) => setCustomerDraft({ ...customerDraft, fullName: value })} placeholder="Enter customer name" />
                  <Field label="Phone number" value={customerDraft.phoneNumber} onChange={(value: string) => setCustomerDraft({ ...customerDraft, phoneNumber: value })} placeholder="(xxx) xxx-xxxx" />
                  <Field label="Appointment date/time" type="datetime-local" value={customerDraft.appointmentDate} onChange={(value: string) => setCustomerDraft({ ...customerDraft, appointmentDate: value })} />
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-blue-100/80">Notes</span>
                    <textarea
                      value={customerDraft.notes}
                      onChange={(event) => setCustomerDraft({ ...customerDraft, notes: event.target.value })}
                      placeholder="Current carrier, lines, objections, quote details..."
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-cyan-300/15 bg-[#06356f] px-4 py-3 text-white outline-none transition placeholder:text-blue-100/35 focus:border-cyan-300/60"
                    />
                  </label>
                </div>

                <QuoteSummary 
                  selectedPlan={selectedPlan} 
                  selectedAddOnObjects={selectedAddOnObjects} 
                  selectedFinanceDevice={selectedFinanceDevice} 
                  financingStatus={financingStatus} 
                  estimatedMonthly={estimatedMonthly} 
                  todayEstimateDetails={todayEstimateDetails}
                  lines={lines}
                />

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={discardQuote} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-blue-100 transition hover:bg-white/10">
                    <X className="h-4 w-4" /> Discard
                  </button>
                  <button onClick={saveToClientManager} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ec1745] px-4 py-3 font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-[#ff2a57]">
                    Save <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={saveToClientManager}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 font-black text-[#062f66] transition hover:bg-cyan-200"
                >
                  <FilePlus2 className="h-4 w-4" /> Save to Client Manager
                </button>
              </aside>
            </section>
          )}

          {activeTab === "progress" && (
            <section className="space-y-8">
              <SectionIntro
                eyebrow="Team progress"
                title="Clean progress view"
                text="This keeps the dashboard useful for reps and admins without crowding the customer-facing experience. Numbers live here, not shoved into every corner like a panic room."
              />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat: any) => <ProgressCard key={stat.id} stat={stat} onAdjust={quickAdjustStat} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

function TabButton({ active, onClick, icon: Icon, label, shortLabel }: any) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl px-1 sm:px-4 py-2.5 sm:py-3 font-black transition w-full",
        active ? "bg-[#ec1745] text-white shadow-lg shadow-red-950/30" : "text-blue-100/75 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
      <span className="text-[10px] sm:hidden leading-none">{shortLabel ?? label}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SoftBadge({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-cyan-300" />
        <p className="font-black text-cyan-100">{title}</p>
      </div>
      <p className="text-sm leading-6 text-blue-100/65">{text}</p>
    </div>
  );
}

function TrustCard({ title, text }: any) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-[#06356f] p-5">
      <Check className="mb-3 h-5 w-5 text-cyan-300" />
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm leading-6 text-blue-100/65">{text}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: any) {
  return (
    <div className="rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-7 shadow-xl backdrop-blur-xl md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-4xl leading-8 text-blue-100/75">{text}</p>
    </div>
  );
}

const PlanCard = React.memo(function PlanCard({ plan, selected, onSelect }: any) {
  return (
    <button
      onClick={onSelect}
      className={classNames(
        "group rounded-[2rem] border p-6 text-left shadow-xl transition hover:-translate-y-1 block w-full",
        selected ? "border-cyan-300 bg-cyan-300/15 ring-2 ring-cyan-300/50" : "border-cyan-300/10 bg-white/[0.06] hover:border-cyan-300/35 hover:bg-white/[0.08]"
      )}
    >
      <div className={classNames("mb-5 inline-flex rounded-2xl px-3 py-1 text-xs font-black text-[#042b5c]", plan.color)}>
        {plan.badge}
      </div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-black leading-tight">{plan.name}</h3>
        <div className="rounded-2xl bg-[#ec1745] px-4 py-3 text-center shadow-lg shadow-red-950/30">
          <p className="text-[10px] font-black uppercase">per mo</p>
          <p className="text-3xl font-black">${plan.price}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-sm leading-6 text-blue-100/75">
        <p><strong className="text-white">Data:</strong> {plan.data}</p>
        <p><strong className="text-white">Hotspot:</strong> {plan.hotspot}</p>
        <p><strong className="text-white">Best for:</strong> {plan.bestFor}</p>
        <p><strong className="text-cyan-300">Requires:</strong> {plan.requirement}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {plan.perks.map((perk: string) => (
          <span key={perk} className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
            {perk}
          </span>
        ))}
      </div>
    </button>
  );
});

const CompactPlanButton = React.memo(function CompactPlanButton({ plan, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-2xl border p-4 text-left transition hover:-translate-y-1 block w-full",
        selected ? "border-cyan-300 bg-cyan-300/15" : "border-cyan-300/10 bg-[#06356f] hover:bg-[#094486]"
      )}
    >
      <p className="text-sm font-black text-cyan-300">${plan.price}/mo</p>
      <p className="mt-1 text-lg font-black leading-tight">{plan.name}</p>
      <p className="mt-2 text-xs leading-5 text-blue-100/55">{plan.badge}</p>
    </button>
  );
});

const AddOnCard = React.memo(function AddOnCard({ addon, selected, onClick }: any) {
  const Icon = addon.icon;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-2xl border p-5 text-left transition hover:bg-cyan-300/10 block w-full",
        selected ? "border-cyan-300 bg-cyan-300/15" : "border-cyan-300/10 bg-[#06356f]"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-cyan-300/10 p-3 shrink-0">
          <Icon className="h-6 w-6 text-cyan-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black">{addon.name}</p>
            <p className="font-black text-cyan-200">{addon.price ? `$${addon.price}` : "Add"}</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-blue-100/70">{addon.short}</p>
          <p className="mt-2 text-xs leading-5 text-blue-100/45">{addon.details}</p>
        </div>
      </div>
    </button>
  );
});

const QuoteSummary = React.memo(function QuoteSummary({ selectedPlan, selectedAddOnObjects, selectedFinanceDevice, financingStatus, estimatedMonthly, todayEstimateDetails, lines }: any) {
  const financeMonthly = financingStatus === "approved" ? Number(selectedFinanceDevice?.estimatedMonthly || 0) : 0;

  return (
    <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-black/15 p-5 quote-summary">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Quote summary</p>
      {selectedPlan ? (
        <div className="mt-4 space-y-3">
          <SummaryRow label={`Plan (${lines} line${lines > 1 ? 's' : ''})`} value={`${selectedPlan.name} - $${selectedPlan.price * lines}/mo`} />
          {selectedAddOnObjects.length > 0 ? (
            selectedAddOnObjects.map((addon: any) => <SummaryRow key={addon.id} label={addon.name} value={addon.price ? `$${addon.price}/mo` : "Add"} />)
          ) : (
            <p className="text-sm text-blue-100/45">No add-ons selected yet.</p>
          )}
          {selectedFinanceDevice && (
            <SummaryRow
              label={`Financing: ${selectedFinanceDevice.name}`}
              value={financingStatus === "approved" ? `$${financeMonthly}/mo` : financingStatus === "not-approved" ? "Not available today" : "Pending application"}
            />
          )}
          <div className="border-t border-cyan-300/10 pt-3">
            <SummaryRow label="Estimated monthly" value={`$${estimatedMonthly}/mo`} strong />
          </div>

          <div className="mt-4 border-t border-cyan-300/10 pt-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 mb-3">Today's Estimate</p>
            <div className="space-y-2 text-sm">
              <SummaryRow label="Access Charge" value={`$${todayEstimateDetails.accessCharge}`} />
              <SummaryRow label="Plan Total" value={`$${todayEstimateDetails.monthlyPlanTotal}`} />
              {todayEstimateDetails.phoneTotal > 0 && <SummaryRow label="Phones" value={`$${todayEstimateDetails.phoneTotal}`} />}
              {todayEstimateDetails.tabletTotal > 0 && <SummaryRow label="Tablets" value={`$${todayEstimateDetails.tabletTotal}`} />}
              {todayEstimateDetails.vhiTotal > 0 && <SummaryRow label="VHI Bundle" value={`$${todayEstimateDetails.vhiTotal}`} />}
              <SummaryRow label="Est. Taxes (8%)" value={`$${todayEstimateDetails.estimatedTaxes}`} />
              <div className="border-t border-cyan-300/10 mt-2 pt-2">
                 <SummaryRow label="Total Due Today" value={`$${todayEstimateDetails.todayTotal}`} strong />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-blue-100/50">No plan selected yet.</p>
      )}
    </div>
  );
});

const ProgressCard = React.memo(function ProgressCard({ stat, onAdjust }: any) {
  const Icon = stat.icon;
  const progress = percent(stat.value, stat.goal);
  return (
    <div className="rounded-[1.75rem] border border-cyan-300/15 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-2xl bg-cyan-300/10 p-3">
          <Icon className={classNames("h-6 w-6", stat.accent)} />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 p-1">
          <button onClick={() => onAdjust(stat.id, -1)} className="rounded-full p-1 text-blue-200 transition hover:bg-white/10">
            <Minus className="h-4 w-4" />
          </button>
          <button onClick={() => onAdjust(stat.id, 1)} className="rounded-full p-1 text-cyan-200 transition hover:bg-white/10">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300/90">{stat.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-4xl font-black">{stat.currency ? money(stat.value) : stat.value}</p>
        <p className="text-sm text-blue-100/60">Goal: {stat.currency ? money(stat.goal) : stat.goal}</p>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/20">
        <div className="h-full rounded-full bg-tw-teal transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-right text-xs font-bold text-blue-100/60">{progress}%</p>
    </div>
  );
});

const Field = React.memo(function Field({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-blue-100/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-cyan-300/15 bg-[#06356f] px-4 py-3 text-white outline-none transition placeholder:text-blue-100/35 focus:border-cyan-300/60"
      />
    </label>
  );
});

const SummaryRow = React.memo(function SummaryRow({ label, value, strong }: any) {
  return (
    <div className="summary-row flex items-start justify-between gap-3 text-sm">
      <span className={strong ? "font-black text-white" : "text-blue-100/60"}>{label}</span>
      <span className={strong ? "font-black text-cyan-200" : "font-bold text-blue-100"}><strong>{value}</strong></span>
    </div>
  );
});

export default DashboardRefresh;
