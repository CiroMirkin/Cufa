import NoteInput from "@/components/note/note-input"
import { Text, View } from "react-native"
import { Note } from "@/types/note"
import { useState } from "react"
import NoteList from "@/components/note/note-list"

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([])

    const addNote = (note: Note) => {
        setNotes((prev) => [note, ...prev])
    }

    const deleteNote = (index: number) => {
        setNotes((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <NoteInput onAdd={addNote} />
            <NoteList notes={notes} onDelete={deleteNote} />
        
        </View>
    )
}
