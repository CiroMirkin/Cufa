import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluation } from "@/hooks/useEvaluation"
import { Text, View } from "react-native"
import { Link } from "expo-router"

export default function EvaluationsTab() {
  const { evaluations, loading } = useEvaluation({ subjectId: null })

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-neutral-400">Cargando...</Text>
      </View>
    )
  }
  console.log(evaluations)

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
