import type { Badge, MoodTag, Quote, ThemeCategory } from "../types";

export const THEME_COLORS: Record<ThemeCategory, { dot: string; chip: string; soft: string; text: string; ring: string; grad: string }> = {
  Resilience: {
    dot: "bg-rose-500",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    soft: "from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/5",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/40",
    grad: "from-rose-500 to-orange-500",
  },
  Curiosity: {
    dot: "bg-sky-500",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    soft: "from-sky-50 to-indigo-50 dark:from-sky-500/10 dark:to-indigo-500/5",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-500/40",
    grad: "from-sky-500 to-cyan-400",
  },
  Empathy: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    soft: "from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/40",
    grad: "from-emerald-500 to-teal-400",
  },
  "Critical Thinking": {
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    soft: "from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/5",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/40",
    grad: "from-violet-500 to-fuchsia-500",
  },
  "Self-Discovery": {
    dot: "bg-pink-500",
    chip: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
    soft: "from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/5",
    text: "text-pink-600 dark:text-pink-400",
    ring: "ring-pink-500/40",
    grad: "from-pink-500 to-rose-400",
  },
};

export const MOOD_TAGS: MoodTag[] = ["Energized", "Thoughtful", "Challenged", "Grateful", "Determined"];

export const ALL_THEMES: ThemeCategory[] = ["Resilience", "Curiosity", "Empathy", "Critical Thinking", "Self-Discovery"];

export interface BadgeMeta extends Badge {
  emoji: string;
}

export const BADGES: BadgeMeta[] = [
  { id: "first-spark", name: "First Spark", description: "Reflect for the first time.", icon: "first-spark", emoji: "⚡" },
  { id: "three-day", name: "3-Day Fire", description: "Reflect 3 days in a row.", icon: "three-day", emoji: "🔥" },
  { id: "week-warrior", name: "Week Warrior", description: "Keep a 7-day streak going.", icon: "week-warrior", emoji: "🏆" },
  { id: "critical-thinker", name: "Critical Thinker", description: "Reflect on 5 Critical Thinking quotes.", icon: "critical-thinker", emoji: "🧠" },
  { id: "empath", name: "Empath", description: "Reflect on 5 Empathy quotes.", icon: "empath", emoji: "💛" },
  { id: "explorer", name: "Explorer", description: "Reflect on quotes from 4 different themes.", icon: "explorer", emoji: "🧭" },
  { id: "fifteen-club", name: "15 Reflections Club", description: "Hit 15 journal entries.", icon: "fifteen-club", emoji: "🌟" },
];

function q(
  id: string,
  quote: string,
  author: string,
  theme: ThemeCategory,
  reflectionPrompt: string,
  actionChallenge?: string,
  authorBio?: string
): Quote {
  return { id, quote, author, theme, reflectionPrompt, actionChallenge, authorBio, isCustom: false };
}

