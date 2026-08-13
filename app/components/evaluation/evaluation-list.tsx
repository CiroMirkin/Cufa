import { Evaluation } from "@/types/evaluation"
import { FlatList, Text } from "react-native"
import EvaluationItem from "./evaluation-item"

interface Props {
  evaluations: Evaluation[]
}

export default function EvaluationList({ evaluations }: Props) {
  if (!evaluations || evaluations.length === 0) {
    return (
      <Text className="px-4 pt-4 text-sm text-neutral-400">
        Aún no hay evaluaciones registradas.
      </Text>
    )
  }

  return (
    <FlatList
      data={evaluations}
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
