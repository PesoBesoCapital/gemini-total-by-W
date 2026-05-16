import React, { useState, useCallback, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Language = "en" | "es";

interface TranslatorState {
  isActive: boolean;
  currentLang: Language;
  isLoading: boolean;
  error: string | null;
}

// ─── Storage key for language preference ─────────────────────────────────────
const LANG_KEY = "tw_translator_lang";

// ─── Simple cache so we don't re-translate the same text ────────────────────
const cache: Record<string, string> = {};

async function translateText(text: string, target: "en" | "es"): Promise<string> {
  if (!text.trim()) return text;
  const key = `${target}:${text}`;
  if (cache[key]) return cache[key];

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const translated = data?.responseData?.translatedText ?? text;
    cache[key] = translated;
    return translated;
  } catch {
    return text; // fall back to original on error
  }
}

// ─── Walk DOM text nodes and translate in-place ───────────────────────────────
async function translateNode(node: Node, target: Language, originalMap: Map<Node, string>): Promise<void> {
  if (node.nodeType === Node.TEXT_NODE) {
    const original = originalMap.get(node) ?? node.textContent ?? "";
    if (!originalMap.has(node)) originalMap.set(node, original);
    const trimmed = original.trim();
    if (!trimmed || trimmed.length < 2) return;

    if (target === "en") {
      node.textContent = original; // restore
    } else {
      const translated = await translateText(original, target);
      node.textContent = translated;
    }
    return;
  }

  // Skip inputs, scripts, styles, iframes
  const skip = ["SCRIPT", "STYLE", "IFRAME", "INPUT", "TEXTAREA", "SELECT", "CODE"];
  if (node.nodeType === Node.ELEMENT_NODE && skip.includes((node as Element).tagName)) return;

  for (const child of Array.from(node.childNodes)) {
    await translateNode(child, target, originalMap);
  }
}

// ─── Batch-collect all text nodes for progress tracking ──────────────────────
function collectTextNodes(root: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const skip = ["SCRIPT", "STYLE", "IFRAME", "INPUT", "TEXTAREA", "SELECT", "CODE"];
      if (node.parentElement && skip.includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
      const text = node.textContent?.trim() ?? "";
      return text.length >= 2 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  let current;
  while ((current = walker.nextNode())) nodes.push(current as Text);
  return nodes;
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useTranslator() {
  const [state, setState] = useState<TranslatorState>(() => ({
    isActive: localStorage.getItem(LANG_KEY) === "es",
    currentLang: (localStorage.getItem(LANG_KEY) as Language) || "en",
    isLoading: false,
    error: null,
  }));

  const originalMapRef = useRef<Map<Node, string>>(new Map());
  const [progress, setProgress] = useState(0); // 0–100

  const applyTranslation = useCallback(async (target: Language) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    setProgress(0);

    const root = document.getElementById("root");
    if (!root) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    if (target === "en") {
      // Restore originals quickly
      const entries = Array.from(originalMapRef.current.entries()) as [Node, string][];
      for (const [node, original] of entries) {
        node.textContent = original;
      }
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
      setState({ isActive: false, currentLang: "en", isLoading: false, error: null });
      localStorage.setItem(LANG_KEY, "en");
      return;
    }

    // Collect text nodes
    const nodes = collectTextNodes(root);
    const total = nodes.length;
    let done = 0;

    // Batch translate with concurrency control
    const BATCH = 8;
    for (let i = 0; i < nodes.length; i += BATCH) {
      const batch = nodes.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (node) => {
          const original = originalMapRef.current.get(node) ?? node.textContent ?? "";
          if (!originalMapRef.current.has(node)) originalMapRef.current.set(node, original);
          if (original.trim().length < 2) { done++; return; }
          const translated = await translateText(original, target);
          node.textContent = translated;
          done++;
          setProgress(Math.round((done / total) * 100));
        })
      );
    }

    setProgress(100);
    setTimeout(() => setProgress(0), 800);
    setState({ isActive: true, currentLang: "es", isLoading: false, error: null });
    localStorage.setItem(LANG_KEY, "es");
  }, []);

  const toggle = useCallback(() => {
    const next: Language = state.currentLang === "en" ? "es" : "en";
    applyTranslation(next);
  }, [state.currentLang, applyTranslation]);

  return { state, progress, toggle };
}

// ─── Translator Button Component (for sidebar) ────────────────────────────────
export function TranslatorButton({ collapsed }: { collapsed?: boolean }) {
  const { state, progress, toggle } = useTranslator();

  const isEs = state.currentLang === "es";
  const isLoading = state.isLoading;

  return (
    <div className={`px-3 pb-3 ${collapsed ? "px-2" : ""}`}>
      <button
        onClick={toggle}
        disabled={isLoading}
        title={isEs ? "Switch to English" : "Traducir a Español"}
        className={`
          relative w-full flex items-center gap-3 rounded-2xl px-3 py-3 font-bold transition-all
          ${isEs
            ? "bg-[#E31837] text-white shadow-[0_0_16px_rgba(0,255,255,0.4)] border border-cyan-300/50"
            : "text-blue-100/85 hover:bg-white/10 hover:text-white border border-transparent"
          }
          ${isLoading ? "opacity-75 cursor-wait" : "cursor-pointer"}
        `}
      >
        {/* Progress bar */}
        {isLoading && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-2xl overflow-hidden bg-white/10">
            <div
              className="h-full bg-cyan-300 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Icon — styled like the Total Wireless logo */}
        <div
          className={`
            flex flex-col items-center justify-center rounded-full shrink-0
            ${collapsed ? "w-9 h-9" : "w-9 h-9"}
            ${isEs ? "bg-white/20 shadow-inner" : "bg-[#E31837]"}
          `}
        >
          <span className={`font-black leading-none tracking-tighter ${collapsed ? "text-[9px]" : "text-[10px]"}`}>to</span>
          <span className={`font-black leading-none tracking-tighter ${collapsed ? "text-[9px]" : "text-[10px]"}`}>tal</span>
          <span className={`font-bold leading-tight ${collapsed ? "text-[4px]" : "text-[5px]"}`}>wireless</span>
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-black leading-none truncate">
              {isLoading
                ? `Translating… ${progress}%`
                : isEs
                ? "🇪🇸 Español"
                : "🇺🇸 Translate"}
            </p>
            <p className={`text-[10px] leading-none mt-0.5 ${isEs ? "text-white/70" : "text-blue-100/50"}`}>
              {isLoading ? "Please wait" : isEs ? "Tap to switch to English" : "EN → ES"}
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
