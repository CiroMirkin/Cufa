import { View } from "react-native"
import { Task } from "@/types/task"
import TaskItem from "@/components/task/task-item"
import EmptySpace from "@/components/ui/empty-space"

interface Props {
    tasks?: Task[]
}

function TaskList({ tasks }: Props) {
    if (!tasks || tasks.length === 0) {
        return <EmptySpace message="No hay tareas pendientes." />
    }
    
    return (
        <View className="gap-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                />
            ))}
        </View>
    )
}

export default TaskList
