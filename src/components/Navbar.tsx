import { motion } from "framer-motion";
import { BookOpen, Compass, Flame, Moon, Quote, Sun } from "lucide-react";
import type { ViewKey } from "../types";

const TABS: { key: ViewKey; label: string; icon: typeof Compass }[] = [
  { key: "daily", label: "Daily Spark", icon: Compass },
  { key: "journal", label: "My Journal", icon: BookOpen },
  { key: "explore", label: "Explore", icon: Quote },
];

export default function Navbar({
  view,
  onViewChange,
  streakCount,
  theme,
  onToggleTheme,
}: {
  view: ViewKey;
  onViewChange: (v: ViewKey) => void;
  streakCount: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-lg shadow-indigo-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
        <button
          onClick={() => onViewChange("daily")}
          className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 transition hover:bg-indigo-50 dark:hover:bg-white/5"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
            <Compass className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
              MindSpark
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
              think bold
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-1 rounded-xl bg-zinc-100/80 p-1 dark:bg-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                  active
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className={`relative h-4 w-4 ${active ? "" : "hidden sm:block"}`} strokeWidth={2.2} />
                <span className="relative hidden sm:block">{tab.label}</span>
                <span className="relative sm:hidden">{tab.key === "daily" ? "Spark" : tab.key === "journal" ? "Journal" : "Explore"}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            key={streakCount}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange("daily")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/30"
            title={`${streakCount} day streak`}
          >
            <Flame className="h-4 w-4 fill-white/30" strokeWidth={2.4} />
            {streakCount}
          </motion.button>
          <button
            onClick={onToggleTheme}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 active:scale-[0.98] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}