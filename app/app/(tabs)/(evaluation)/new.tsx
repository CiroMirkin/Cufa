import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import { useSubjectsByCareer } from "@/hooks/useSubjectsByCareer"

export default function NewNoteScreen() {
    const { subjectId } = useLocalSearchParams<{ subjectId?: string }>()
    const subjects = useSubjectsByCareer()

    return (
        <View className="flex-1 bg-white pt-4 px-4">
            <Stack.Screen options={{ title: "Nueva evaluacion" }} />
            
            <EvaluationInput
                subjectId={subjectId || null}
                subjects={!subjectId ? subjects: undefined}
            />
        </View>
    )
}
