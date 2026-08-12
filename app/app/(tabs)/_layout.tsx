import { Tabs } from "expo-router";

const TabLayout = () => (
    <Tabs screenOptions={{ headerShown: false, }}>
        <Tabs.Screen name="index" options={{ title: "Inicio" }} />
        <Tabs.Screen name="notes" options={{ title: "Notas" }} />
        <Tabs.Screen name="evaluation" options={{ title: "Evaluaciones" }} />
        
        <Tabs.Screen name="subject/[id]" options={{ href: null }} />
    </Tabs>
)

export default TabLayout
