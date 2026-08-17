import { useNotesStore } from "@/stores/notesStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { Text, View } from "react-native"
import NoteItem from "./note-item"
import { useShallow } from "zustand/react/shallow"
import { icons } from "@/constants/icons"
import { Note } from "@/types/note"

interface Props {
  subjectId: string | null
  withoutSubjectFirst?: boolean
  notes: Note[]
}

export default function NoteList({ subjectId, withoutSubjectFirst = false, notes }: Props) {
  const subjects = useSubjectsStore((s) => s.subjects)
  
  if(!notes || !notes.length) return;

  return (
    <View className="w-full flex-col gap-2 pt-4">
      {notes.map((item, index) => (
        <NoteItem
          key={index}
          note={item}
          subjectName={subjects.find((s) => s.id === item.subjectId)?.name}
        />
      ))}
    </View>
  )
}
