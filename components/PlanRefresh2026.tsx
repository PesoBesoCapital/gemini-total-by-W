import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Plus, Trash2, Save, X, Lock, Unlock, CalendarDays, Wifi, Smartphone, Tablet, ShieldCheck, Cloud, Sparkles } from "lucide-react";

// Mock minimal Card and Button components
const Card = ({ children, className = "" }: any) => <div className={`rounded-xl border ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }: any) => <div className={`p-4 ${className}`}>{children}</div>;
const Button = ({ children, onClick, className = "", variant = "default", size = "default" }: any) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-tw-navy text-white hover:bg-tw-navy/90",
        destructive: "bg-tw-red text-white hover:bg-tw-red/90",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-700",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
    };
    
    // Add custom classes from props, but let them override
    const appliedVariant = variants[variant as keyof typeof variants] || variants.default;
    const appliedSize = sizes[size as keyof typeof sizes] || sizes.default;

    return (
        <button onClick={onClick} className={`${baseStyle} ${appliedVariant} ${appliedSize} ${className}`}>
            {children}
        </button>
    );
};

const ADMIN_PASSWORD = "Total2026";

const starterPlans = [
  {
    id: "max-byo",
    name: "Total MAX 5G BYO",
    price: 30,
    audience: "Customers bringing their own compatible phone",
    network: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot data at 5Mbps",
    perks: ["Spam Protection", "Disney+ on us for 6 months", "100GB Cloud Storage"],
    international: "Calling/texting to 200+ destinations, Canada & Mexico roaming, plus 140+ roaming countries",
    requirement: "Bring your own device required",
    oldComparison: "Old BYOD messaging often felt separate from the regular plan lineup.",
    newBenefit: "Now BYO is easier to position as part of the same refreshed lineup with a clear $30 entry point.",
  },
  {
    id: "starter",
    name: "Total STARTER",
    price: 40,
    audience: "Everyday users who want simple unlimited service",
    network: "Unlimited data covered by Verizon 5G network",
    hotspot: "10GB hotspot data",
    perks: ["Spam Protection"],
    international: "Calling to 85+ destinations, texting to 200+ destinations, roaming in Canada and Mexico",
    requirement: "Works with Total STARTER plan",
    oldComparison: "Old entry plans were harder to compare quickly against higher tiers.",
    newBenefit: "Cleaner entry plan: $40 with taxes and fees included, hotspot, spam protection, and international basics.",
  },
  {
    id: "max-5g",
    name: "Total MAX 5G",
    price: 55,
    audience: "Customers who want more premium data and perks",
    network: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot data at 5Mbps",
    perks: ["Spam Protection", "Disney+ on us for 6 months", "100GB Cloud Storage"],
    international: "Calling/texting to 200+ destinations, Canada & Mexico roaming, plus 140+ roaming countries",
    requirement: "Great for streamers, families, students, and power users",
    oldComparison: "Premium value had to be explained with too many separate points.",
    newBenefit: "More obvious value: unlimited premium-style data, unlimited hotspot, Disney+, and cloud storage in one pitch.",
  },
  {
    id: "all-access",
    name: "Total ALL ACCESS",
    price: 65,
    audience: "Customers who want the strongest plan and biggest perks",
    network: "Unlimited Ultra Wideband 5G",
    hotspot: "Unlimited hotspot data at 10Mbps, twice the speed of Total MAX 5G",
    perks: ["Spam Protection", "Disney+ on us", "1TB Cloud Storage", "$10 international calling credit"],
    international: "Calling/texting to 200+ destinations, Canada & Mexico roaming, plus 140+ roaming countries",
    requirement: "Best for heavy users, families, business users, and customers who hotspot often",
    oldComparison: "The top-tier plan needed a stronger reason to justify the upgrade.",
    newBenefit: "Clear upgrade story: faster hotspot, Disney+, huge 1TB cloud storage, and international calling credit.",
  },
];

const starterRules = [
  {
    title: "No Mix and Match",
    detail: "All smartphone lines on one account must be on the exact same 2026 refresh plan.",
    example: "Example: one line cannot be Total STARTER while another smartphone line is Total MAX 5G.",
  },
  {
    title: "Connected Device Exception",
    detail: "Tablets, Home Internet, mobile hotspots, and other connected devices can still be added alongside the unified smartphone plan.",
    example: "Example: a customer can have all smartphone lines on STARTER and still add a tablet or Home Internet line.",
  },
  {
    title: "4th Line Is No Longer $0",
    detail: "The 4th line is no longer called free, but group pricing is still built into the refreshed plans.",
    example: "STARTER, MAX 5G, and ALL ACCESS: 4th line is $10. MAX 5G BYO: 4th line is $20.",
  },
  {
    title: "Taxes and Fees Included",
    detail: "The price customers see is the price they pay, making the pitch easier and cleaner.",
    example: "This helps customers compare against postpaid bills, cable companies, and family plans without hidden-fee confusion.",
  },
  {
    title: "Price Guaranteed for 5 Years",
    detail: "Plans can be positioned around stability, savings, and predictability.",
    example: "A customer tired of price increases can lock in a plan and know what they are paying.",
  },
];

const starterDevicePlans = [
  {
    id: "home-internet",
    name: "Home Internet 5G",
    standalone: 60,
    bundleDiscount: -25,
    bundledPrice: 35,
    icon: Wifi,
    pitch: "Strong home internet option for customers paying too much with cable or needing simple plug-and-play service.",
  },
  {
    id: "tablet-base",
    name: "Tablet Base",
    standalone: 50,
    bundleDiscount: -40,
    bundledPrice: 10,
    icon: Tablet,
    pitch: "Easy tablet add-on for families, students, kids, workers, and entertainment users.",
  },
  {
    id: "tablet-5g",
    name: "Tablet 5G",
    standalone: 60,
    bundleDiscount: -40,
    bundledPrice: 20,
    icon: Tablet,
    pitch: "Best tablet option when the customer wants stronger connectivity and better mobility.",
  },
];

function currency(value: number) {
  return `$${Math.abs(value)}`;
}

function safeClone(value: any) {
  return JSON.parse(JSON.stringify(value));
}

export default function PlanRefresh2026() {
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem("tw-2026-plans");
    return saved ? JSON.parse(saved) : starterPlans;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("tw-2026-rules");
    return saved ? JSON.parse(saved) : starterRules;
  });

  const [devicePlans, setDevicePlans] = useState(() => {
    const saved = localStorage.getItem("tw-2026-device-plans");
    return saved ? JSON.parse(saved) : starterDevicePlans;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [notice, setNotice] = useState("");

  const launchDate = useMemo(() => new Date("2026-05-13T00:00:00"), []);
  // Use real current date
  const today = useMemo(() => new Date(), []);
  const daysUntilLaunch = Math.max(0, Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const saveAll = (nextPlans = plans, nextRules = rules, nextDevicePlans = devicePlans) => {
    localStorage.setItem("tw-2026-plans", JSON.stringify(nextPlans));
    localStorage.setItem("tw-2026-rules", JSON.stringify(nextRules));
    localStorage.setItem("tw-2026-device-plans", JSON.stringify(nextDevicePlans));
    setNotice("Saved locally.");
    setTimeout(() => setNotice(""), 3500);
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPassword("");
      setNotice("Admin mode unlocked.");
      setTimeout(() => setNotice(""), 2500);
    } else {
      setNotice("Wrong admin password.");
      setTimeout(() => setNotice(""), 2500);
    }
  };

  const resetDemoData = () => {
    setPlans(starterPlans);
    setRules(starterRules);
    setDevicePlans(starterDevicePlans);
    saveAll(starterPlans, starterRules, starterDevicePlans);
  };

  const addPlan = () => {
    const newPlan = {
      id: `custom-${Date.now()}`,
      name: "New Plan",
      price: 0,
      audience: "Add target customer",
      network: "Add data/network details",
      hotspot: "Add hotspot details",
      perks: ["Add perk"],
      international: "Add international details",
      requirement: "Add requirement",
      oldComparison: "Add old plan comparison.",
      newBenefit: "Add new plan benefit.",
    };
    const next = [...plans, newPlan];
    setPlans(next);
    saveAll(next, rules, devicePlans);
    setEditingPlan(safeClone(newPlan));
  };

  const updatePlan = () => {
    const next = plans.map((plan: any) => (plan.id === editingPlan.id ? editingPlan : plan));
    setPlans(next);
    setEditingPlan(null);
    saveAll(next, rules, devicePlans);
  };

  const removePlan = (id: string) => {
    const next = plans.filter((plan: any) => plan.id !== id);
    setPlans(next);
    saveAll(next, rules, devicePlans);
  };

  const addRule = () => {
    const newRule = {
      title: "New Rule",
      detail: "Add details here.",
      example: "Add customer-facing example here.",
    };
    const next = [...rules, newRule];
    setRules(next);
    saveAll(plans, next, devicePlans);
    setEditingRule({ ...newRule, index: next.length - 1 });
  };

  const updateRule = () => {
    const next = rules.map((rule: any, index: number) => (index === editingRule.index ? { title: editingRule.title, detail: editingRule.detail, example: editingRule.example } : rule));
    setRules(next);
    setEditingRule(null);
    saveAll(plans, next, devicePlans);
  };

  const removeRule = (indexToRemove: number) => {
    const next = rules.filter((_: any, index: number) => index !== indexToRemove);
    setRules(next);
    saveAll(plans, next, devicePlans);
  };

  const addDevicePlan = () => {
    const newDevice = {
      id: `device-${Date.now()}`,
      name: "New Connected Device Plan",
      standalone: 0,
      bundleDiscount: 0,
      bundledPrice: 0,
      pitch: "Add pitch here.",
    };
    const next = [...devicePlans, newDevice];
    setDevicePlans(next);
    saveAll(plans, rules, next);
    setEditingDevice(safeClone(newDevice));
  };

  const updateDevicePlan = () => {
    const next = devicePlans.map((item: any) => (item.id === editingDevice.id ? { ...editingDevice } : item));
    setDevicePlans(next);
    setEditingDevice(null);
    saveAll(plans, rules, next);
  };

  const removeDevicePlan = (id: string) => {
    const next = devicePlans.filter((item: any) => item.id !== id);
    setDevicePlans(next);
    saveAll(plans, rules, next);
  };

  const planCopyBlock = (plan: any) => {
    return `${plan.name}: $${plan.price}/mo with taxes and fees included. ${plan.network}. ${plan.hotspot}. Includes ${plan.perks.join(", ")}. ${plan.international}. Best for ${plan.audience.toLowerCase()}.`;
  };

  return (
    <div className="bg-gradient-to-br from-tw-navy/80 via-tw-teal/10 to-tw-navy text-slate-100 rounded-xl overflow-hidden shadow-2xl pb-10">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-tw-navy/80 backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-tw-teal">2026 Plan Refresh</p>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl text-white mt-1">Total Wireless Plan Update Hub</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-300">
              Phase 1 foundation for the May 13, 2026 launch: compare old vs new, explain benefits, and give reps clean customer-facing talking points.
            </p>
          </div>

          <Card className="border border-tw-teal/20 bg-tw-navy/90 text-white shadow-2xl flex-shrink-0">
            <CardContent className="flex items-center gap-4 p-4">
              <CalendarDays className="h-8 w-8 text-tw-teal" />
              <div>
                <p className="text-xs uppercase tracking-widest text-tw-teal/80">Go Live</p>
                <p className="text-xl font-black">May 13, 2026</p>
                <p className={`text-sm font-bold ${daysUntilLaunch === 0 ? 'text-tw-teal' : 'text-tw-red/80'}`}>
                  {daysUntilLaunch === 0 ? 'LIVE NOW' : `${daysUntilLaunch} days from today`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="px-6 py-8 space-y-10">
        {notice && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-md bg-tw-teal/20 border border-tw-teal/50 px-5 py-3 font-semibold text-tw-teal shadow-xl text-center">
            {notice}
          </motion.div>
        )}

        <section className="mb-6">
          <Card className="border border-tw-teal/10 bg-tw-navy/40 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-tw-teal" />
                <h2 className="text-xl font-black text-white">What changed and why it helps</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                The refreshed lineup is cleaner: taxes and fees included, a 5-year price guarantee, clearer one-line pricing, easier BYO positioning, stronger perks, and simple bundle pricing for Home Internet and Tablets. Translation for real customers: fewer surprises, easier math, and a better reason to switch.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-tw-navy/60 border border-tw-red/10 p-4">
                  <p className="font-bold text-tw-red mb-1 text-sm">Old problem</p>
                  <p className="text-xs text-gray-400">Too many plan explanations slowed down the sale.</p>
                </div>
                <div className="rounded-xl bg-tw-navy/60 border border-tw-teal/10 p-4">
                  <p className="font-bold text-tw-teal mb-1 text-sm">New advantage</p>
                  <p className="text-xs text-gray-400">Simple plan names, obvious pricing, better perks.</p>
                </div>
                <div className="rounded-xl bg-tw-navy/60 border border-tw-blue/10 p-4">
                  <p className="font-bold text-tw-blue mb-1 text-sm">Sales angle</p>
                  <p className="text-xs text-gray-400">Lead with price stability, Verizon 5G coverage, and bundles.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">New one-line plan lineup</h2>
            <p className="text-gray-400 text-sm mt-1">Use this for customers comparing price, hotspot, perks, and international value.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan: any) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <Card className="h-full border border-tw-teal/20 bg-tw-navy/60 shadow-xl flex flex-col">
                  <CardContent className="flex flex-col flex-grow p-6">
                    <div className="mb-6 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tw-teal mb-1">{plan.audience}</p>
                        <h3 className="text-xl font-black text-white leading-tight">{plan.name}</h3>
                      </div>
                      <div className="rounded-lg bg-tw-red p-3 text-center text-white shadow-lg shrink-0 w-20">
                        <p className="text-[10px] font-bold uppercase opacity-90">per mo</p>
                        <p className="text-2xl font-black leading-none mt-1">${plan.price}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs text-gray-300 flex-grow">
                      <p><strong className="text-white">Network:</strong> {plan.network}</p>
                      <p><strong className="text-white">Hotspot:</strong> {plan.hotspot}</p>
                      <p><strong className="text-white">Int'l:</strong> {plan.international}</p>
                      <p className="pt-2"><strong className="text-tw-teal">Requires:</strong> {plan.requirement}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {plan.perks.map((perk: string) => (
                         <span key={perk} className="rounded-md bg-tw-teal/10 border border-tw-teal/20 px-2.5 py-1 text-[10px] font-bold text-tw-teal">{perk}</span>
                      ))}
                    </div>

                    <div className="mt-5 rounded-lg bg-tw-navy border border-gray-700/50 p-4">
                      <p className="text-[10px] font-black uppercase text-tw-blue mb-1.5">Old vs New</p>
                      <p className="text-xs text-gray-500 line-through decoration-tw-red/50 decoration-2 mb-2">{plan.oldComparison}</p>
                      <p className="text-xs font-semibold text-gray-200">{plan.newBenefit}</p>
                    </div>

                    {isAdmin && (
                      <div className="mt-4 flex gap-2 pt-2 border-t border-gray-800">
                        <Button onClick={() => setEditingPlan(safeClone(plan))} size="sm" className="flex-1 bg-tw-navy/80 text-white font-bold border border-gray-700 hover:bg-gray-800 text-xs"><Edit3 className="mr-1.5 h-3 w-3" /> Edit</Button>
                        <Button onClick={() => removePlan(plan.id)} size="sm" variant="destructive" className="w-10 px-0 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-tw-teal/20 bg-tw-navy/40 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-tw-teal" />
                <h2 className="text-xl font-black text-white">Rules reps must know</h2>
              </div>
              <div className="space-y-3">
                {rules.map((rule: any, index: number) => (
                  <div key={`${rule.title}-${index}`} className="rounded-lg bg-tw-navy border border-tw-teal/10 p-4 hover:border-tw-teal/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white mb-1.5">{rule.title}</p>
                        <p className="text-xs text-gray-400 mb-2">{rule.detail}</p>
                        <p className="text-xs font-semibold text-tw-teal bg-tw-teal/5 inline-block px-2 py-1 rounded inline-flex">{rule.example}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" onClick={() => setEditingRule({ ...safeClone(rule), index })} className="bg-tw-navy/80 border border-gray-700 text-white hover:bg-gray-800 h-8 w-8 px-0"><Edit3 className="h-3 w-3" /></Button>
                          <Button size="sm" onClick={() => removeRule(index)} variant="destructive" className="h-8 w-8 px-0"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-tw-teal/20 bg-tw-navy/40 shadow-xl">
            <CardContent className="p-6">
               <div className="mb-4 flex items-center gap-3">
                <Cloud className="h-6 w-6 text-tw-teal" />
                <h2 className="text-xl font-black text-white">Connected Device Bundle Pricing</h2>
              </div>
              <p className="mb-6 text-xs text-gray-400">This is where Home Internet and Tablets become easier to sell. Bundle discount, lower monthly cost, cleaner close.</p>
              
              <div className="space-y-4">
                {devicePlans.map((item: any) => {
                  return (
                    <div key={item.id} className="rounded-lg bg-tw-navy border border-gray-700 p-4">
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                             <div className="bg-tw-teal/10 p-2 rounded-md">
                                {item.name.includes("Internet") ? <Wifi className="h-5 w-5 text-tw-teal" /> : <Tablet className="h-5 w-5 text-tw-teal" />}
                             </div>
                             <p className="text-md font-black text-white">{item.name}</p>
                        </div>
                         {isAdmin && (
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => setEditingDevice(safeClone(item))} className="bg-tw-navy/80 border border-gray-700 text-white hover:bg-gray-800 h-8 w-8 px-0"><Edit3 className="h-3 w-3" /></Button>
                                <Button size="sm" onClick={() => removeDevicePlan(item.id)} variant="destructive" className="h-8 w-8 px-0"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs bg-tw-navy/80 rounded-md p-3 mb-3 border border-gray-800">
                         <div>
                             <p className="text-gray-500 mb-0.5">Standalone</p>
                             <p className="text-gray-300 font-bold">{currency(item.standalone)}</p>
                         </div>
                         <div>
                             <p className="text-gray-500 mb-0.5">Bundle Discount</p>
                             <p className="text-tw-teal font-bold">-{currency(item.bundleDiscount)}</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between">
                         <p className="text-xs text-gray-300 flex-1 pr-4">{item.pitch}</p>
                         <div className="rounded-md bg-tw-blue px-3 py-1.5 text-center shrink-0">
                           <p className="text-[10px] uppercase font-bold text-white/80 leading-none">Bundled</p>
                           <p className="text-lg font-black text-white leading-none mt-1">${item.bundledPrice}</p>
                         </div>
                      </div>
                     
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {editingPlan && (
        <EditorModal title={`Edit ${editingPlan.name}`} onClose={() => setEditingPlan(null)} onSave={updatePlan}>
          <div className="grid grid-cols-2 gap-4">
             <Input label="Plan name" value={editingPlan.name} onChange={(value: any) => setEditingPlan({ ...editingPlan, name: value })} />
             <Input label="Monthly price" value={editingPlan.price} type="number" onChange={(value: any) => setEditingPlan({ ...editingPlan, price: Number(value) })} />
          </div>
          <Input label="Audience" value={editingPlan.audience} onChange={(value: any) => setEditingPlan({ ...editingPlan, audience: value })} />
          <div className="grid grid-cols-2 gap-4">
              <Input label="Network" value={editingPlan.network} onChange={(value: any) => setEditingPlan({ ...editingPlan, network: value })} />
              <Input label="Hotspot" value={editingPlan.hotspot} onChange={(value: any) => setEditingPlan({ ...editingPlan, hotspot: value })} />
          </div>
          <Input label="Perks (comma separated)" value={editingPlan.perks.join(", ")} onChange={(value: any) => setEditingPlan({ ...editingPlan, perks: value.split(",").map((item: string) => item.trim()).filter(Boolean) })} />
          <Input label="International" value={editingPlan.international} onChange={(value: any) => setEditingPlan({ ...editingPlan, international: value })} />
          <Input label="Requirement" value={editingPlan.requirement} onChange={(value: any) => setEditingPlan({ ...editingPlan, requirement: value })} />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Old comparison" value={editingPlan.oldComparison} onChange={(value: any) => setEditingPlan({ ...editingPlan, oldComparison: value })} />
             <Input label="New benefit" value={editingPlan.newBenefit} onChange={(value: any) => setEditingPlan({ ...editingPlan, newBenefit: value })} />
          </div>
        </EditorModal>
      )}

      {editingRule && (
        <EditorModal title={`Edit Rule`} onClose={() => setEditingRule(null)} onSave={updateRule}>
          <Input label="Rule title" value={editingRule.title} onChange={(value: any) => setEditingRule({ ...editingRule, title: value })} />
          <Input label="Rule detail" value={editingRule.detail} onChange={(value: any) => setEditingRule({ ...editingRule, detail: value })} />
          <Input label="Example" value={editingRule.example} onChange={(value: any) => setEditingRule({ ...editingRule, example: value })} />
        </EditorModal>
      )}

      {editingDevice && (
        <EditorModal title={`Edit ${editingDevice.name}`} onClose={() => setEditingDevice(null)} onSave={updateDevicePlan}>
          <Input label="Name" value={editingDevice.name} onChange={(value: any) => setEditingDevice({ ...editingDevice, name: value })} />
          <div className="grid grid-cols-3 gap-4">
              <Input label="Standalone price" type="number" value={editingDevice.standalone} onChange={(value: any) => setEditingDevice({ ...editingDevice, standalone: Number(value) })} />
              <Input label="Bundle discount" type="number" value={editingDevice.bundleDiscount} onChange={(value: any) => setEditingDevice({ ...editingDevice, bundleDiscount: Number(value) })} />
              <Input label="Bundled price" type="number" value={editingDevice.bundledPrice} onChange={(value: any) => setEditingDevice({ ...editingDevice, bundledPrice: Number(value) })} />
          </div>
          <Input label="Pitch" value={editingDevice.pitch} onChange={(value: any) => setEditingDevice({ ...editingDevice, pitch: value })} />
        </EditorModal>
      )}
    </div>
  );
}

function EditorModal({ title, children, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tw-navy/90 p-4 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-tw-navy border border-tw-teal/20 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-700 pb-4">
          <h3 className="text-xl font-black text-white">{title}</h3>
          <Button onClick={onClose} variant="ghost" size="sm" className="h-8 w-8 px-0 text-gray-400 hover:text-white"><X className="h-5 w-5" /></Button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="mt-8 flex gap-3 border-t border-gray-700 pt-6">
          <Button onClick={onSave} className="flex-1 bg-tw-teal text-tw-navy hover:bg-tw-teal/80 font-bold"><Save className="mr-2 h-4 w-4" /> Save</Button>
          <Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">Cancel</Button>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-gray-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={type === "number" ? 1 : 2}
        className="w-full rounded-md border border-gray-600 bg-tw-navy/60 px-3 py-2 text-sm text-white outline-none ring-tw-teal transition focus:border-tw-teal focus:ring-1"
      />
    </label>
  );
}
