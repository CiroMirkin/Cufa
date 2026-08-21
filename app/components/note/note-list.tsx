import { useSubjectsStore } from "@/stores/subjectsStore"
import { View } from "react-native"
import NoteItem from "./note-item"
import { Note } from "@/types/note"

interface Props {
  withoutSubjectFirst?: boolean
  showSubjectName?: boolean
  notes: Note[]
}

export default function NoteList({ notes, withoutSubjectFirst = false, showSubjectName = false, }: Props) {
  const subjects = useSubjectsStore((s) => s.subjects)

  if (!notes || !notes.length) return;

  const sortedNotes = withoutSubjectFirst
    ? [...notes].sort((a, b) => Number(!!a.subjectId) - Number(!!b.subjectId))
    : notes

  return (
    <View className="w-full flex-col gap-2 pt-4">
      {sortedNotes.map((item, index) => {
        const subjectName = subjects.find((s) => s.id === item.subjectId)?.name
        return (
          <NoteItem
            key={index}
            note={item}
            subjectName={ showSubjectName ? subjectName : undefined }
          />
        )
      })}
    </View>
  )
}