export const QUOTES: Quote[] = [
  q(
    "rsl-1",
    "The moment you doubt whether you can fly, you cease forever to be able to do it.",
    "J.M. Barrie",
    "Resilience",
    "Think of something you told yourself you could not do. What is one small step you could still take toward it today?",
    "Do one brave thing your fear says you should skip.",
    "Scottish novelist and playwright, creator of Peter Pan."
  ),
  q(
    "rsl-2",
    "It always seems impossible until it is done.",
    "Nelson Mandela",
    "Resilience",
    "Describe a challenge that felt impossible at first. What made it possible in the end?",
    "Try one task you have been calling impossible.",
    "South African anti-apartheid leader and president."
  ),
  q(
    "rsl-3",
    "Be proud of your scars. They show that you survived things meant to break you.",
    "Unknown",
    "Resilience",
    "What is a past difficulty you now see as proof of your strength?",
    "Compliment yourself for one hard thing you survived.",
    ""
  ),
  q(
    "rsl-4",
    "A river cuts through rock, not because of its power, but because of its persistence.",
    "James N. Watkins",
    "Resilience",
    "Where in your life could a little more persistence make the biggest difference?",
    "Repeat one task daily for the next 3 days, no matter how small.",
    ""
  ),
  q(
    "rsl-5",
    "Our greatest glory is not in never falling, but in rising every time we fall.",
    "Confucius",
    "Resilience",
    "Recall a recent setback. What did you learn from getting back up?",
    "Share one lesson from a mistake with someone close.",
    "Ancient Chinese philosopher and teacher."
  ),
  q(
    "crr-1",
    "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    "Albert Einstein",
    "Curiosity",
    "What is one question you have always wanted an answer to? How could you find out?",
    "Look up the answer to one question you have about the world.",
    "Theoretical physicist who reshaped modern science."
  ),
  q(
    "crr-2",
    "Curiosity is the wick in the candle of learning.",
    "William Arthur Ward",
    "Curiosity",
    "Where does your natural curiosity pull you most: science, people, art, or ideas?",
    "Spend 10 minutes learning something with no test at the end.",
    "American author of inspirational essays."
  ),
  q(
    "crr-3",
    "I have no special talent. I am only passionately curious.",
    "Albert Einstein",
    "Curiosity",
    "What subject makes you lose track of time? What question would you ask an expert in it?",
    "Write down 3 questions about a topic you love.",
    "Theoretical physicist and Nobel laureate."
  ),
  q(
    "crr-4",
    "The important thing is to never stop asking.",
    "Marie Curie",
    "Curiosity",
    "Ask yourself: what assumption have I been making without checking?",
    "Fact-check one thing you heard recently.",
    "Pioneering physicist and chemist, first person to win two Nobel Prizes."
  ),
  q(
    "crr-5",
    "The mind is not a vessel to be filled, but a fire to be kindled.",
    "Plutarch",
    "Curiosity",
    "Compared to a fire, what currently fans your inner flame, and what smothers it?",
    "Do one activity today purely because it intrigues you.",
    "Greek biographer and essayist."
  ),
  q(
    "emp-1",
    "You never really understand a person until you consider things from his point of view.",
    "Harper Lee",
    "Empathy",
    "Think of someone you disagree with. What might their perspective look like from the inside?",
    "Ask one person to tell you how they felt today, and just listen.",
    "Author of To Kill a Mockingbird."
  ),
  q(
    "emp-2",
    "Empathy is seeing with the eyes of another, listening with the ears of another, and feeling with the heart of another.",
    "Alfred Adler",
    "Empathy",
    "When was the last time someone really listened to you? How did it feel?",
    "Listen to a friend with your full attention for 5 minutes.",
    "Austrian psychotherapist and founder of individual psychology."
  ),
  q(
    "emp-3",
    "Too often we underestimate the power of a touch, a smile, a kind word.",
    "Leo Buscaglia",
    "Empathy",
    "Who could use a kind word right now? What could you say that would lift them up?",
    "Send one encouraging message to someone today.",
    "American author and professor of love and human connection."
  ),
  q(
    "emp-4",
    "If you see someone without a smile, give them yours.",
    "Dolly Parton",
    "Empathy",
    "What small act of kindness changed your day recently? How could you pass it on?",
    "Perform one anonymous act of kindness today.",
    "American singer-songwriter and philanthropist."
  ),
  q(
    "emp-5",
    "There is no exercise better for the heart than reaching down and lifting people up.",
    "John Holmes",
    "Empathy",
    "Who in your circle could use support right now, and what would helping them look like?",
    "Offer a genuine compliment to someone unexpected.",
    ""
  ),
  q(
    "cth-1",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    "Aristotle",
    "Critical Thinking",
    "Take an opinion you disagree with. Can you argue its strongest version fairly?",
    "Write one paragraph arguing the opposite of your own view.",
    "Ancient Greek philosopher and student of Plato."
  ),
  q(
    "cth-2",
    "The first principle is that you must not fool yourself, and you are the easiest person to fool.",
    "Richard Feynman",
    "Critical Thinking",
    "What is something you believe simply because it is convenient? How would you test it?",
    "Find one piece of evidence that challenges a belief you hold.",
    "American physicist famous for brilliant, playful explanations of science."
  ),
  q(
    "cth-3",
    "Question everything. Learn something. Answer nothing.",
    "Euripides",
    "Critical Thinking",
    "What do you currently accept without question? Why do you accept it?",
    "Challenge one everyday assumption out loud today.",
    "Ancient Greek tragedian."
  ),
  q(
    "cth-4",
    "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function.",
    "F. Scott Fitzgerald",
    "Critical Thinking",
    "Name two ideas that both feel true, even though they seem to clash. How can both be true?",
    "List the pros of an idea you normally reject.",
    "American novelist, author of The Great Gatsby."
  ),
  q(
    "cth-5",
    "An investment in knowledge pays the best interest.",
    "Benjamin Franklin",
    "Critical Thinking",
    "Where would an hour of focused learning pay you back the most this month?",
    "Spend 20 minutes learning something new today.",
    "American founding father, inventor and writer."
  ),
  q(
    "sdf-1",
    "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    "Jane Goodall",
    "Self-Discovery",
    "What kind of difference do you want to make in your world? What does that say about you?",
    "Write down 3 values that matter most to you.",
    "Primatologist and conservationist."
  ),
  q(
    "sdf-2",
    "The only person you are destined to become is the person you decide to be.",
    "Ralph Waldo Emerson",
    "Self-Discovery",
    "Who is the person you are deciding to become right now? What habit is shaping them?",
    "Name one identity you want to grow into, and act like them today.",
    "American essayist and transcendentalist."
  ),
  q(
    "sdf-3",
    "Know yourself better than anyone else ever could. That is the key to a mind of your own.",
    "MindSpark",
    "Self-Discovery",
    "What do you know about yourself that most people would never guess?",
    "Write a short bio of yourself as a hero of your own story.",
    ""
  ),
  q(
    "sdf-4",
    "To know what you know and what you do not know, that is true knowledge.",
    "Confucius",
    "Self-Discovery",
    "List one thing you know well and one thing you know you do not know. Which grows faster?",
    "Ask someone to teach you a tiny skill they have.",
    "Ancient Chinese philosopher and teacher."
  ),
  q(
    "sdf-5",
    "Your time is limited, so do not waste it living someone else's life.",
    "Steve Jobs",
    "Self-Discovery",
    "Where might you be living out someone else's expectations instead of your own?",
    "Say no to one thing that does not align with your goals.",
    "Co-founder of Apple."
  ),
  q(
    "rsl-6",
    "Courage does not always roar. Sometimes courage is the quiet voice at the end of the day saying, I will try again tomorrow.",
    "Mary Anne Radmacher",
    "Resilience",
    "When has quiet courage shown up in your day, without anyone noticing?",
    "Say 'I will try again tomorrow' to yourself tonight and mean it.",
    "American author and artist."
  ),
  q(
    "crr-6",
    "Somewhere, something incredible is waiting to be known.",
    "Carl Sagan",
    "Curiosity",
    "What incredible thing do you suspect is out there, waiting for you to learn it?",
    "Search for one surprising fact about the universe today.",
    "American astronomer and science communicator."
  ),
  q(
    "emp-6",
    "Be kind, for everyone you meet is fighting a battle you know nothing about.",
    "Ian MacLaren",
    "Empathy",
    "Based on this idea, how might your interpretation of a difficult classmate change?",
    "Assume good intent in your next interaction with someone tough.",
    "Scottish minister and writer."
  ),
  q(
    "cth-6",
    "If you do not want a man unhappy politically, do not give him two sides of a question to worry him; give him one. Better yet, give him none.",
    "Harper Lee",
    "Critical Thinking",
    "Where do you get only one side of a story? What is the other side you are missing?",
    "Seek out an opinion that challenges your own today.",
    "Author of To Kill a Mockingbird."
  ),
  q(
    "sdf-6",
    "Dream big and dare to fail.",
    "Norman Vaughan",
    "Self-Discovery",
    "What big dream feels too risky to try? What would you attempt if failure was just data?",
    "Try one small version of a big dream this week.",
    "American explorer who accompanied Admiral Byrd to Antarctica."
  ),
];

export const HELPERS: Record<string, string[]> = {
  moodNote: [
    "Notice how your body feels as you read this quote. No judgment, just noticing.",
    "Breathe in for 4 counts, out for 4 counts. Re-read the quote slowly.",
  ],
};