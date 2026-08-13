import { useState } from "react"
import { Stack, useLocalSearchParams } from "expo-router"
import { View, Text, TouchableOpacity } from "react-native"
import NoteInput from "@/components/note/note-input"
import NoteList from "@/components/note/note-list"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useSubjects } from "@/hooks/useSubject"
import { useCareer } from "@/hooks/useCareer"

type ActiveInput = "evaluation" | "note" | null

export default function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { evaluations } = useEvaluation({ subjectId: id })
    const { career } = useCareer()
    const { getSubject } = useSubjects(career.id)
    const subject = getSubject(id)
    const [activeInput, setActiveInput] = useState<ActiveInput>(null)

    const toggleInput = (input: ActiveInput) => {
        setActiveInput(prev => (prev === input ? null : input))
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="py-4 text-lg">
                <Text>{ subject?.name }</Text>
            </View>

            <View className="flex-row px-4 pt-4 gap-3">
                <TouchableOpacity
                    className="flex-1 items-center rounded-lg bg-neutral-800 py-3"
                    onPress={() => toggleInput("evaluation")}
                >
                    <Text className="font-semibold text-white">
                        {activeInput === "evaluation" ? "Cancelar" : "Nueva evaluación"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center rounded-lg bg-neutral-800 py-3"
                    onPress={() => toggleInput("note")}
                >
                    <Text className="font-semibold text-white">
                        {activeInput === "note" ? "Cancelar" : "Nueva nota"}
                    </Text>
                </TouchableOpacity>
            </View>

            {activeInput === "evaluation" && (
                <EvaluationInput subjectId={id} />
            )}

            {activeInput === "note" && (
                <NoteInput subjectId={id} />
            )}

            {activeInput === null && (
                <>
                    <Text className="px-4 pt-4 text-lg font-bold text-neutral-800">Evaluaciones</Text>
                    <EvaluationList evaluations={evaluations} />

                    <Text className="px-4 pt-4 text-lg font-bold text-neutral-800">Notas</Text>
                    <NoteList subjectId={id} />
                </>
            )}
        </View>
    )
}
