import "./global.css"
import { Stack } from "expo-router"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { View } from "react-native"
import { useCareerStore } from "@/stores/careerStore"
import { setNotificationHandler } from "@/lib/notifications"
import SetUp from "./set-up"
import { useEvaluationsReminders } from "../hooks/useEvaluationsReminders"

setNotificationHandler()

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
  useEvaluationsReminders()

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
