import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useShallow } from 'zustand/react/shallow'
import { Text, View } from "react-native"
import { Link } from "expo-router"

export default function EvaluationsTab() {
  const evaluations = useEvaluationsStore(
    useShallow((s) =>
      s.evaluations
        .filter((e) => new Date(e.date).getTime() >= Date.now())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    ),
  )
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-blue-500">Evaluaciones</Text>

        <Link
          href={{ pathname: "/(evaluation)/new", params: { subjectId: null } }}
          className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
        >
          <Text className="text-lg font-bold text-white">+</Text>
        </Link>
      </View>

      <EvaluationList
        evaluations={evaluations}
      />
    </View>
  )
}
