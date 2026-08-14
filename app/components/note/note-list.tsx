import { useCareer } from "@/hooks/useCareer"
import { useNotes } from "@/hooks/useNotes"
import { FlatList, Text, View } from "react-native"
import NoteItem from "./note-item"
import { useSubjects } from "@/hooks/useSubject"

interface Props {
  subjectId: string | null
  withoutSubjectFirst?: boolean
}

export default function NoteList({ subjectId, withoutSubjectFirst = false }: Props) {
  const { career } = useCareer()
  const { getSubject } = useSubjects(career.id)
  const { notes, loading } = useNotes(subjectId, career.id)

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-neutral-400">Cargando...</Text>
      </View>
    )
  }

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
        <NoteItem
          note={item}
          subjectName={getSubject(item.subjectId)?.name}
        />
      )}
    />
  )
}
