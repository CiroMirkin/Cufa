import { useState } from "react"
import { useRouter } from "expo-router"
import { Pressable, Text, View, Modal } from "react-native"
import { icons } from "@/constants/icons"

interface Props {
  subjectId: string
}

function AddMenu({ subjectId }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const options = [
    {
      label: "Nueva nota",
      onPress: () => router.push({ pathname: "/(tabs)/note/new", params: { subjectId } }),
    },
    {
      label: "Nueva evaluación",
      onPress: () => router.push({ pathname: "/(tabs)/(evaluation)/new", params: { subjectId } }),
    },
  ]

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        className="rounded border-2 bg-green p-2"
      >
        <icons.plus width={24} height={24} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setOpen(false)}
        >
          <View className="absolute right-4 top-24 w-48 overflow-hidden rounded-lg border-2 bg-white">
            {options.map((option, index) => (
              <Pressable
                key={option.label}
                onPress={() => {
                  setOpen(false)
                  option.onPress()
                }}
                className={`p-4 ${index !== options.length - 1 ? "border-b-2 border-black" : ""}`}
              >
                <Text className="text-lg font-medium text-black">{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export default AddMenu
