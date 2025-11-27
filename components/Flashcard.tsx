import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Word, WordProgress } from '../hooks/useSpacedRepetition';

export function Flashcard({
  word,
  onGrade,
  progress,
}: {
  word: Word;
  onGrade: (grade: 'again' | 'hard' | 'good' | 'easy') => void;
  progress?: WordProgress;
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.levelBadge}>{word.jlpt}</Text>
        <Text style={styles.progress}>SRS {progress?.score ?? 0} / 次回 {formatNextReview(progress?.nextReview)}</Text>
      </View>
      <Pressable onPress={() => setShowAnswer((prev) => !prev)} style={styles.termArea}>
        <Text style={styles.term}>{word.term}</Text>
        <Text style={styles.reading}>{word.reading}</Text>
      </Pressable>

      {showAnswer && (
        <View style={styles.answerBox}>
          <Text style={styles.meaning}>{word.meaning}</Text>
          <Text style={styles.exampleLabel}>例文</Text>
          <Text style={styles.example}>{word.example}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {(['again', 'hard', 'good', 'easy'] as const).map((grade) => (
          <Pressable key={grade} style={[styles.gradeButton, styles[`grade_${grade}`]]} onPress={() => onGrade(grade)}>
            <Text style={styles.gradeLabel}>{gradeLabel[grade]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const gradeLabel: Record<'again' | 'hard' | 'good' | 'easy', string> = {
  again: 'また',
  hard: '難しい',
  good: '普通',
  easy: '簡単',
};

function formatNextReview(timestamp?: number) {
  if (!timestamp) return '未設定';
  const diff = timestamp - Date.now();
  if (diff <= 0) return '今すぐ';
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}時間後`;
  const days = Math.round(hours / 24);
  return `${days}日後`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#f97316',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '700',
  },
  progress: {
    color: '#6b7280',
    fontSize: 12,
  },
  termArea: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  term: {
    fontSize: 32,
    fontWeight: '800',
  },
  reading: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  answerBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  meaning: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  exampleLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  example: {
    marginTop: 4,
    color: '#374151',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  grade_again: {
    backgroundColor: '#fee2e2',
  },
  grade_hard: {
    backgroundColor: '#fef3c7',
  },
  grade_good: {
    backgroundColor: '#dcfce7',
  },
  grade_easy: {
    backgroundColor: '#dbeafe',
  },
  gradeLabel: {
    fontWeight: '700',
    color: '#111827',
  },
});
