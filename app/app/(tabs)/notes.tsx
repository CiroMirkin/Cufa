import NoteInput from "@/components/note/note-input"
import { Pressable, Text, View } from "react-native"
import { Note } from "@/types/note"
import { useEffect, useState } from "react"
import NoteList from "@/components/note/note-list"
import { getNotes, saveNotes } from "@/lib/storage"

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([])
    const [notesInputVisible, setNotesInputVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getNotes().then((stored) => {
            setNotes(stored)
            setLoading(false)
        })
    }, [])

    const addNote = (note: Note) => {
        setNotes((prev) => {
            const updated = [note, ...prev]
            saveNotes(updated)
            return updated
        })
        setNotesInputVisible(false)
    }

    const deleteNote = (index: number) => {
        setNotes((prev) => {
            const updated = prev.filter((_, i) => i !== index)
            saveNotes(updated)
            return updated
        })
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
                <NoteInput onAdd={addNote} />
            )}
            <NoteList notes={notes} onDelete={deleteNote} />
        </View>
    )
}
