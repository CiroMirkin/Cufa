import { useState } from "react"
import { Link, Stack, useLocalSearchParams } from "expo-router"
import { View, Text, TouchableOpacity } from "react-native"
import NoteList from "@/components/note/note-list"
import EvaluationInput from "@/components/evaluation/evaluation-input"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useSubjects } from "@/hooks/useSubject"
import { useCareer } from "@/hooks/useCareer"

type ActiveInput = "evaluation" | null

export default function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { evaluations } = useEvaluation({ subjectId: id })
    const { career } = useCareer()
    const { getSubject } = useSubjects(career.id)
    const subject = getSubject(id)

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="flex-row justify-between gap-4">
                <View className="py-4 text-lg">
                    <Text>{subject?.name}</Text>
                </View>

                <View className="flex-row px-4 pt-4 gap-3">
                    <Link
                        href={{ pathname: "/(evaluation)/new", params: { subjectId: id } }}
                        className="flex-1 items-center rounded-lg bg-neutral-800 py-3"
                    >
                        <Text className="font-semibold text-white text-center">Nueva Evaluacion</Text>
                    </Link>
                    <Link
                        href={{ pathname: "/(note)/new", params: { subjectId: id } }}
                        className="flex-1 items-center rounded-lg bg-neutral-800 py-3"
                    >
                        <Text className="font-semibold text-white text-center">Nueva nota</Text>
                    </Link>
                </View>
            </View>

            <Text className="px-4 pt-4 text-lg font-bold text-neutral-400">Próximas Evaluaciones</Text>
            <EvaluationList evaluations={evaluations} />

            <Text className="px-4 pt-4 text-lg font-bold text-neutral-400">Notas</Text>
            <NoteList subjectId={id} />
        </View>
    )
}
