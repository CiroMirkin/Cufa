import EvaluationList from "@/components/evaluation/evaluation-list"
import SubjectList from "@/components/subject/SubjectList"
import SubjectModal from "@/components/subject/SubjectModal"
import { useCareerStore } from "@/stores/careerStore"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { useShallow } from 'zustand/react/shallow'
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false)
  const career = useCareerStore((s) => s.career)

  const subjects = useSubjectsStore(
    useShallow((s) => s.subjects.filter((sub) => sub.careerId === career.id)),
  )

  const addSubject = useSubjectsStore((s) => s.addSubject)
  const deleteSubject = useSubjectsStore((s) => s.deleteSubject)

  const evaluations = useEvaluationsStore(
    useShallow((s) =>
      s.evaluations
        .filter((e) => new Date(e.date).getTime() >= Date.now())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    ),
  )
  
  return (
    <View className="flex-1 bg-white">
      <EvaluationList evaluations={evaluations} onlyThisAndNextWeek />

      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-blue-500">Asignaturas</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
        >
          <Text className="text-lg font-bold text-white">+</Text>
        </Pressable>
      </View>

      <SubjectList subjects={subjects} onDelete={deleteSubject} />

      <SubjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={addSubject}
      />
    </View>
  )
}
