export type ThemeCategory =
  | "Resilience"
  | "Curiosity"
  | "Empathy"
  | "Critical Thinking"
  | "Self-Discovery";

export type MoodTag = "Energized" | "Thoughtful" | "Challenged" | "Grateful" | "Determined";

export interface Quote {
  id: string;
  quote: string;
  author: string;
  authorBio?: string;
  theme: ThemeCategory;
  reflectionPrompt: string;
  actionChallenge?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface ReflectionEntry {
  id: string;
  quoteId: string;
  quoteText: string;
  quoteAuthor: string;
  theme: ThemeCategory;
  prompt: string;
  userResponse: string;
  moodTag?: MoodTag;
  dateStr: string; // YYYY-MM-DD
  timestamp: number;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  totalReflections: number;
  sparkPoints: number;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "first-spark" | "three-day" | "week-warrior" | "critical-thinker" | "empath" | "explorer" | "fifteen-club";
}

export type ViewKey = "daily" | "journal" | "explore";