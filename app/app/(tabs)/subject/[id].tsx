import { Stack, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import NoteInput from "@/components/note/note-input"
import NoteList from "@/components/note/note-list"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluation } from "@/hooks/useEvaluation"

export default function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { evaluations } = useEvaluation({ subjectId: id })

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />
            
            <Text className="px-4 pt-4 text-lg font-bold text-neutral-800">Evaluaciones</Text>
            <EvaluationInput 
                subjectId={id} 
            />
            <EvaluationList 
                evaluations={evaluations} 
            />

            <Text className="px-4 pt-4 text-lg font-bold text-neutral-800">Notas</Text>
            <NoteInput subjectId={id} />
            <NoteList subjectId={id} />
        </View>
    )
}
