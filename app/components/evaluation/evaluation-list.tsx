import { Evaluation } from "@/types/evaluation"
import { FlatList, Text, View } from "react-native"

interface Props {
  evaluations: Evaluation[]
}

function EvaluationList({ evaluations, }: Props) {
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
      keyExtractor={(_, index) => `${index}`}
      className="w-full"
      contentContainerClassName="gap-2 px-4 pt-4"
      renderItem={({ item }) => (
        <View className="flex-row items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
          <View className="flex-1 gap-1">
            <Text className="text-base text-neutral-800">{item.title}</Text>
            <Text className="text-sm text-neutral-800">{item.note}</Text>
            <Text className="text-xs text-neutral-400">
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    />
  )
}

export default EvaluationList
