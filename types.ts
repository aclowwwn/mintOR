
export type AnswerType = 'numeric' | 'multiple_choice' | 'string';
export type Locale = 'ro' | 'en';

export interface Hint {
  id: string;
  text: string;
  image?: string;
}

export interface ExerciseAnswer {
  type: AnswerType;
  value?: number | string;
  tolerance?: number;
  choices?: { id: string; text: string }[];
  correctChoiceId?: string;
  caseSensitive?: boolean;
  trim?: boolean;
}

export interface Exercise {
  id: string;
  prompt: {
    text: string;
    images?: string[];
  };
  answer: ExerciseAnswer;
  hints: Hint[];
  solution?: {
    text: string;
  };
  meta?: {
    difficulty: number;
    estimatedSeconds?: number;
    sourceRef?: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: number;
  order: number;
  exercises: Exercise[];
}

export interface Pack {
  id: string;
  title: string;
  source?: {
    type: string;
    name: string;
    edition?: string;
    pages?: string;
  };
  createdAt: string;
}

export interface ChapterPack {
  schemaVersion: number;
  pack: Pack;
  chapters: Chapter[];
}

export interface Attempt {
  attemptId: string;
  timestamp: string;
  input: string;
  isCorrect: boolean;
}

export interface ExerciseProgress {
  status: 'not_started' | 'in_progress' | 'solved' | 'solved_with_hints';
  attempts: Attempt[];
  hintsRevealed: string[];
  firstSolvedAt?: string;
}

export interface ChapterProgress {
  exerciseProgress: Record<string, ExerciseProgress>;
}

export interface UserProgressRoot {
  schemaVersion: number;
  updatedAt: string;
  chapters: Record<string, ChapterProgress>;
}

export interface AppSettings {
  validationStrictness: 'loose' | 'strict';
  accessibilityFontSize: 'normal' | 'large';
  autoUnlockHints: boolean;
  locale: Locale;
}

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  normalizedUserInput?: string;
}
