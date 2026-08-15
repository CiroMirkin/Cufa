import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useShallow } from 'zustand/react/shallow'
import { Text, View } from "react-native"
import { Link } from "expo-router"
import { icons } from "@/constants/icons"

export default function EvaluationsTab() {
  const evaluations = useEvaluationsStore(
    useShallow((s) => {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      return s.evaluations
        .filter((e) => new Date(e.date).getTime() >= startOfToday.getTime())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }),
  )

  return (
    <View className="flex-1 px-4 pt-4 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-blue">Evaluaciones</Text>
        <Link
          href={{ pathname: "/(tabs)/(evaluation)/new", params: { subjectId: null } }}
          className="rounded border-2 bg-blue p-2"
        >
          <icons.plus width={24} height={24} />
        </Link>
      </View>

      <EvaluationList
        evaluations={evaluations}
      />
    </View>
  )
}
