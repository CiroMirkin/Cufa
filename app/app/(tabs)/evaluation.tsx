import EvaluationInput from "@/components/evaluation/evaluation-input"
import EvaluationList from "@/components/evaluation/evaluation-list"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useSubjects } from "@/hooks/useSubject"
import { useCareer } from "@/hooks/useCareer"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

export default function EvaluationsTab() {
  const { career } = useCareer()
  const { subjects, loading: subjectsLoading } = useSubjects(career.id)
  const { evaluations, loading, addEvaluation } = useEvaluation({ subjectId: null })
  const [ inputVisible, setInputVisible ] = useState(false)

  if (subjectsLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-neutral-400">Cargando...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-blue-500">Evaluaciones</Text>
        <Pressable
          onPress={() => setInputVisible(!inputVisible)}
          className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
        >
          <Text className="text-lg font-bold text-white">
            {inputVisible ? "-" : "+"}
          </Text>
        </Pressable>
      </View>

      {inputVisible && (
        <EvaluationInput
          subjects={subjects}
          subjectId={null}
          onCancel={() => setInputVisible(false)}
        />
      )}

      <EvaluationList
        evaluations={evaluations}
      />
    </View>
  )
}
