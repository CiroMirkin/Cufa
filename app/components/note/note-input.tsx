import { useCareer } from "@/hooks/useCareer"
import { useNotes } from "@/hooks/useNotes"
import { Note } from "@/types/note"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

interface Props {
  subjectId: string | null
}

function NoteInput({ subjectId }: Props) {
  const [content, setContent] = useState("")
  const { career } = useCareer()
  const { addNote } = useNotes(subjectId, career.id)

  const handleSubmit = () => {
    if (!content.trim()) return
    addNote({
      content: content.trim(),
    })
    setContent("")
  }

  return (
    <View className="w-full gap-2 px-4">
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Escribi una nota..."
        multiline
        numberOfLines={4}
        className="w-full bg-white p-3 text-sm text-neutral-800"
      />
      <Pressable
        onPress={handleSubmit}
        className="self-end rounded-lg bg-neutral-900 px-4 py-2"
      >
        <Text className="text-sm font-medium text-white">Guardar nota</Text>
      </Pressable>
    </View>
  )
}

export default NoteInput