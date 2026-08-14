import { Link } from "expo-router"
import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import { useCareer } from "@/hooks/useCareer"
import { useSubjects } from "@/hooks/useSubject"

export default function NewNoteScreen() {
    const { subjectId } = useLocalSearchParams<{ subjectId?: string }>()
    const { career } = useCareer()
    const { subjects } = useSubjects(career.id)

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Nueva evaluacion" }} />
            
            <View className="flex flex-row gap-2 justify-between">
                {!subjectId
                    ? <Link href={{ pathname: "/(tabs)/evaluation", }}>Volver</Link>
                    : <Link href={{
                        pathname: "/(tabs)/(subject)/[id]",
                        params: { id: subjectId },
                    }}>Volver</Link>
                }
            </View>

            <EvaluationInput
                subjectId={subjectId || null}
                subjects={!subjectId ? subjects: undefined}
            />
        </View>
    )
}
