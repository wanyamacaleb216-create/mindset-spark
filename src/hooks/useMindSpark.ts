import { useCallback, useEffect, useMemo, useState } from "react";
import { QUOTES, THEME_COLORS } from "../data/quotesData";
import type { MoodTag, Quote, ReflectionEntry, StreakState, ThemeCategory } from "../types";

const LS = {
  reflections: "mindspark.reflections",
  favorites: "mindspark.favorites",
  custom: "mindspark.custom",
  streak: "mindspark.streak",
  theme: "mindspark.theme",
};

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_STREAK: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  totalReflections: 0,
  sparkPoints: 0,
  unlockedBadges: [],
};

const MODE_THEMES: ThemeCategory[] = ["Resilience", "Curiosity", "Empathy", "Critical Thinking", "Self-Discovery"];

function dateKeyOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayProgression(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  return Math.floor((Date.now() - start.getTime()) / 86400000);
}

export function useMindSpark() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => load(LS.reflections, []));
  const [favorites, setFavorites] = useState<string[]>(() => load(LS.favorites, []));
  const [customQuotes, setCustomQuotes] = useState<Quote[]>(() => load(LS.custom, []));
  const [streak, setStreak] = useState<StreakState>(() => load(LS.streak, DEFAULT_STREAK));
  const [theme, setTheme] = useState<"light" | "dark">(() => load(LS.theme, "light"));
  const [dailyIndex, setDailyIndex] = useState(() => dayProgression() % QUOTES.length);

  useEffect(() => localStorage.setItem(LS.reflections, JSON.stringify(reflections)), [reflections]);
  useEffect(() => localStorage.setItem(LS.favorites, JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem(LS.custom, JSON.stringify(customQuotes)), [customQuotes]);
  useEffect(() => localStorage.setItem(LS.streak, JSON.stringify(streak)), [streak]);
  useEffect(() => {
    localStorage.setItem(LS.theme, JSON.stringify(theme));
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const allQuotes = useMemo(() => [...QUOTES, ...customQuotes], [customQuotes]);

  const dailyQuote = useMemo(() => QUOTES[dailyIndex % QUOTES.length], [dailyIndex]);

  const refreshDailyQuote = useCallback(() => setDailyIndex((i) => (i + 1) % QUOTES.length), []);

  const getQuoteById = useCallback((id: string) => allQuotes.find((q) => q.id === id), [allQuotes]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const isReflectedToday = useCallback((quoteId: string) => {
    const t = todayStr();
    return reflections.some((r) => r.quoteId === quoteId && r.dateStr === t);
  }, [reflections]);

  const saveReflection = useCallback(
    (entry: Omit<ReflectionEntry, "id" | "dateStr" | "timestamp"> & { dateStr?: string }) => {
      const now = new Date();
      const t = entry.dateStr ?? todayStr();
      const full: ReflectionEntry = {
        ...entry,
        id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        dateStr: t,
        timestamp: now.getTime(),
      };
      setReflections((prev) => [full, ...prev]);

      // Streak logic: reflections are date-based; use the latest dated entry
      setStreak((prev) => {
        const dates = new Set([...reflections.map((r) => r.dateStr), t]);
        const sorted = [...dates].sort();
        const last = sorted[sorted.length - 1];
        let current = 1;
        for (let i = sorted.length - 2; i >= 0; i--) {
          if (dateKeyOf(new Date(new Date(sorted[i + 1]).getTime() - 86400000)) === sorted[i]) current++;
          else break;
        }
        const unlocked = new Set(prev.unlockedBadges);
        if (!unlocked.has("first-spark")) unlocked.add("first-spark");
        if (current >= 3) unlocked.add("three-day");
        if (current >= 7) unlocked.add("week-warrior");
        const themes = new Set(reflections.concat(full).map((r) => r.theme));
        if (reflections.concat(full).filter((r) => r.theme === "Critical Thinking").length >= 5) unlocked.add("critical-thinker");
        if (reflections.concat(full).filter((r) => r.theme === "Empathy").length >= 5) unlocked.add("empath");
        if (themes.size >= 4) unlocked.add("explorer");
        if (reflections.concat(full).length >= 15) unlocked.add("fifteen-club");
        void last;
        return {
          currentStreak: current,
          longestStreak: Math.max(prev.longestStreak, current),
          lastCompletedDate: last,
          totalReflections: reflections.length + 1,
          sparkPoints: prev.sparkPoints + 10,
          unlockedBadges: [...unlocked],
        };
      });
    },
    [reflections]
  );

  const deleteReflection = useCallback((id: string) => {
    setReflections((prev) => prev.filter((r) => r.id !== id));
    setStreak((prev) => ({
      ...prev,
      totalReflections: Math.max(0, prev.totalReflections - 1),
      sparkPoints: Math.max(0, prev.sparkPoints - 10),
    }));
  }, []);

  const addCustomQuote = useCallback(
    (input: { quote: string; author: string; theme: ThemeCategory; reflectionPrompt: string; actionChallenge?: string }) => {
      const q: Quote = {
        id: `custom-${Date.now()}`,
        quote: input.quote,
        author: input.author || "You",
        theme: input.theme,
        reflectionPrompt: input.reflectionPrompt,
        actionChallenge: input.actionChallenge,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };
      setCustomQuotes((prev) => [...prev, q]);
      return q;
    },
    []
  );

  const deleteCustomQuote = useCallback((id: string) => {
    setCustomQuotes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const exportJournal = useCallback(() => {
    const payload = { reflections, favorites, customQuotes, streak, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindspark-journal-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reflections, favorites, customQuotes, streak]);

  const markdownSummary = useCallback(() => {
    const lines = ["# MindSpark Journal", "", `Exported on ${todayStr()}`, ""];
    reflections.forEach((r) => {
      lines.push(`## ${r.dateStr} - ${r.theme}`, "");
      lines.push(`> ${r.quoteText}`, "");
      lines.push(`_${r.quoteAuthor}_`, "");
      lines.push(r.userResponse, "");
      if (r.moodTag) lines.push(`Mood: ${r.moodTag}`, "");
    });
    return lines.join(String.fromCharCode(10));
  }, [reflections]);

  const copyMarkdown = useCallback(async () => {
    await navigator.clipboard.writeText(markdownSummary());
  }, [markdownSummary]);

  const weekDays = useMemo(() => {
    const days: { label: string; date: string; done: boolean }[] = [];
    const now = new Date();
    const dow = now.getDay(); // 0 = Sun
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + mondayOffset + i);
      const key = dateKeyOf(d);
      days.push({
        label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
        date: key,
        done: reflections.some((r) => r.dateStr === key),
      });
    }
    return days;
  }, [reflections]);

  const hasReflectedToday = useMemo(() => {
    const t = todayStr();
    return reflections.some((r) => r.dateStr === t);
  }, [reflections]);

  const favoriteQuotes = useMemo(() => allQuotes.filter((q) => favorites.includes(q.id)), [allQuotes, favorites]);

  return {
    reflections,
    favorites,
    customQuotes,
    streak,
    theme,
    allQuotes,
    dailyQuote,
    refreshDailyQuote,
    getQuoteById,
    isFavorite,
    toggleFavorite,
    isReflectedToday,
    saveReflection,
    deleteReflection,
    addCustomQuote,
    deleteCustomQuote,
    toggleTheme,
    exportJournal,
    copyMarkdown,
    weekDays,
    hasReflectedToday,
    favoriteQuotes,
  };
}

export function themeGrad(themeName: ThemeCategory): string {
  return THEME_COLORS[themeName].grad;
}

export function useDateLabel(): string {
  return useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }, []);
}