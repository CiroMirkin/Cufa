import { useEffect, useState } from "react"
import { View, TextInput, TouchableOpacity, Text, Pressable } from "react-native"
import clsx from "clsx"
import { useCareerStore } from "@/stores/careerStore"
import { useNotesStore } from "@/stores/notesStore"
import { icons } from "@/constants/icons"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { Note } from "@/types/note"
import { usePathname, useSegments } from "expo-router"

interface Props {
  subjectId: string | null
  note?: Note
  onDone?: () => void
}

export default function NoteInput({ subjectId, note, onDone }: Props) {
  const career = useCareerStore((s) => s.career)
  const addNote = useNotesStore((s) => s.addNote)
  const updateNote = useNotesStore((s) => s.updateNote)
  const deleteNote = useNotesStore((s) => s.deleteNote)
  const subjects = useSubjectsStore((s) => s.subjects)

  const [content, setContent] = useState(note?.content ?? "")
  const [subject, setSubject] = useState(note?.subjectId ?? subjectId ?? "")

  const segments = useSegments() as string[]
  const isNoteRoute = segments.includes("note")
  const showSubjectSelect = isNoteRoute || !subjectId

  useEffect(() => {
    if (note) {
      setContent(note.content)
      setSubject(note.subjectId ?? "")
    }
  }, [note])

  const handleSubmit = async () => {
    if (!content.trim()) return

    if (note) {
      await updateNote(note.id, { subjectId: subject, content })
    } else {
      await addNote({ subjectId: subject, careerId: career.id, content })
      setContent("")
      setSubject("")
    }

    onDone?.()
  }

  const handleDelete = async () => {
    if (!note) return
    await deleteNote(note.id)
    onDone?.()
  }

  const handleCancel = () => {
    onDone?.()
  }

  return (
    <View className="flex-1 w-[90%] self-center gap-2 pt-4">
      <View className="flex-row gap-4 justify-between">
        <View className="flex-1 flex-row flex-wrap gap-2">
          {showSubjectSelect && subjects.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setSubject((prev: string) => (prev === s.id ? "" : s.id))}
              className={clsx(
                "rounded-full px-3 py-1.5",
                subject === s.id ? "bg-blue" : "bg-neutral-200"
              )}
            >
              <Text
                className={clsx(
                  "text-sm font-medium",
                  subject === s.id ? "text-white" : "text-neutral-700"
                )}
              >
                {s.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row gap-2 self-start">
          <TouchableOpacity
            className="rounded border-2 bg-green p-2"
            onPress={handleSubmit}
          >
            <icons.save width={24} height={24} />
          </TouchableOpacity>

          {note ? (
            <TouchableOpacity
              className="rounded border-2 bg-red p-2"
              onPress={handleDelete}
            >
              <icons.trash width={24} height={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="rounded border-2 bg-neutral-200 p-2"
              onPress={handleCancel}
            >
              <Text className="font-semibold text-neutral-700">Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Escribe algo..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="flex-1 text-black text-lg"
      />
    </View>
  )
}
