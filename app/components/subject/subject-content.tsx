import { Subject } from "@/types/subject"
import { Text, View } from "react-native"
import NoteList from "../note/note-list"
import EvaluationList from "../evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useNotesStore } from "@/stores/notesStore"
import { useShallow } from "zustand/react/shallow"
import EmptySpace from "../ui/empty-space"
import { evaluationToDate } from "@/lib/date"

interface Props {
    subject: Subject
}

function SubjectContent({ subject }: Props) {
    const evaluations = useEvaluationsStore(
        useShallow((s) =>
            s.evaluations
                .filter((e) => e.subjectId === subject.id)
                .filter((e) => evaluationToDate(e).getTime() >= Date.now())
                .sort((a, b) => evaluationToDate(a).getTime() - evaluationToDate(b).getTime()),
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
        <View className="flex flex-col gap-6">
            {evaluations.length &&
                <View>
                    <Text className="text-xl text-black font-bold opacity-90">Próximas Evaluaciones</Text>
                    <EvaluationList evaluations={evaluations} />
                </View>
            }

            {notes.length &&
                <View>
                    <Text className="text-xl text-black font-bold opacity-90">Notas</Text>
                    <NoteList subjectId={subject.id} notes={notes} />
                </View>
            }
        </View>
    )
}

export default SubjectContent
