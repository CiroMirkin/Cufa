import NoteInput from "@/components/note/note-input"
import { Pressable, Text, View } from "react-native"
import { Note } from "@/types/note"
import { useState } from "react"
import NoteList from "@/components/note/note-list"
import { useNotes } from "@/hooks/useNotes"
import { useCareer } from "@/hooks/useCareer"

export default function Notes() {
    const { career } = useCareer()
    const { notes, addNote, loading, deleteNote } = useNotes(null, career.id)
    const [notesInputVisible, setNotesInputVisible] = useState(false)

    const handleAddNote = (note: Note) => {
        addNote(note.content)
        setNotesInputVisible(false)
    }

    const handleDeleteNote = (id: string) => {
        deleteNote(id)
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-neutral-400">Cargando...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 pt-4">
              <Text className="text-xl font-bold text-blue-500">Notas</Text>
              <Pressable
                onPress={() => setNotesInputVisible(true)}
                className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
              >
                <Text className="text-lg font-bold text-white">+</Text>
              </Pressable>
            </View>
            { notesInputVisible && (
                <NoteInput onAdd={handleAddNote} />
            )}
            <NoteList notes={notes} onDelete={handleDeleteNote} />
        </View>
    )
}
