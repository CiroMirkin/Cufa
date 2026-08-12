import { Tabs } from "expo-router";

const TabLayout = () => (
    <Tabs screenOptions={{ headerShown: false, }}>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="notes" options={{ title: "Notes" }} />
    </Tabs>
)

export default TabLayout
