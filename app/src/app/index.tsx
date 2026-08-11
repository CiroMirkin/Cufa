import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

type Note = {
  content: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return date.toLocaleString();
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState('');

  const addNote = () => {
    const content = draft.trim();
    if (!content) return;
    setNotes(prev => [{ content, createdAt: new Date() }, ...prev]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Notas</Text>

        <View className="mt-4 gap-2">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribí una nota..."
            placeholderTextColor="#71717a"
            multiline
            className="min-h-[96px] rounded-xl border border-zinc-200 bg-zinc-100 p-3 text-base text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <Pressable
            onPress={addNote}
            disabled={!draft.trim()}
            className="items-center rounded-xl bg-zinc-900 py-3 disabled:opacity-40 dark:bg-zinc-100">
            <Text className="font-semibold text-zinc-100 dark:text-zinc-900">Agregar</Text>
          </Pressable>
        </View>

        <FlatList
          data={notes}
          keyExtractor={(item, index) => `${item.createdAt.getTime()}-${index}`}
          contentContainerClassName="py-4 gap-2"
          ListEmptyComponent={
            <Text className="mt-8 text-center text-zinc-400 dark:text-zinc-600">
              Todavía no hay notas.
            </Text>
          }
          renderItem={({ item }) => (
            <View className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <Text className="text-base text-zinc-900 dark:text-zinc-100">{item.content}</Text>
              <Text className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                {formatDate(item.createdAt)}
              </Text>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
