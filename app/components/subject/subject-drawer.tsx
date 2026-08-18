import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Drawer from "@/components/ui/drawer"

interface Props {
  visible: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export default function SubjectDrawer({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name.trim())
    setName("")
    onClose()
  }

  return (
    <Drawer visible={visible} onClose={onClose}>
      <Text className="mb-3 text-lg font-bold text-neutral-800">
        Nueva asignatura
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre de la asignatura"
        autoFocus
        className="rounded-lg border-2 p-3 text-base text-neutral-800"
      />
      <View className="mt-4 flex-row justify-end gap-3">
        <Pressable onPress={onClose} className="px-4 py-2 bg-neutral-100 border-2 border-neutral-300 rounded-lg">
          <Text className="text-sm text-neutral-500">Cancelar</Text>
        </Pressable>
        <Pressable onPress={handleCreate} className="rounded-lg bg-green border-2 px-4 py-2">
          <Text className="text-sm font-medium text-black ">Crear</Text>
        </Pressable>
      </View>
    </Drawer>
  )
}
