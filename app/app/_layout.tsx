import "./global.css"
import { Stack } from "expo-router"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { View } from "react-native"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StackWithInsets />
    </SafeAreaProvider>
  )
}

function StackWithInsets() {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}
