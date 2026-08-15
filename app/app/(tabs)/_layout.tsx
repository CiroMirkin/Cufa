import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import clsx from "clsx";
import { SvgProps } from "react-native-svg";

const tabs = [
    { name: "index", title: "Inicio", icon: icons.home },
    { name: "notes", title: "Notas", icon: icons.library },
    { name: "evaluation", title: "Evaluaciones", icon: icons.calendar_event },
]

type TabIconProps = {
    focused: boolean;
    icon: React.FC<SvgProps>
};

const TabIcon = ({ focused, icon: Icon }: TabIconProps) => {
    return (
        <View className="tabs-icon">
            <View className={clsx('tabs-pill text-black', focused && 'tabs-active')}>
                <Icon width={24} height={24} />
            </View>
        </View>
    );
};

const TabLayout = () => (
    <Tabs screenOptions={{ headerShown: false, }}>
        {tabs.map((tab) => (
            <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                    title: tab.title,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={tab.icon} />
                    )
                }}
            />
        ))}

        <Tabs.Screen name="(subject)/[id]" options={{ href: null }} />
        <Tabs.Screen name="(note)/new" options={{ href: null }} />
        <Tabs.Screen name="(note)/[id]" options={{ href: null }} />
    </Tabs>
)

export default TabLayout
