
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chapter, ChapterProgress, ExerciseProgress, UserProgressRoot, AppSettings, ChapterPack, Locale } from './types';
import { seedPack } from './utils/seedData';

interface AppState {
  chapters: Chapter[];
  progress: UserProgressRoot;
  settings: AppSettings;
  
  // Actions
  importPack: (pack: ChapterPack) => void;
  resetProgress: () => void;
  revealHint: (chapterId: string, exerciseId: string, hintId: string) => void;
  recordAttempt: (chapterId: string, exerciseId: string, input: string, isCorrect: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLocale: (locale: Locale) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  validationStrictness: 'loose',
  accessibilityFontSize: 'normal',
  autoUnlockHints: false,
  locale: 'ro'
};

const INITIAL_PROGRESS: UserProgressRoot = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  chapters: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      chapters: seedPack.chapters,
      progress: INITIAL_PROGRESS,
      settings: DEFAULT_SETTINGS,

      importPack: (pack) => {
        set((state) => {
          const newChapters = [...state.chapters];
          pack.chapters.forEach((chapter) => {
            const index = newChapters.findIndex((c) => c.id === chapter.id);
            if (index >= 0) {
              newChapters[index] = chapter;
            } else {
              newChapters.push(chapter);
            }
          });
          return { chapters: newChapters };
        });
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),

      revealHint: (chapterId, exerciseId, hintId) => {
        set((state) => {
          const progress = { ...state.progress };
          if (!progress.chapters[chapterId]) {
            progress.chapters[chapterId] = { exerciseProgress: {} };
          }
          const exProgress = progress.chapters[chapterId].exerciseProgress[exerciseId] || {
            status: 'not_started',
            attempts: [],
            hintsRevealed: [],
          };
          
          if (!exProgress.hintsRevealed.includes(hintId)) {
            exProgress.hintsRevealed = [...exProgress.hintsRevealed, hintId];
            if (exProgress.status === 'not_started') exProgress.status = 'in_progress';
          }

          progress.chapters[chapterId].exerciseProgress[exerciseId] = exProgress;
          progress.updatedAt = new Date().toISOString();
          return { progress };
        });
      },

      recordAttempt: (chapterId, exerciseId, input, isCorrect) => {
        set((state) => {
          const progress = { ...state.progress };
          if (!progress.chapters[chapterId]) {
            progress.chapters[chapterId] = { exerciseProgress: {} };
          }
          const exProgress = progress.chapters[chapterId].exerciseProgress[exerciseId] || {
            status: 'not_started',
            attempts: [],
            hintsRevealed: [],
          };

          const newAttempt = {
            attemptId: `att-${Date.now()}`,
            timestamp: new Date().toISOString(),
            input,
            isCorrect,
          };

          exProgress.attempts = [...exProgress.attempts, newAttempt];
          
          if (isCorrect) {
            const hasUsedHints = exProgress.hintsRevealed.length > 0;
            exProgress.status = hasUsedHints ? 'solved_with_hints' : 'solved';
            if (!exProgress.firstSolvedAt) {
              exProgress.firstSolvedAt = newAttempt.timestamp;
            }
          } else {
            exProgress.status = 'in_progress';
          }

          progress.chapters[chapterId].exerciseProgress[exerciseId] = exProgress;
          progress.updatedAt = new Date().toISOString();
          return { progress };
        });
      },

      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      setLocale: (locale) => set((state) => ({ settings: { ...state.settings, locale } })),
    }),
    {
      name: 'math-mentor-storage',
    }
  )
);
