import "./global.css"
import { Stack } from "expo-router"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { View } from "react-native"
import { useCareerStore } from "@/stores/careerStore"
import SetUp from "./set-up"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StackWithInsets />
    </SafeAreaProvider>
  )
}

function StackWithInsets() {
  const insets = useSafeAreaInsets()
  const career = useCareerStore((s) => s.career)

  if (!career.id && !career.name) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-white">
        <SetUp />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-white">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}
