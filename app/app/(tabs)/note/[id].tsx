import { Stack, router, useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"
import { useNotesStore } from "@/stores/notesStore"
import NoteInput from "@/components/note/note-input"

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const notes = useNotesStore((s) => s.notes)
    const note = notes.find((n) => n.id === id)

    if (!note) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-neutral-400">Nota no encontrada "{id}".</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Nota" }} />
            <NoteInput
                subjectId={note.subjectId}
                note={note}
                onDone={() => router.replace("/(tabs)/notes")}
            />
        </View>
    )
}