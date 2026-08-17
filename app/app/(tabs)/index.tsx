import EvaluationList from "@/components/evaluation/evaluation-list"
import SubjectList from "@/components/subject/SubjectList"
import SubjectModal from "@/components/subject/SubjectModal"
import ScreenScroll from "@/components/screen-scroll"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { useShallow } from 'zustand/react/shallow'
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { icons } from "@/constants/icons"
import { useSubjectsByCareer } from "@/hooks/useSubjectsByCareer"
import { useChangeActualCareer } from "@/hooks/useChangeActualCareer"
import { useCareerStore } from "@/stores/careerStore"
import EmptySpace from "@/components/ui/empty-space"

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false)
  const { career } = useCareerStore()
  useChangeActualCareer(career.id)
  const subjects = useSubjectsByCareer()

  const addSubject = useSubjectsStore((s) => s.addSubject)
  const deleteSubject = useSubjectsStore((s) => s.deleteSubject)

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
    <>
      <ScreenScroll>
        <View className="px-4 pt-6 mb-6 flex-row justify-between">
          <Pressable className="flex-row items-center gap-4 flex-1 mr-4">
            <View className="w-12 h-12 flex items-center justify-center rounded-full border-2 bg-blue" />
            <Text
              className="font-medium text-2xl flex-1 pr-6"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {career.name}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setModalVisible(true)}
            className="p-2 rounded border-2 bg-transparent opacity-95"
          >
            <icons.plus width={24} height={24} />
          </Pressable>
        </View>

        <View className="px-4">
          <EvaluationList evaluations={evaluations} onlyThisAndNextWeek />
          {!subjects.length && <EmptySpace message="No hay asignaturas todavia."/>}
          <SubjectList subjects={subjects} onDelete={deleteSubject} />
        </View>
      </ScreenScroll>

      <SubjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={addSubject}
      />
    </>
  )
}
