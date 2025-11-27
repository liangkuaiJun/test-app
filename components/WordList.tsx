import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Word, WordProgress } from '../hooks/useSpacedRepetition';

export function WordList({ words, progress }: { words: Word[]; progress: Record<string, WordProgress> }) {
  return (
    <FlatList
      data={words}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <WordRow word={item} progress={progress[item.id]} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

function WordRow({ word, progress }: { word: Word; progress?: WordProgress }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTerm}>{word.term}</Text>
        <Text style={styles.rowReading}>{word.reading}</Text>
      </View>
      <Text style={styles.rowMeaning}>{word.meaning}</Text>
      <View style={styles.rowMeta}>
        <Text style={styles.metaBadge}>{word.jlpt}</Text>
        <Text style={styles.metaText}>SRS: {progress?.score ?? 0}</Text>
        <Text style={styles.metaText}>次回: {formatNextReview(progress?.nextReview)}</Text>
      </View>
    </View>
  );
}

function formatNextReview(timestamp?: number) {
  if (!timestamp) return '未設定';
  const diff = timestamp - Date.now();
  if (diff <= 0) return '今日';
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  return `${days}日後`;
}

const styles = StyleSheet.create({
  separator: {
    height: 12,
  },
  row: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTerm: {
    fontSize: 18,
    fontWeight: '700',
  },
  rowReading: {
    color: '#6b7280',
  },
  rowMeaning: {
    marginTop: 4,
    color: '#1f2937',
  },
  rowMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  metaBadge: {
    backgroundColor: '#bfdbfe',
    color: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: '700',
  },
  metaText: {
    color: '#4b5563',
    fontSize: 12,
  },
});
