import { useState } from "react"
import { Modal, Pressable, Text, TextInput, View } from "react-native"

interface Props {
  visible: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export default function SubjectModal({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name.trim())
    setName("")
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-xl bg-white p-5 border-2">
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
            <Pressable onPress={onClose} className="px-4 py-2 hover:border-2 rounded-lg">
              <Text className="text-sm text-neutral-500">Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleCreate} className="rounded-lg bg-green border-2 px-4 py-2">
              <Text className="text-sm font-medium text-black ">Crear</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
