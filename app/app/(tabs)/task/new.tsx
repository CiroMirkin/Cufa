import TaskInput from "@/components/task/task-input"
import { useSubjectsByCareer } from "@/hooks/useSubjectsByCareer"
import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"

function NewTaskScreen() {
    const { subjectId } = useLocalSearchParams<{ subjectId?: string }>()
    const subjects = useSubjectsByCareer()

    return (
        <View className="flex-1 bg-white pt-4 px-4">
            <Stack.Screen options={{ title: "Nueva tarea" }} />
            
            <TaskInput
                subjectId={subjectId || null}
                subjects={!subjectId ? subjects: undefined}
            />
        </View>
    )
}

export default NewTaskScreen
