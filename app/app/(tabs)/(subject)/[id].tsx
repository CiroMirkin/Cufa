import { Stack, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import ScreenScroll from "@/components/screen-scroll"
import { useSubjectsStore } from "@/stores/subjectsStore"
import SubjectContent from "@/components/subject/subject-content"

function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const subjects = useSubjectsStore((s) => s.subjects)
    const subject = subjects.find((s) => s.id === id)

    if(!subject) return ;

    return (
        <ScreenScroll>
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="px-4 pt-4">
                <View className="py-4 mb-4 bg-[#fdf28b] rounded-xl border-2">
                    <Text className="text-2xl text-center font-bold">{subject?.name}</Text>
                </View>

                <SubjectContent subject={subject} />
            </View>
        </ScreenScroll>
    )
}

export default SubjectScreen
