import React, { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import { TranslatorButton } from "./Translator";

const NAV_SECTIONS = [
  {
    group: "Analytics",
    items: [
      { id: "team-dashboard", label: "Dashboard", icon: Home },
      { id: "daily-pulse", label: "Workday Pulse", icon: BarChart3 },
      { id: "comparisons", label: "Comparisons", icon: BarChart3 },
      { id: "client-manager", label: "Client Manager", icon: Users },
      { id: "quick-entry", label: "Quick Entry", icon: Smartphone },
      { id: "reps", label: "Rep Performance", icon: Users },
      { id: "team-chat", label: "Team Chat", icon: Users },
    ],
  },
  {
    group: "Development",
    items: [
      { id: "plan-refresh", label: "2026 Plan Refresh", icon: ShieldCheck },
      { id: "promotions", label: "Promotions", icon: ShoppingBag },
      { id: "practice", label: "Practice Hub", icon: Users },
      { id: "habits", label: "Habits Tracker", icon: CheckCircle2 },
      { id: "weekly-review", label: "Review & Coach", icon: CalendarDays },
      { id: "admin", label: "Admin Center", icon: ShieldCheck },
    ],
  },
];

// The 4 items shown in the mobile bottom nav bar (+ "More" = 5 total)
const BOTTOM_NAV_ITEMS = [
  { id: "team-dashboard", label: "Home", icon: Home },
  { id: "client-manager", label: "Clients", icon: Users },
  { id: "quick-entry", label: "Entry", icon: Smartphone },
  { id: "daily-pulse", label: "Pulse", icon: BarChart3 },
];

const ALL_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);
function getPageLabel(id: string) {
  return ALL_ITEMS.find((i) => i.id === id)?.label ?? "TotalWireless Hub";
}

export function ResponsiveAppShell({
  activePage,
  onNavigate,
  children,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleNavigate = (pageId: string) => {
    onNavigate?.(pageId);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#062f66] text-white">
      <MobileTopBar activePage={activePage} onOpen={() => setMobileOpen(true)} />

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={
            desktopCollapsed
              ? "sticky top-0 hidden h-screen w-[84px] shrink-0 border-r border-cyan-300/10 bg-[#06356f] lg:block overflow-hidden"
              : "sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-cyan-300/10 bg-[#06356f] lg:block overflow-hidden"
          }
        >
          <SidebarContent
            activePage={activePage}
            collapsed={desktopCollapsed}
            onNavigate={handleNavigate}
            onCollapse={() => setDesktopCollapsed((v) => !v)}
          />
        </aside>

        {/* Mobile drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] flex lg:hidden">
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="absolute inset-0 block w-full h-full bg-black/60 backdrop-blur-sm cursor-default border-none p-0 m-0"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative z-10 h-full w-[85vw] max-w-[320px] shrink-0 overflow-y-auto border-r border-cyan-300/10 bg-[#06356f] shadow-2xl flex flex-col">
              <SidebarContent
                activePage={activePage}
                collapsed={false}
                mobile
                onNavigate={handleNavigate}
                onClose={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Main content — pb-24 gives clearance for the bottom nav on mobile */}
        <main className="min-w-0 flex-1 px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8 overflow-y-auto overflow-x-hidden max-h-screen">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav bar */}
      <MobileBottomNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAll={() => setMobileOpen(true)}
      />
    </div>
  );
}

/* ─────────────────── Mobile top bar ─────────────────── */
function MobileTopBar({
  activePage,
  onOpen,
}: {
  activePage: string;
  onOpen: () => void;
}) {
  const label = getPageLabel(activePage);
  return (
    <header className="sticky top-0 z-[90] flex items-center justify-between gap-3 border-b border-cyan-300/10 bg-[#06356f]/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
      <button
        onClick={onOpen}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100 transition active:bg-cyan-300/20"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-black leading-snug">{label}</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">
          TotalWireless Hub
        </p>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ec1745] text-[11px] font-black">
        TW
      </div>
    </header>
  );
}

/* ─────────────────── Mobile bottom nav ─────────────────── */
function MobileBottomNav({
  activePage,
  onNavigate,
  onOpenAll,
}: {
  activePage: string;
  onNavigate: (id: string) => void;
  onOpenAll: () => void;
}) {
  const isBottomItem = BOTTOM_NAV_ITEMS.some((i) => i.id === activePage);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[90] lg:hidden border-t border-white/10 bg-[#06356f]/97 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.35)]">
      <div className="relative flex items-stretch">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-colors"
            >
              {/* indicator pill */}
              {active && (
                <span className="absolute top-0 mx-auto h-[2px] w-8 rounded-full bg-[#ec1745]" />
              )}
              <Icon
                className={`h-[22px] w-[22px] transition-all ${
                  active
                    ? "text-[#ec1745] scale-110"
                    : "text-blue-100/50"
                }`}
              />
              <span
                className={`text-[10px] font-bold leading-none ${
                  active ? "text-[#ec1745]" : "text-blue-100/45"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More — highlights when the active page is not in the bottom bar */}
        <button
          id="bottom-nav-more"
          onClick={onOpenAll}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-colors"
        >
          {!isBottomItem && (
            <span className="absolute top-0 mx-auto h-[2px] w-8 rounded-full bg-[#ec1745]" />
          )}
          <Menu
            className={`h-[22px] w-[22px] transition-all ${
              !isBottomItem ? "text-[#ec1745] scale-110" : "text-blue-100/50"
            }`}
          />
          <span
            className={`text-[10px] font-bold leading-none ${
              !isBottomItem ? "text-[#ec1745]" : "text-blue-100/45"
            }`}
          >
            More
          </span>
        </button>
      </div>
      {/* iOS safe-area inset */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </nav>
  );
}

/* ─────────────────── Sidebar content ─────────────────── */
function SidebarContent({
  activePage,
  collapsed,
  mobile,
  onNavigate,
  onCollapse,
  onClose,
}: any) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-cyan-300/10 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ec1745] text-[13px] font-black">
            TW
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xl font-black leading-5">TotalWireless</p>
              <p className="font-black text-cyan-300">Hub</p>
            </div>
          )}
        </div>

        {mobile ? (
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-blue-100/80 hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={onCollapse}
            className="rounded-xl p-2 text-blue-100/80 hover:bg-white/10"
            aria-label="Collapse sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.group} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                {section.group}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={
                      active
                        ? "flex w-full items-center gap-3 rounded-2xl bg-[#ec1745] px-3 py-3 font-black text-white shadow-lg shadow-red-950/20"
                        : "flex w-full items-center gap-3 rounded-2xl px-3 py-3 font-bold text-blue-100/85 transition hover:bg-white/10 hover:text-white"
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Translator button — pinned at the bottom of the sidebar */}
      <div className="border-t border-cyan-300/10 pt-2">
        <TranslatorButton collapsed={collapsed} />
      </div>
    </div>
  );
}


