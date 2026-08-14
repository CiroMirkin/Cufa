import { Evaluation } from "@/types/evaluation"
import { FlatList, Text } from "react-native"
import EvaluationItem from "./evaluation-item"
import { isWithinThisAndNextWeek } from "@/lib/isWithinThisAndNextWeek"

interface Props {
  evaluations: Evaluation[]
  onlyThisAndNextWeek?: boolean
}

export default function EvaluationList({ evaluations, onlyThisAndNextWeek }: Props) {
  const filtered = onlyThisAndNextWeek
    ? evaluations.filter((e) => isWithinThisAndNextWeek(e.date))
    : evaluations

  if (!filtered || filtered.length === 0) {
    return (
      <Text className="px-4 pt-4 text-sm text-neutral-400">
        Aún no hay evaluaciones registradas.
      </Text>
    )
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      className="w-full"
      contentContainerClassName="gap-2 px-4 pt-4 pb-8"
      renderItem={({ item }) => (
        <EvaluationItem
          item={item}
        />
      )}
    />
  )
}
