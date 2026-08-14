import { Link, Stack, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import NoteList from "@/components/note/note-list"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { useShallow } from "zustand/react/shallow"

function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const subjects = useSubjectsStore((s) => s.subjects)
    const subject = subjects.find((s) => s.id === id)
    const evaluations = useEvaluationsStore(
        useShallow((s) => 
            s.evaluations
                .filter((e) => e.subjectId === id)
                .filter((e) => new Date(e.date).getTime() >= Date.now())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        ),
    )

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

export default SubjectScreen
