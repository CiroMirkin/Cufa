import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import NoteInput from "@/components/note/note-input"
import NoteList from "@/components/note/note-list"
import { Note } from "@/types/note"
import { useNotes } from "@/hooks/useNotes"
import { useCareer } from "@/hooks/useCareer"

export default function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { career } = useCareer()
    const { notes, addNote, deleteNote } = useNotes(id, career.id)

    const handleAdd = (note: Note) => {
        if (!note) return
        addNote(note.content)
    }

    const handleDelete = (id: string) => {
        if (!id) return
        deleteNote(id)
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Notas" }} />
            <NoteInput onAdd={handleAdd} />
            <NoteList notes={notes} onDelete={handleDelete} />
        </View>
    )
}
