import { useNotesStore } from "@/stores/notesStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { FlatList, Text } from "react-native"
import NoteItem from "./note-item"
import { useShallow } from "zustand/react/shallow"

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
          subjectName={subjects.find((s) => s.id === item.subjectId)?.name}
        />
      )}
    />
  )
}
