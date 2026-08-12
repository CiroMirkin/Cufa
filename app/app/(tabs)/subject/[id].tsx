import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import NoteInput from "@/components/note/note-input"
import NoteList from "@/components/note/note-list"
import { Note } from "@/types/note"
import { useNotes } from "@/hooks/useNotes"

const DEFAULT_CAREER_ID = "default"

export default function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { notes, addNote, deleteNote } = useNotes(id, DEFAULT_CAREER_ID)

    const handleAdd = (note: Note) => {
        addNote(note.content)
    }

    const handleDelete = (index: number) => {
        const note = notes[index]
        if (!note) return
        deleteNote(note.id)
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Notas" }} />
            <NoteInput onAdd={handleAdd} />
            <NoteList notes={notes} onDelete={handleDelete} />
        </View>
    )
}
