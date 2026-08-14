import { useState } from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { useCareer } from "@/hooks/useCareer"
import { useNotes } from "@/hooks/useNotes"

interface Props {
  subjectId: string | null
  onDone?: () => void
}

export default function NoteInput({ subjectId, onDone }: Props) {
  const { career } = useCareer()
  const { addNote } = useNotes(subjectId, career.id)
  const [content, setContent] = useState("")

  const handleSubmit = async () => {
    if (!content.trim()) return
    await addNote({ content })
    setContent("")
    onDone?.()
  }

  return (
    <View className="w-[90%] self-center gap-2 pt-4">
      <TouchableOpacity
        className="items-center rounded-lg bg-neutral-800 py-3"
        onPress={handleSubmit}
      >
        <Text className="font-semibold text-white">Guardar</Text>
      </TouchableOpacity>
      
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Contenido"
        multiline
        numberOfLines={4}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800"
      />
    </View>
  )
}
