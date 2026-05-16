import React, { memo, useMemo, useState, useCallback } from "react";
import { Minus, Plus, ShieldCheck, ShoppingBag, Smartphone, Star, Users, Wifi } from "lucide-react";
import { useMockData } from '../hooks/useMockData';

const DEFAULT_TARGETS = {
  activations: 20,
  accessories: 500,
  protect: 14,
  vhi: 2,
  tablets: 2,
  rewards: 14,
};

const METRIC_CONFIG = [
  { key: "activations", label: "Activations", icon: Smartphone, type: "number" },
  { key: "accessories", label: "Accessories", icon: ShoppingBag, type: "currency" },
  { key: "protect", label: "Protect", icon: ShieldCheck, type: "number" },
  { key: "vhi", label: "VHI", icon: Wifi, type: "number" },
  { key: "tablets", label: "Tablets", icon: Smartphone, type: "number" },
  { key: "rewards", label: "Rewards", icon: Star, type: "number" },
] as const;

type MetricKey = typeof METRIC_CONFIG[number]["key"];

function sanitizeNumber(value: any) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,%\s,]/g, "");
    if (cleaned === "" || cleaned.toLowerCase() === "nan") return 0;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMetric(value: number, type: string) {
  const safe = sanitizeNumber(value);
  if (type === "currency") return `$${safe.toLocaleString()}`;
  return safe.toLocaleString();
}

function getProgress(value: number, target: number) {
  const safeValue = sanitizeNumber(value);
  const safeTarget = sanitizeNumber(target);
  if (safeTarget <= 0) return 0;
  return Math.min(100, Math.round((safeValue / safeTarget) * 100));
}

function getStatus(value: number, target: number) {
  const progress = getProgress(value, target);
  if (progress >= 100) return { label: "Goal met", tone: "text-emerald-300", bar: "bg-emerald-400" };
  if (progress >= 70) return { label: "On track", tone: "text-cyan-300", bar: "bg-cyan-300" };
  return { label: "Needs focus", tone: "text-[#ff174d]", bar: "bg-[#ff174d]" };
}

export function RepPerformanceFixed({ data }: { data: ReturnType<typeof useMockData> }) {
  const { teamGoals, timePeriod, setTimePeriod, adjustRepKpi, reps, displayProgress } = data;
  const { repProgress } = displayProgress;
  const targets = teamGoals as Record<string, number>;

  const teamTotals = useMemo(() => {
    return METRIC_CONFIG.reduce((acc, metric) => {
      acc[metric.key] = repProgress.reduce((sum: number, { progress }: any) => sum + sanitizeNumber(progress[metric.key]), 0);
      return acc;
    }, {} as Record<string, number>);
  }, [repProgress]);

  const updateMetric = useCallback((repId: number, metricKey: string, change: number) => {
      adjustRepKpi(repId, metricKey as any, change);
  }, [adjustRepKpi]);

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[#ec1745]/20 p-4 text-[#ff174d]">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Rep Performance</h1>
            <p className="mt-1 text-blue-100/65">Track progress, identify wins, and spot coaching opportunities.</p>
          </div>
        </div>

        <select
          value={timePeriod}
          onChange={(event) => setTimePeriod(event.target.value as any)}
          className="w-full rounded-2xl border border-cyan-300/15 bg-[#06356f] px-4 py-3 font-bold text-white outline-none sm:w-auto"
        >
          <option value="this_month">This Month</option>
          <option value="this_week">This Week</option>
          <option value="today">Today</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {METRIC_CONFIG.map((metric) => {
          const value = teamTotals[metric.key] || 0;
          const target = targets[metric.key] || DEFAULT_TARGETS[metric.key as MetricKey] || 0;
          const progress = getProgress(value, target);
          const status = getStatus(value, target);
          const Icon = metric.icon;
          return (
            <div key={metric.key} className="rounded-[1.5rem] border border-cyan-300/15 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-5 w-5 text-cyan-300" />
                <span className={status.tone + " text-xs font-black uppercase"}>{status.label}</span>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{metric.label}</p>
              <p className="mt-2 text-3xl font-black">{formatMetric(value, metric.type)}</p>
              <p className="mt-1 text-xs text-blue-100/50">Team target: {formatMetric(target, metric.type)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/20">
                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {repProgress.map(({ rep, progress}: any) => {
            const numReps = reps.length || 1;
            const repTargets = Object.entries(targets).reduce((acc: any, [key, val]: [string, any]) => {
                 acc[key] = Math.max(1, Math.round(val / numReps));
                 return acc;
            }, {});

            return (
                <RepCard key={rep.id} rep={rep} progress={progress} targets={repTargets} onAdjust={updateMetric} />
            )
        })}
      </div>
    </section>
  );
}

const RepCard = memo(function RepCard({ rep, progress, targets, onAdjust }: any) {
  const initial = rep.name?.slice(0, 1)?.toUpperCase() || "R";

  return (
    <article className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
      <header className="flex flex-col gap-4 border-b border-cyan-300/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-2xl font-black text-white">
            {initial}
          </div>
          <div>
            <h2 className="text-2xl font-black">{rep.name}</h2>
            <p className="mt-1 inline-flex rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-300">Sales Representative</p>
          </div>
        </div>
      </header>

      <div className="space-y-4 p-5 sm:p-6">
        {METRIC_CONFIG.map((metric) => (
          <MetricRow
            key={metric.key}
            metric={metric}
            value={progress[metric.key]}
            target={targets[metric.key]}
            onMinus={() => onAdjust(rep.id, metric.key, metric.type === "currency" ? -25 : -1)}
            onPlus={() => onAdjust(rep.id, metric.key, metric.type === "currency" ? 25 : 1)}
          />
        ))}
      </div>
    </article>
  );
});

const MetricRow = memo(function MetricRow({ metric, value, target, onMinus, onPlus }: any) {
  const Icon = metric.icon;
  const safeValue = sanitizeNumber(value);
  const safeTarget = sanitizeNumber(target);
  const progress = getProgress(safeValue, safeTarget);
  const status = getStatus(safeValue, safeTarget);

  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-[#06356f]/75 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="rounded-2xl bg-cyan-300/10 p-3">
            <Icon className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-black">{metric.label}</p>
              <span className={status.tone + " text-[11px] font-black uppercase tracking-wide"}>{status.label}</span>
            </div>
            <p className="text-sm text-blue-100/50">Target: {formatMetric(safeTarget, metric.type)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="min-w-[92px] text-right text-2xl font-black">{formatMetric(safeValue, metric.type)}</p>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-300/15 bg-black/20 p-1">
            <button onClick={onMinus} className="rounded-full p-2 text-blue-100/70 transition hover:bg-white/10 hover:text-white" aria-label={`Decrease ${metric.label}`}>
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={onPlus} className="rounded-full p-2 text-cyan-200 transition hover:bg-white/10 hover:text-white" aria-label={`Increase ${metric.label}`}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
        <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
});

export default RepPerformanceFixed;
