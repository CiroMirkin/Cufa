import EvaluationInput from "@/components/evaluation/evaluation-input"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { Evaluation } from "@/types/evaluation"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

export default function Index() {
  const [evaluationInputVisible, setEvaluationInputVisible] = useState(false)

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-blue-500">Evaluaciones</Text>
        <Pressable
          onPress={() => setEvaluationInputVisible(!evaluationInputVisible)}
          className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
        >
          <Text className="text-lg font-bold text-white">+</Text>
        </Pressable>
      </View>

      { evaluationInputVisible && (
        <EvaluationInput onAdd={(e: Evaluation) => {}} />
      )}

      <EvaluationList evaluations={[]} />
    </View>
  )
}
