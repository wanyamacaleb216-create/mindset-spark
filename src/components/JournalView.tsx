import { motion } from "framer-motion";
import {
  Bookmark,
  Download,
  Heart,
  Pencil,
  Quote,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MOOD_TAGS, THEME_COLORS } from "../data/quotesData";
import { useMindSpark } from "../hooks/useMindSpark";
import type { MoodTag, ThemeCategory } from "../types";

export default function JournalView() {
  const {
    reflections,
    favoriteQuotes,
    isFavorite,
    toggleFavorite,
    deleteReflection,
    exportJournal,
    copyMarkdown,
  } = useMindSpark();
  const [tab, setTab] = useState<"journal" | "favorites">("journal");
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<ThemeCategory | "All">("All");
  const [moodFilter, setMoodFilter] = useState<MoodTag | "All">("All");

  const themes = useMemo(() => {
    const set = new Set<ThemeCategory>(reflections.map((r) => r.theme));
    return ["All", ...Array.from(set)] as (ThemeCategory | "All")[];
  }, [reflections]);

  const filteredReflections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reflections.filter((r) => {
      if (themeFilter !== "All" && r.theme !== themeFilter) return false;
      if (moodFilter !== "All" && r.moodTag !== moodFilter) return false;
      if (q && !`${r.quoteText} ${r.userResponse} ${r.quoteAuthor}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reflections, search, themeFilter, moodFilter]);

  const filteredFavorites = useMemo(() => {
    const q = search.trim().toLowerCase();
    return favoriteQuotes.filter((fq) => !q || `${fq.quote} ${fq.author}`.toLowerCase().includes(q));
  }, [favoriteQuotes, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Private, on-device</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Your growth library</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyMarkdown}
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
          >
            Copy summary
          </button>
          <button
            onClick={exportJournal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-2xl bg-zinc-100/90 p-1 dark:bg-white/5">
        {(
          [
            { key: "journal", label: `Reflections (${reflections.length})`, icon: Quote },
            { key: "favorites", label: `Favorites (${favoriteQuotes.length})`, icon: Heart },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="journal-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "journal" ? "Search your reflections..." : "Search saved quotes..."}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </div>
        {tab === "journal" && (
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setThemeFilter(themeFilter === t ? "All" : t)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
                  themeFilter === t
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
            {themes.length > 1 && (
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value as MoodTag | "All")}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <option value="All">All moods</option>
                {MOOD_TAGS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "journal" ? (
        filteredReflections.length === 0 ? (
          <EmptyState
            title={reflections.length === 0 ? "No reflections yet" : "Nothing matches"}
            subtitle={
              reflections.length === 0
                ? "Head to the Daily Spark tab, write your thoughts, and your journal will grow here."
                : "Try clearing your search or filters."
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredReflections.map((r, i) => {
              const colors = THEME_COLORS[r.theme];
              return (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                  className={`rounded-3xl border border-white/60 bg-gradient-to-br ${colors.soft} p-5 shadow-sm dark:border-white/10 sm:p-6`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${colors.chip}`}>{r.theme}</span>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                        {r.dateStr}
                      </span>
                      {r.moodTag && (
                        <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-bold text-pink-700 dark:bg-pink-500/15 dark:text-pink-300">
                          {r.moodTag}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteReflection(r.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 text-zinc-400 transition hover:bg-rose-500 hover:text-white active:scale-[0.95] dark:bg-white/10 dark:text-zinc-500"
                      aria-label="Delete reflection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-semibold italic text-zinc-700 dark:text-zinc-200">
                    "{r.quoteText}"
                    <span className="ml-1 not-italic text-xs font-bold text-zinc-400 dark:text-zinc-500">- {r.quoteAuthor}</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{r.prompt}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">{r.userResponse}</p>
                </motion.article>
              );
            })}
          </div>
        )
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          title="No favorite quotes yet"
          subtitle="Tap the heart on any quote in the Daily Spark or Explore tabs to save it here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredFavorites.map((fq, i) => {
            const colors = THEME_COLORS[fq.theme];
            return (
              <motion.article
                key={fq.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                className={`rounded-3xl border border-white/60 bg-gradient-to-br ${colors.soft} p-5 shadow-sm dark:border-white/10`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${colors.chip}`}>{fq.theme}</span>
                  <div className="flex gap-1">
                    {fq.isCustom && (
                      <span className="flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold text-indigo-500 dark:bg-white/10 dark:text-indigo-300">
                        <Pencil className="h-3 w-3" /> Yours
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(fq.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/70 text-rose-500 transition hover:bg-rose-500 hover:text-white active:scale-[0.95] dark:bg-white/10"
                      aria-label="Unfavorite"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-800 dark:text-zinc-100">"{fq.quote}"</p>
                <p className="mt-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">- {fq.author}</p>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
      <span className="grid h-14 w-14 place-items-center rounded-3xl bg-indigo-100 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
        <Bookmark className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-bold text-zinc-800 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  );
}

// Re-export X icon usage hint to avoid unused import lint noise
export type { ThemeCategory };