import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Note } from '@/types/note';
import NoteInput from '@/components/note/note-input';
import NoteList from '@/components/note/note-list';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const deleteNote = (index: number) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Notas
        </ThemedText>
        <NoteInput onAdd={addNote} />
        <NoteList notes={notes} onDelete={deleteNote} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  title: {
    marginBottom: 4,
  },
})
