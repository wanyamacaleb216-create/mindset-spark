import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import DailySparkView from "./components/DailySparkView";
import ExploreQuotesView from "./components/ExploreQuotesView";
import JournalView from "./components/JournalView";
import Navbar from "./components/Navbar";
import { useMindSpark } from "./hooks/useMindSpark";
import type { ViewKey } from "./types";

export default function App() {
  const { streak, theme, toggleTheme, exportJournal, copyMarkdown } = useMindSpark();

  // Deep-link via hash for shareable tabs (#daily | #journal | #explore)
  const view: ViewKey = (() => {
    const h = window.location.hash.replace("#", "");
    if (h === "journal" || h === "explore") return h as ViewKey;
    return "daily";
  })();

  useEffect(() => {
    const onHash = () => window.dispatchEvent(new Event("resize"));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Local-only data is wiped if the browser refuses storage — surface it.
  const storageOk = (() => {
    try {
      localStorage.setItem("__ms_check", "1");
      localStorage.removeItem("__ms_check");
      return true;
    } catch {
      return false;
    }
  })();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-white to-amber-50/60 text-zinc-900 transition-colors dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-600/15" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-28 sm:px-6">
        <Navbar view={view} onViewChange={(v) => { window.location.hash = v; }} streakCount={streak.currentStreak} theme={theme} onToggleTheme={toggleTheme} />

        <main className="mx-auto mt-8 w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {view === "daily" && <DailySparkView />}
              {view === "journal" && <JournalView />}
              {view === "explore" && <ExploreQuotesView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {!storageOk && (
          <div className="mx-auto mt-6 w-full max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            Your browser is blocking local storage, so your reflections can"t be saved while you browse. Export your journal often or try a different browser.
          </div>
        )}

        <footer className="mx-auto mt-12 w-full max-w-3xl border-t border-zinc-200/70 pt-6 text-center dark:border-white/10">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            <span className="font-bold text-indigo-500 dark:text-indigo-400">MindSpark</span> — all reflections stay on your device. No account, no tracking, just your thoughts.
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={copyMarkdown} className="text-xs font-bold text-zinc-500 underline-offset-2 hover:text-indigo-500 hover:underline dark:text-zinc-400">
              Copy journal summary
            </button>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <button onClick={exportJournal} className="text-xs font-bold text-zinc-500 underline-offset-2 hover:text-indigo-500 hover:underline dark:text-zinc-400">
              Export backup
            </button>
          </div>
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-3 z-40 px-4 sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/60 bg-white/85 px-2 py-2 shadow-xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
          {(
            [
              { key: "daily" as ViewKey, label: "Daily" },
              { key: "journal" as ViewKey, label: "Journal" },
              { key: "explore" as ViewKey, label: "Explore" },
            ]
          ).map((t) => {
            const active = view === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { window.location.hash = t.key; window.scrollTo({ top: 0 }); }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  active ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster position="top-center" richColors toastOptions={{ style: { borderRadius: "1rem", fontWeight: 600 } }} />
    </div>
  );
}