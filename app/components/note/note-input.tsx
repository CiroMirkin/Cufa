import { useState } from "react"
import { View, TextInput, TouchableOpacity, Text, Pressable } from "react-native"
import clsx from "clsx"
import { useCareerStore } from "@/stores/careerStore"
import { useNotesStore } from "@/stores/notesStore"
import { icons } from "@/constants/icons"
import { useSubjectsStore } from "@/stores/subjectsStore"

interface Props {
  subjectId: string | null
  onDone?: () => void
}

export default function NoteInput({ subjectId, onDone }: Props) {
  const career = useCareerStore((s) => s.career)
  const addNote = useNotesStore((s) => s.addNote)
  const subjects = useSubjectsStore((s) => s.subjects)

  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")

  const handleSubmit = async () => {
    if (!content.trim()) return
    addNote({ subjectId, careerId: career.id, content })
    setContent("")
    onDone?.()
  }

  return (
    <View className="flex-1 w-[90%] self-center gap-2 pt-4">
      <View className="flex-row gap-4 justify-between">
        <View className="flex-1 flex-row flex-wrap gap-2">
          {subjects.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setSubject((prev) => (prev === s.id ? "" : s.id))}
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
        <TouchableOpacity
          className="rounded border-2 bg-green p-2 self-start"
          onPress={handleSubmit}
        >
          <icons.save width={24} height={24} />
        </TouchableOpacity>
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
