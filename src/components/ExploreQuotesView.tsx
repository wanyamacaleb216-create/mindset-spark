import { AnimatePresence, motion } from "framer-motion";
import { Heart, Lightbulb, Pencil, Plus, Quote, Search, Sparkles, Target, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ALL_THEMES, THEME_COLORS } from "../data/quotesData";
import { useMindSpark } from "../hooks/useMindSpark";
import type { Quote as QuoteType, ThemeCategory } from "../types";

export default function ExploreQuotesView() {
  const {
    allQuotes,
    isFavorite,
    toggleFavorite,
    addCustomQuote,
    deleteCustomQuote,
  } = useMindSpark();
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<ThemeCategory | "All">("All");
  const [selected, setSelected] = useState<QuoteType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allQuotes.filter((quote) => {
      if (themeFilter !== "All" && quote.theme !== themeFilter) return false;
      if (q && !`${quote.quote} ${quote.author} ${quote.theme}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allQuotes, search, themeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
            {allQuotes.length} quotes and growing
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Explore the quote library
          </h1>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.98]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          Add your own quote
        </button>
      </div>

      <AnimatePresence>
        {showForm && <CustomQuoteForm onCancel={() => setShowForm(false)} onSubmit={addCustomQuote} />}
      </AnimatePresence>

      {/* Search + theme filter */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by keyword, author, or theme..."
          className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
        />
      </div>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {(["All", ...ALL_THEMES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setThemeFilter(themeFilter === t ? "All" : t)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
              themeFilter === t
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            {t !== "All" && <span className={`h-2 w-2 rounded-full ${THEME_COLORS[t as ThemeCategory].dot}`} />}
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-indigo-100 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Quote className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-base font-bold text-zinc-800 dark:text-white">No quotes found</h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Try a different keyword, or add your own quote below and it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quote, i) => {
            const colors = THEME_COLORS[quote.theme];
            const fav = isFavorite(quote.id);
            return (
              <motion.button
                key={quote.id}
                layout
                onClick={() => setSelected(quote)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                className={`group relative flex flex-col rounded-3xl bg-gradient-to-br ${colors.soft} p-5 text-left shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 ${colors.ring}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${colors.chip}`}>{quote.theme}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(quote.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(quote.id);
                      }
                    }}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition active:scale-[0.92] ${
                      fav
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                        : "bg-white/70 text-zinc-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-rose-500 dark:bg-white/10 dark:text-zinc-500"
                    }`}
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-4 w-4 ${fav ? "fill-white" : ""}`} />
                  </span>
                </div>
                <p className="mt-3 line-clamp-4 text-sm font-semibold leading-relaxed text-zinc-800 dark:text-zinc-100">
                  "{quote.quote}"
                </p>
                <p className="mt-3 text-xs font-bold text-zinc-500 dark:text-zinc-400">- {quote.author}</p>
                <span className={`mt-auto pt-4 text-[11px] font-bold ${colors.text}`}>
                  {quote.isCustom ? "Reflect & explore your own words" : "Tap to reflect"} →
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Detail sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-gradient-to-br ${THEME_COLORS[selected.theme].soft} p-6 shadow-2xl sm:p-8`}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-zinc-500 transition hover:bg-white active:scale-[0.95] dark:bg-white/10 dark:text-zinc-300"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${THEME_COLORS[selected.theme].chip}`}>
                {selected.theme}
              </span>
              <p className="mt-4 text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
                "{selected.quote}"
              </p>
              <p className="mt-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                - {selected.author}
                {selected.authorBio && (
                  <span className="ml-2 text-xs font-normal text-zinc-400 dark:text-zinc-500">({selected.authorBio})</span>
                )}
              </p>
              <div className="mt-6 rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  <Lightbulb className="h-4 w-4" /> Reflection prompt
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{selected.reflectionPrompt}</p>
                {selected.actionChallenge && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {selected.actionChallenge}
                  </p>
                )}
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => toggleFavorite(selected.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                    isFavorite(selected.id)
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "bg-white/80 text-rose-500 shadow-sm dark:bg-white/10"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(selected.id) ? "fill-white" : ""}`} /> Save quote
                </button>
                {selected.isCustom && (
                  <button
                    onClick={() => {
                      deleteCustomQuote(selected.id);
                      setSelected(null);
                    }}
                    className="grid w-12 place-items-center rounded-2xl bg-white/80 text-zinc-400 shadow-sm transition hover:bg-rose-500 hover:text-white dark:bg-white/10"
                    aria-label="Delete custom quote"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomQuoteForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: { quote: string; author: string; theme: ThemeCategory; reflectionPrompt: string; actionChallenge?: string }) => void;
  onCancel: () => void;
}) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [theme, setTheme] = useState<ThemeCategory>("Self-Discovery");
  const [prompt, setPrompt] = useState("");
  const [challenge, setChallenge] = useState("");

  const valid = quote.trim().length >= 8 && prompt.trim().length >= 8;

  const submit = () => {
    if (!valid) return;
    onSubmit({
      quote: quote.trim(),
      author: author.trim() || "You",
      theme,
      reflectionPrompt: prompt.trim(),
      actionChallenge: challenge.trim() || undefined,
    });
    setQuote("");
    setAuthor("");
    setPrompt("");
    setChallenge("");
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="rounded-3xl border border-indigo-200 bg-white/90 p-6 shadow-lg shadow-indigo-500/10 dark:border-indigo-500/30 dark:bg-zinc-900/80">
        <p className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
          <Sparkles className="h-5 w-5 text-indigo-500" /> Create your own quote
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Save a quote you love, or write an original one to spark your own thinking.
        </p>
        <div className="mt-4 space-y-3">
          <input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="The quote you want to remember..."
            maxLength={300}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author (optional)"
              maxLength={60}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeCategory)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            >
              {ALL_THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Reflection question to accompany the quote..."
            maxLength={240}
            rows={2}
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
          <input
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Action challenge (optional, e.g. 'Try one brave thing today')"
            maxLength={140}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={submit}
            disabled={!valid}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition active:scale-[0.98] ${
              valid
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30 hover:brightness-110"
                : "cursor-not-allowed bg-zinc-300 shadow-none dark:bg-zinc-700"
            }`}
          >
            <Pencil className="h-4 w-4" /> Save quote
          </button>
          <button
            onClick={onCancel}
            className="rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}