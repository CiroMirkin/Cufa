import { Note } from "@/types/note"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

interface Props {
  onAdd: (note: Note) => void
}

function NoteInput({ onAdd }: Props) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd({
      id: `${Date.now()}`,
      careerId: "",
      subjectId: "",
      content: content.trim(),
      createdAt: new Date().toISOString(),
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
        className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-800"
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