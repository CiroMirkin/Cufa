import { Subject } from "@/types/subject"
import { Text, View } from "react-native"
import NoteList from "../note/note-list"
import EvaluationList from "../evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useNotesStore } from "@/stores/notesStore"
import { useShallow } from "zustand/react/shallow"
import EmptySpace from "../ui/empty-space"
import { evaluationToDate } from "@/lib/date"
import { useTasksStore } from "@/stores/tasksStore"
import TaskList from "../task/task-list"

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
    
    const tasks = useTasksStore(
      useShallow((s) => s.tasks.filter((t) => !t.done && t.subjectId === subject.id))
    )

    const notes = useNotesStore(
        useShallow((s) => s.notes.filter((n) => n.subjectId === subject?.id))
    )

    if (!evaluations.length && !notes.length && !tasks.length) {
        return (
            <EmptySpace icon="clock_plus" message="Esta asignatura aun no tiene contenido." />
        )
    }

    return (
        <View className="flex flex-col gap-6">
            {evaluations.length > 0 &&
                <View>
                    <Text className="text-xl text-black font-bold opacity-90">Próximamente</Text>
                    <EvaluationList evaluations={evaluations} />
                </View>
            }

            {tasks.length > 0 && 
                <View>
                    <Text className="text-xl text-black font-bold opacity-90 mb-4">Tareas pendientes</Text>
                    <TaskList tasks={tasks} />
                </View>
            }

            {notes.length > 0 &&
                <View>
                    <Text className="text-xl text-black font-bold opacity-90">Notas</Text>
                    <NoteList notes={notes} />
                </View>
            }
        </View>
    )
}

export default SubjectContent
