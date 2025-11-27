import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Flashcard } from './components/Flashcard';
import { WordList } from './components/WordList';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { words as seedWords } from './data/words';

export type StudyMode = 'flashcards' | 'list';

export default function App() {
  const [mode, setMode] = useState<StudyMode>('flashcards');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('all');
  const { currentWord, gradeCard, dueCount, allProgress } = useSpacedRepetition(seedWords);

  const filteredWords = useMemo(() => {
    if (selectedLevel === 'all') return seedWords;
    return seedWords.filter((word) => word.jlpt === selectedLevel);
  }, [selectedLevel]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>日本語単語トレーナー</Text>
        <Text style={styles.subtitle}>iOS / Android 向けのシンプルな単語暗記アプリ</Text>

        <View style={styles.modeSwitcher}>
          <ToggleButton label="フラッシュカード" active={mode === 'flashcards'} onPress={() => setMode('flashcards')} />
          <ToggleButton label="単語一覧" active={mode === 'list'} onPress={() => setMode('list')} />
        </View>

        {mode === 'flashcards' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本日覚えるカード {dueCount ? `(${dueCount}件)` : ''}</Text>
            {currentWord ? (
              <Flashcard word={currentWord} onGrade={gradeCard} progress={allProgress[currentWord.id]} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>本日分は完了しました！お疲れさまです。</Text>
              </View>
            )}
          </View>
        )}

        {mode === 'list' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>単語一覧</Text>
            <View style={styles.filterRow}>
              {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((level) => (
                <ToggleButton
                  key={level}
                  label={level === 'all' ? 'すべて' : level}
                  active={selectedLevel === level}
                  onPress={() => setSelectedLevel(level)}
                  small
                />
              ))}
            </View>
            <WordList words={filteredWords} progress={allProgress} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
  small,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toggleButton, active && styles.toggleButtonActive, small && styles.toggleButtonSmall]}>
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive, small && styles.toggleLabelSmall]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 16,
  },
  modeSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  toggleButtonSmall: {
    flex: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  toggleLabel: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#1f2937',
  },
  toggleLabelActive: {
    color: '#fff',
  },
  toggleLabelSmall: {
    fontSize: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    color: '#6b7280',
  },
});
