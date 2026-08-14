import { useEffect, useState } from "react"
import { Stack, router, useLocalSearchParams } from "expo-router"
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useNotesStore } from "@/stores/notesStore"

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const notes = useNotesStore((s) => s.notes)
    const updateNote = useNotesStore((s) => s.updateNote)
    const deleteNote = useNotesStore((s) => s.deleteNote)

    const note = notes.find((n) => n.id === id)
    const [content, setContent] = useState(note?.content ?? "")

    useEffect(() => {
        if (note) {
            setContent(note.content)
        }
    }, [note])

    if (!note) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-neutral-400">Nota no encontrada "{id}".</Text>
            </View>
        )
    }

    const handleSave = async () => {
        await updateNote(note.id, { content })
    }

    const handleDelete = async () => {
        await deleteNote(note.id)
        router.back()
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Nota" }} />

            <View className="w-[90%] self-center gap-2 pt-4">
                <View className="flex flex-row gap-2 justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        Volver
                    </TouchableOpacity>
                    <View className="flex flex-row gap-2">
                        <TouchableOpacity
                            className="rounded-lg bg-neutral-800 py-3 px-2"
                            onPress={handleSave}
                        >
                            <Text className="font-semibold text-white">Guardar cambios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="rounded-lg border border-red-500 py-3 px-2"
                            onPress={handleDelete}
                        >
                            <Text className="font-semibold text-red-500">Eliminar</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="..."
                    multiline
                    textAlignVertical="top"
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800"
                    style={{ minHeight: 150 }}
                />
            </View>
        </ScrollView>
    )
}
