import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import { useCareerStore } from "@/stores/careerStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { useShallow } from "zustand/react/shallow"

export default function NewNoteScreen() {
    const { subjectId } = useLocalSearchParams<{ subjectId?: string }>()
    const career = useCareerStore((s) => s.career)
    const subjects = useSubjectsStore(
        useShallow(s => s.subjects.filter((sub) => sub.careerId === career.id),)
    )

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
