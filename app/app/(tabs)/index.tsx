import SubjectList from "@/components/subject/SubjectList"
import SubjectModal from "@/components/subject/SubjectModal"
import { useCareer } from "@/hooks/useCareer"
import { useSubjects } from "@/hooks/useSubject"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false)
  const { career } = useCareer()
  const { subjects, addSubject, deleteSubject } = useSubjects(career.id)

  return (
    <View className="flex-1 bg-white">
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
