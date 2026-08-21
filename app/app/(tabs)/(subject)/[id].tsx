import { Stack, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import ScreenScroll from "@/components/screen-scroll"
import { useSubjectsStore } from "@/stores/subjectsStore"
import SubjectContent from "@/components/subject/subject-content"
import AddMenu from "@/components/ui/add-menu"
import Schedule from "@/components/subject/schedule"

function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const subjects = useSubjectsStore((s) => s.subjects)
    const subject = subjects.find((s) => s.id === id)

    if(!subject) return ;

    return (
        <ScreenScroll>
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="px-4 pt-4">
                <View className="flex-row items-center justify-between py-4 mb-4">
                    <Text className="text-2xl text-left font-bold">{subject?.name}</Text>
                    <AddMenu subjectId={subject.id} />
                </View>
                <Schedule schedules={subject?.schedules} />

                <SubjectContent subject={subject} />
            </View>
        </ScreenScroll>
    )
}

export default SubjectScreen
