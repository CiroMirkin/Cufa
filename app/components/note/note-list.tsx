import { useNotesStore } from "@/stores/notesStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { FlatList, Text, View } from "react-native"
import NoteItem from "./note-item"
import { useShallow } from "zustand/react/shallow"
import { icons } from "@/constants/icons"

interface Props {
  subjectId: string | null
  withoutSubjectFirst?: boolean
}

export default function NoteList({ subjectId, withoutSubjectFirst = false }: Props) {
  const subjects = useSubjectsStore((s) => s.subjects)
  const notes = useNotesStore(
    useShallow((s) =>
      subjectId === null ? s.notes : s.notes.filter((n) => n.subjectId === subjectId),
    )
  )

  if (!notes || notes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center opacity-50">
        <icons.library width={48} height={48} />
        <Text className="mt-2 text-lg font-semibold text-black">Aun no tenés notas</Text>
      </View>
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
          subjectName={subjects.find((s) => s.id === item.subjectId)?.name}
        />
      )}
    />
  )
}
