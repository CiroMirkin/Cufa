import { router } from "expo-router"
import { Stack, useLocalSearchParams } from "expo-router"
import { TouchableOpacity, View } from "react-native"
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
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Nueva evaluacion" }} />
            
            <View className="flex flex-row gap-2 justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    Volver
                </TouchableOpacity>
            </View>

            <EvaluationInput
                subjectId={subjectId || null}
                subjects={!subjectId ? subjects: undefined}
            />
        </View>
    )
}
