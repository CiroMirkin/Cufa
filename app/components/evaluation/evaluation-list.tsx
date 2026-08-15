import { Evaluation } from "@/types/evaluation"
import { FlatList, Text, View } from "react-native"
import EvaluationItem from "./evaluation-item"
import { isWithinThisAndNextWeek } from "@/lib/isWithinThisAndNextWeek"
import { icons } from "@/constants/icons"

interface Props {
  evaluations: Evaluation[]
  onlyThisAndNextWeek?: boolean
}

export default function EvaluationList({ evaluations, onlyThisAndNextWeek }: Props) {
  const filtered = onlyThisAndNextWeek
    ? evaluations.filter((e) => isWithinThisAndNextWeek(e.date))
    : evaluations

  if (!filtered || filtered.length === 0) {
    if(onlyThisAndNextWeek) return;
    return (
      <View className="flex-1 items-center justify-center opacity-50">
        <icons.calendar_event width={48} height={48} />
        <Text className="mt-2 text-lg font-semibold text-black">Por el momento no hay evaluaciones</Text>
      </View>
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
