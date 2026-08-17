import { Subject } from "@/types/subject"
import { Link } from "expo-router"
import { Text, View } from "react-native"
import NoteList from "../note/note-list"
import EvaluationList from "../evaluation/evaluation-list"
import { icons } from "@/constants/icons"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useNotesStore } from "@/stores/notesStore"
import { useShallow } from "zustand/react/shallow"
import EmptySpace from "../ui/empty-space"

interface Props {
    subject: Subject
}

function SubjectContent({ subject }: Props) {
    const evaluations = useEvaluationsStore(
        useShallow((s) =>
            s.evaluations
                .filter((e) => e.subjectId === subject.id)
                .filter((e) => new Date(e.date).getTime() >= Date.now())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        ),
    )
    const notes = useNotesStore(
        useShallow((s) => s.notes.filter((n) => n.subjectId === subject?.id))
    )

    if (!evaluations.length && !notes.length) {
        return (
            <EmptySpace icon="clock_plus" message="Esta asignatura aun no tiene contenido." />
        )
    }

    return (
        <View>
            {evaluations.length &&
                <View>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xl text-black font-bold opacity-90">Próximas Evaluaciones</Text>
                        <Link
                            href={{ pathname: "/(tabs)/(evaluation)/new", params: { subjectId: subject.id } }}
                            className="rounded border-2 bg-green p-2"
                        >
                            <icons.plus width={24} height={24} />
                        </Link>
                    </View>
                    <EvaluationList evaluations={evaluations} />
                </View>
            }

            {notes.length &&
                <View>
                    <View className="flex-row justify-between items-center pt-8">
                        <Text className="text-xl text-black font-bold opacity-90">Notas</Text>
                        <Link
                            href={{ pathname: "/(tabs)/note/new", params: { subjectId: subject.id } }}
                            className="text-lg rounded border-2 bg-green p-2"
                        >
                            <icons.plus width={24} height={24} />
                        </Link>
                    </View>
                    <NoteList subjectId={subject.id} notes={notes} />
                </View>
            }
        </View>
    )
}

export default SubjectContent
