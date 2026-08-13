import { useCareer } from "@/hooks/useCareer"
import { useNotes } from "@/hooks/useNotes"
import { useSubjects } from "@/hooks/useSubject"
import { Note } from "@/types/note"
import { FlatList, Pressable, Text, View } from "react-native"

interface Props {
  subjectId: string | null
}

function NoteList({ subjectId }: Props) {
  const { career } = useCareer()
  const { getSubject } = useSubjects(career.id)
  const { notes, deleteNote } = useNotes(subjectId, career.id)
  
  if (!notes || notes.length === 0) {
    return (
      <Text className="px-4 pt-4 text-sm text-neutral-400">
        No hay notas todavia.
      </Text>
    )
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(_, index) => `${index}`}
      className="w-full"
      contentContainerClassName="gap-2 px-4 pt-4"
      renderItem={({ item }) => (
        <View className="flex-row items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
          <View className="flex-1 gap-1">
            { item.subjectId !== null && (
              <Text className="border rounded px-1 text-xs text-neutral-800 mb-2">
                { getSubject(item.subjectId)?.name }
              </Text>
            )}
            <Text className="text-sm text-neutral-800">{item.content}</Text>
            <Text className="text-xs text-neutral-400">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          <Pressable onPress={() => deleteNote(item.id)} hitSlop={8} className="p-1.5">
            <Text className="text-red-500">Eliminar</Text>
          </Pressable>
        </View>
      )}
    />
  )
}

export default NoteList
