import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Copy,
  Flame,
  Heart,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { BADGES, MOOD_TAGS, THEME_COLORS } from "../data/quotesData";
import { useDateLabel, useMindSpark } from "../hooks/useMindSpark";
import type { MoodTag, ReflectionEntry } from "../types";

const CONFETTI_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#0ea5e9"];

function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    w: 6 + Math.random() * 6,
    h: 10 + Math.random() * 8,
    vy: 2 + Math.random() * 3.5,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));
  let frame = 0;
  const tick = () => {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vr;
      if (p.y < canvas.height + 30) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive && frame < 220) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

export default function DailySparkView() {
  const {
    dailyQuote,
    refreshDailyQuote,
    isFavorite,
    toggleFavorite,
    isReflectedToday,
    saveReflection,
    reflections,
    streak,
    weekDays,
    hasReflectedToday,
  } = useMindSpark();
  const reduced = useReducedMotion();
  const dateLabel = useDateLabel();
  const colors = THEME_COLORS[dailyQuote.theme];

  const [response, setResponse] = useState("");
  const [mood, setMood] = useState<MoodTag | undefined>();
  const [copied, setCopied] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const todayReflection: ReflectionEntry | undefined = useMemo(
    () => reflections.find((r) => r.quoteId === dailyQuote.id),
    [reflections, dailyQuote]
  );

  const wordCount = useMemo(() => response.trim().split(/\s+/).filter(Boolean).length, [response]);
  const canSave = response.trim().length > 8;

  const copyQuote = useCallback(async () => {
    await navigator.clipboard.writeText(`"${dailyQuote.quote}" - ${dailyQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [dailyQuote]);

  const handleSave = useCallback(() => {
    if (!canSave) return;
    saveReflection({
      quoteId: dailyQuote.id,
      quoteText: dailyQuote.quote,
      quoteAuthor: dailyQuote.author,
      theme: dailyQuote.theme,
      prompt: dailyQuote.reflectionPrompt,
      userResponse: response,
      moodTag: mood,
    });
    fireConfetti();
    setResponse("");
    setMood(undefined);
  }, [canSave, dailyQuote, mood, response, saveReflection]);

  const doneText = todayReflection?.userResponse ?? "";

  return (
    <div className="space-y-6">
      {/* Greeting row */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">{dateLabel}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Your spark for today
          </h1>
        </div>
        <button
          onClick={() => {
            setResponse("");
            setMood(undefined);
            setShowChallenge(false);
            refreshDailyQuote();
          }}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-indigo-500/40"
        >
          <RefreshCw className="h-4 w-4" /> Shuffle quote
        </button>
      </div>

      {/* Featured quote card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.grad} p-[1px] shadow-xl shadow-indigo-500/10`}
      >
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.soft} p-6 sm:p-8`}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/30 blur-3xl dark:bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/20" />

          <div className="relative flex items-start justify-between gap-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${colors.chip} ring-1 ${colors.ring}`}
            >
              <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
              {dailyQuote.theme}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyQuote}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-zinc-600 shadow-sm backdrop-blur transition hover:bg-white active:scale-[0.95] dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20"
                aria-label="Copy quote"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={() => toggleFavorite(dailyQuote.id)}
                className={`grid h-9 w-9 place-items-center rounded-xl shadow-sm backdrop-blur transition active:scale-[0.95] ${
                  isFavorite(dailyQuote.id)
                    ? "bg-rose-500 text-white"
                    : "bg-white/70 text-zinc-600 hover:bg-white dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20"
                }`}
                aria-label="Favorite quote"
              >
                <Heart className={`h-4 w-4 ${isFavorite(dailyQuote.id) ? "fill-white" : ""}`} />
              </button>
            </div>
          </div>

          <blockquote className="relative mt-5">
            <p className="text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-white sm:text-[2rem] sm:leading-[1.25]">
              {dailyQuote.quote}
            </p>
            <footer className="mt-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {dailyQuote.author}
              {dailyQuote.authorBio && (
                <span className="ml-2 hidden font-normal text-zinc-400 dark:text-zinc-500 sm:inline">- {dailyQuote.authorBio}</span>
              )}
            </footer>
          </blockquote>
        </div>
      </motion.section>

      {/* Reflection workspace */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, delay: 0.08, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {todayReflection ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:p-8"
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Today's reflection is saved</h2>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{doneText}</p>
              {todayReflection.moodTag && (
                <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Mood: {todayReflection.moodTag}
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="write"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-indigo-500/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 sm:p-8"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Reflect on this</h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{dailyQuote.reflectionPrompt}</p>
                </div>
              </div>

              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                maxLength={1200}
                placeholder="Write what comes to mind. There is no wrong answer here..."
                className="mt-5 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm leading-relaxed text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500/50 dark:focus:bg-white/10"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                <span>{response.trim().length} / 1200</span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">How are you feeling?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const active = mood === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setMood(active ? undefined : tag)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
                          active
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                            : "bg-zinc-100 text-zinc-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={!canSave}
                  onClick={handleSave}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-md transition ${
                    canSave
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30 hover:brightness-110"
                      : "cursor-not-allowed bg-zinc-300 shadow-none dark:bg-zinc-700"
                  }`}
                >
                  <Sparkles className="h-4 w-4" /> Save to My Journal
                </motion.button>
                <button
                  onClick={() => setShowChallenge((s) => !s)}
                  className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 active:scale-[0.98] dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                >
                  <Target className="h-4 w-4" /> Activity challenge
                </button>
              </div>

              <AnimatePresence>
                {showChallenge && dailyQuote.actionChallenge && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                      <strong>Bonus challenge: </strong>
                      {dailyQuote.actionChallenge}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Streak row */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, delay: 0.16, ease: "easeOut" }}
        className="grid gap-4 sm:grid-cols-5"
      >
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 sm:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Your streak</p>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Trophy className="h-3.5 w-3.5" /> {streak.sparkPoints} pts
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <motion.span
              key={streak.currentStreak}
              initial={{ scale: reduced ? 1 : 1.35 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="flex items-center gap-1 text-4xl font-black tracking-tight text-amber-500"
            >
              <Flame className="h-8 w-8 fill-amber-400/30" /> {streak.currentStreak}
            </motion.span>
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">days in a row</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Best streak: <span className="font-bold text-zinc-600 dark:text-zinc-300">{streak.longestStreak} days</span>
          </p>

          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekDays.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition ${
                    d.done
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30"
                      : "bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-zinc-600"
                  }`}
                  title={d.date}
                >
                  {d.done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-[10px]">{d.label.slice(0, 1)}</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 hidden justify-between text-[10px] font-semibold text-zinc-400 sm:flex">
            {weekDays.map((d) => (
              <span key={d.label} className="w-8 text-center">{d.label}</span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 sm:col-span-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Milestones unlocked</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BADGES.map((badge) => {
              const owned = streak.unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition ${
                    owned
                      ? "border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
                      : "border-zinc-100 bg-zinc-50 opacity-50 dark:border-white/5 dark:bg-white/5"
                  }`}
                  title={badge.description}
                >
                  <span className={`text-2xl ${owned ? "" : "grayscale"}`}>{badge.emoji}</span>
                  <span className="text-[10px] font-bold leading-tight text-zinc-600 dark:text-zinc-300">{badge.name}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            {hasReflectedToday ? "Spark points earned today. Come back tomorrow to keep the fire going." : "Reflect today to keep your streak and earn 10 spark points."}
          </p>
        </div>
      </motion.section>

      {!hasReflectedToday && (
        <button
          onClick={() => document.querySelector("textarea")?.focus()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 py-3 text-sm font-bold text-indigo-500 transition hover:bg-indigo-50 active:scale-[0.99] dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
        >
          <ArrowRight className="h-4 w-4" /> Jump to today's reflection
        </button>
      )}
    </div>
  );
}