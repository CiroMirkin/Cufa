import { Evaluation, TYPE_LABELS } from "@/types/evaluation"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import EvaluationEditItem from "./evaluation-edit-item"
import { getProximityStyle } from "./getProximityStyle"
import { formatDate } from "../../lib/formatDate"
import { getDaysLeft } from "../../lib/getDaysLeft"
import { useCareer } from "@/hooks/useCareer"
import { useSubjects } from "@/hooks/useSubject"
import { useEvaluation } from "@/hooks/useEvaluation"

interface Props {
    item: Evaluation
}

export default function EvaluationItem({ item }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { career } = useCareer()
    const { subjects } = useSubjects(career.id)
    const { updateEvaluation, deleteEvaluation } = useEvaluation({ subjectId: item.subjectId })

    const style = getProximityStyle(item.date)

    const getSubjectName = (subjectId: string) =>
        subjects.find((s) => s.id === subjectId)?.name || "Asignatura desconocida"

    if (isEditing) {
        return (
            <EvaluationEditItem
                evaluation={item}
                subjects={subjects}
                onSave={(updates) => {
                    updateEvaluation(item.id, updates)
                    setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
            />
        )
    }

    return (
        <Pressable
            onPress={() => setIsExpanded((prev) => !prev)}
            className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
        >
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                    <Text className="text-base font-semibold text-neutral-800">
                        {item.title}
                    </Text>
                    <Text className="text-xs text-neutral-500">
                        {getSubjectName(item.subjectId)} · {TYPE_LABELS[item.type]}
                    </Text>
                    <Text className={`text-xs font-medium ${style.text}`}>
                        {formatDate(item.date)} · {getDaysLeft(item.date)}
                    </Text>
                </View>
                <Text className="text-lg text-neutral-400">
                    {isExpanded ? "▲" : "▼"}
                </Text>
            </View>

            {isExpanded && (
                <View className="mt-3 gap-2 border-t border-neutral-200 pt-3">
                    {item.note ? (
                        <Text className="text-sm text-neutral-700">{item.note}</Text>
                    ) : null}
                    {item.link ? (
                        <Text className="text-sm text-blue-500">{item.link}</Text>
                    ) : null}
                    {item.topics && item.topics.length > 0 ? (
                        <View className="gap-1">
                            <Text className="text-xs font-medium text-neutral-500">
                                Temas a repasar:
                            </Text>
                            <View className="flex-row flex-wrap gap-1">
                                {item.topics.map((topic, idx) => (
                                    <View
                                        key={idx}
                                        className="rounded-full bg-neutral-100 px-2 py-0.5"
                                    >
                                        <Text className="text-xs text-neutral-600">{topic}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : null}

                    <View className="flex-row justify-end gap-2 pt-1">
                        <Pressable
                            onPress={() => setIsEditing(true)}
                            className="rounded-lg bg-neutral-100 px-3 py-1.5"
                        >
                            <Text className="text-xs font-medium text-neutral-700">
                                Editar
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => deleteEvaluation(item.id)}
                            className="rounded-lg bg-red-100 px-3 py-1.5"
                        >
                            <Text className="text-xs font-medium text-red-600">
                                Eliminar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    )
}
