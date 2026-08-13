import { useCareer } from "@/hooks/useCareer"
import { useNotes } from "@/hooks/useNotes"
import { useSubjects } from "@/hooks/useSubject"
import { Note } from "@/types/note"
import { Pressable, Text, View } from "react-native"

interface Props {
    note: Note
}

export default function NoteItem({ note }: Props) {
    const { career } = useCareer()
    const { getSubject } = useSubjects(career.id)
    const { deleteNote } = useNotes(note.subjectId, career.id)
    const subjectName = getSubject(note.subjectId) || ""

    return (
        <View className="flex-row items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
            <View className="flex-1 gap-1">
                {!subjectName && (
                    <Text className="mb-2 rounded border px-1 text-xs text-neutral-800">
                        { subjectName }
                    </Text>
                )}
                <Text className="text-sm text-neutral-800">{note.content}</Text>
                <Text className="text-xs text-neutral-400">
                    {new Date(note.createdAt).toLocaleString()}
                </Text>
            </View>
            
            <Pressable
                onPress={() => deleteNote(note.id)}
                hitSlop={8}
                className="p-1.5"
            >
                <Text className="text-red-500">Eliminar</Text>
            </Pressable>
        </View>
    )
}
