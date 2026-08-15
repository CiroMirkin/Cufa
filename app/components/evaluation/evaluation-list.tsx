import { Evaluation } from "@/types/evaluation"
import { Text, View } from "react-native"
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
      <View className="items-center justify-center px-4 py-10 opacity-50">
        <icons.calendar_event width={48} height={48} />
        <Text className="mt-2 text-lg font-semibold text-black">Por el momento no hay evaluaciones</Text>
      </View>
    )
  }

  return (
    <View className="w-full gap-2 px-4 pt-4">
      {filtered.map((item) => (
        <EvaluationItem
          key={item.id}
          item={item}
        />
      ))}
    </View>
  )
}
