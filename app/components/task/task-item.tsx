import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { Task } from "@/types/task"
import clsx from "clsx"
import { icons } from "@/constants/icons"
import { useTasksStore } from "@/stores/tasksStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { Linking } from "react-native"
import { isTaskUrgent } from "@/lib/task"
import TaskEditItem from "@/components/task/task-edit-item"

interface Props {
    task: Task
    showSubjectName?: boolean
    subjectName?: string
}

export default function TaskItem({ task, subjectName, showSubjectName = false }: Props) {
    const [expanded, setExpanded] = useState(false)
    const [editing, setEditing] = useState(false)
    const toggleTask = useTasksStore((s) => s.toggleTask)
    const deleteTask = useTasksStore((s) => s.deleteTask)
    const updateTask = useTasksStore((s) => s.updateTask)
    const subjects = useSubjectsStore((s) => s.subjects)
    const urgent = isTaskUrgent(task)

    if (editing) {
        return (
            <TaskEditItem
                task={task}
                subjects={subjects}
                onSave={(updates) => {
                    updateTask(task.id, updates)
                    setEditing(false)
                }}
                onCancel={() => setEditing(false)}
            />
        )
    }

    return (
        <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            className={clsx("rounded-lg border-2 p-3", urgent && "bg-yellow")}
        >
            <View className="flex-row items-center gap-2">

            {(subjectName && showSubjectName) && (
                <Text
                className="px-2 py-1 self-end text-xs rounded-xl text-black font-semibold bg-blue/60"
                >
                    {subjectName}
                </Text>
            )}
            <Text
                className={clsx(
                    "text-lg font-medium",
                    task.done ? "text-neutral-400 line-through" : "text-black"
                )}
                numberOfLines={expanded ? undefined : 1}
                ellipsizeMode="tail"
                >
                {task.title}
            </Text>
            </View>

            {expanded && (
                <View className="mt-2 flex-col gap-2">
                    {task.date && (
                        <Text className="text-sm text-black font-bold">
                            Fecha de entrega: {task.date}
                        </Text>
                    )}
                    {task.note && (
                        <Text className="text-base text-neutral-700">{task.note}</Text>
                    )}
                    {task.link && (
                        <Pressable onPress={() => Linking.openURL(task.link as string)} className="flex-row items-center gap-2">
                            <icons.link width={16} height={16} />
                            <Text className="flex-1 text-base text-black underline" numberOfLines={1}>
                                {task.link}
                            </Text>
                        </Pressable>
                    )}

                    <View className="flex-row items-center justify-end gap-3 pt-4 border-t-2">
                        <Pressable
                            onPress={() => toggleTask(task.id)}
                            className={clsx(
                                "p-2 rounded border-2 items-center justify-center",
                                task.done ? "bg-green" : "bg-white"
                            )}
                        >
                            <icons.check width={24} height={24} />
                        </Pressable>

                        <Pressable
                            onPress={() => setEditing(true)}
                            className="p-2 rounded border-2 items-center justify-center bg-blue"
                        >
                            <icons.pencil width={24} height={24} />
                        </Pressable>

                        <Pressable onPress={() => deleteTask(task.id)} className="p-2 bg-red border-2 rounded">
                            <icons.trash width={24} height={24} />
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    )
}
