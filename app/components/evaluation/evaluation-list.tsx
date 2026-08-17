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
    return;
  }

  return (
    <View className="w-full gap-2 pt-4">
      {filtered.map((item) => (
        <EvaluationItem
          key={item.id}
          item={item}
        />
      ))}
    </View>
  )
}
