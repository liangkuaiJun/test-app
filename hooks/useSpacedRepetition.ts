import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Word = {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  example: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
};

export type WordProgress = {
  score: number;
  nextReview: number;
};

const STORAGE_KEY = 'jp_vocab_progress_v1';

const gradeSteps: Record<'again' | 'hard' | 'good' | 'easy', { step: number; hours: number }> = {
  again: { step: 0, hours: 0.1 },
  hard: { step: 1, hours: 6 },
  good: { step: 2, hours: 18 },
  easy: { step: 3, hours: 36 },
};

export function useSpacedRepetition(words: Word[]) {
  const [progress, setProgress] = useState<Record<string, WordProgress>>({});
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          setProgress(JSON.parse(value));
        }
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [isReady, progress]);

  const allProgress = useMemo(() => {
    const merged: Record<string, WordProgress> = {};
    words.forEach((word) => {
      merged[word.id] = progress[word.id] ?? { score: 0, nextReview: 0 };
    });
    return merged;
  }, [progress, words]);

  const dueWords = useMemo(() => {
    const now = Date.now();
    return words
      .map((word) => ({ word, progress: allProgress[word.id] }))
      .filter(({ progress }) => (progress?.nextReview ?? 0) <= now)
      .sort((a, b) => (a.progress?.nextReview ?? 0) - (b.progress?.nextReview ?? 0));
  }, [allProgress, words]);

  const currentWord = dueWords[0]?.word ?? null;

  const gradeCard = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;
    const now = Date.now();
    const { step, hours } = gradeSteps[grade];
    setProgress((prev) => ({
      ...prev,
      [currentWord.id]: {
        score: step,
        nextReview: now + hours * 60 * 60 * 1000,
      },
    }));
  };

  return {
    currentWord,
    gradeCard,
    dueCount: dueWords.length,
    allProgress,
  };
}
