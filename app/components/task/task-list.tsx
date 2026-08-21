import { View } from "react-native"
import { Task } from "@/types/task"
import TaskItem from "@/components/task/task-item"
import { useSubjectsStore } from "@/stores/subjectsStore"

interface Props {
    tasks?: Task[]
    showSubjectName?: boolean
}

function TaskList({ tasks, showSubjectName = false, }: Props) {
    const subjects = useSubjectsStore((s) => s.subjects)

    if (!tasks || tasks.length === 0) return null

    return (
        <View className="gap-2">
            {tasks.map((task) => {
                const subjectName = subjects.find((s) => s.id === task.subjectId)?.name
                return (
                    <TaskItem
                        key={task.id}
                        task={task}
                        subjectName={showSubjectName ? subjectName : undefined}
                    />
                )
            })}
        </View>
    )
}

export default TaskList
