import { Link, Stack, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import NoteList from "@/components/note/note-list"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { useShallow } from "zustand/react/shallow"
import { icons } from "@/constants/icons"

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
        <View className="flex-1 bg-white px-4 pt-4">
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="py-4 mb-8 bg-[#fdf28b] rounded-xl border-2">
                <Text className="text-2xl text-center font-bold">{subject?.name}</Text>
            </View>

            <View className="flex-1 items-stretch">
                <View className="flex-1">
                    <View className="flex-row justify-between">
                        <Text className="pt-4 text-xl text-black font-bold opacity-90">Próximas Evaluaciones</Text>
                        <Link
                            href={{ pathname: "/(tabs)/(evaluation)/new", params: { subjectId: id } }}
                            className="rounded border-2 bg-green p-2"
                        >
                            <icons.plus width={24} height={24} />
                        </Link>
                    </View>
                    <EvaluationList evaluations={evaluations} />
                </View>
                <View className="flex-1">
                    <View className="pt-8 flex-row justify-between">
                        <Text className="text-xl text-black font-bold opacity-90">Notas</Text>
                        <Link
                            href={{ pathname: "/(tabs)/(note)/new", params: { subjectId: id } }}
                            className="text-lg rounded border-2 bg-blue p-2"
                        >
                            <icons.plus width={24} height={24} />
                        </Link>
                    </View>
                    <NoteList subjectId={id} />
                </View>
            </View>


        </View>
    )
}

export default SubjectScreen
