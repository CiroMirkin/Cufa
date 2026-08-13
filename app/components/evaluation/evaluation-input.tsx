import { Evaluation } from "@/types/evaluation"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

const BLANK_EVALUATION = {
    title: "",
    note: "",
    type: "",
    date: "",
    link: "",
  }

interface Props {
  onAdd: (evaluation: Evaluation) => void
}

function EvaluationInput({ onAdd }: Props) {
  const [evaluation, setEvaluation] = useState({... BLANK_EVALUATION})

  const handleSubmit = () => {
    if (!evaluation.title.trim()) return
    //onAdd()
    setEvaluation({...BLANK_EVALUATION})
  }

  return (
    <View className="w-full gap-2 px-4">
      <TextInput
        value={evaluation.title}
        onChangeText={(title) => setEvaluation({ ...evaluation, title })}
        className="w-full border bg-white p-3 text-sm text-neutral-800"
      />
      <TextInput
        value={evaluation.note}
        onChangeText={(note) => setEvaluation({ ...evaluation, note })}
        multiline
        numberOfLines={4}
        className="w-full border bg-white p-3 text-sm text-neutral-800"
      />
      
      <Pressable
        onPress={handleSubmit}
        className="self-end rounded-lg bg-neutral-900 px-4 py-2"
      >
        <Text className="text-sm font-medium text-white">Crear</Text>
      </Pressable>
    </View>
  )
}

export default EvaluationInput
