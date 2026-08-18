import { useState } from "react"
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native"
import { router } from "expo-router"
import ScreenScroll from "@/components/screen-scroll"
import { icons } from "@/constants/icons"
import { useCareerStore } from "@/stores/careerStore"
import { useSubjectsStore } from "@/stores/subjectsStore"

const DEFAULT_SUBJECTS_COUNT = 3

export default function SetUp() {
  const [careerName, setCareerName] = useState("")
  const [subjects, setSubjects] = useState<string[]>(
    Array.from({ length: DEFAULT_SUBJECTS_COUNT }, () => ""),
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createCareer = useCareerStore((s) => s.createCareer)
  const addSubject = useSubjectsStore((s) => s.addSubject)

  const handleAddSubject = () => setSubjects((prev) => [...prev, ""])
  const handleChangeSubject = (index: number, value: string) =>
    setSubjects((prev) => prev.map((s, i) => (i === index ? value : s)))

  const handleConfirm = async () => {
    const name = careerName.trim()

    if (name.length <= 2) {
      setError("El nombre de la carrera debe tener más de 2 caracteres.")
      return
    }

    setIsLoading(true)
    try {
      createCareer(name)
      subjects.forEach((subject) => {
        const subjectName = subject.trim()
        if (subjectName) addSubject(subjectName)
      })
      router.replace("/")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScreenScroll contentContainerClassName="px-4 pt-6">
      <View className="pb-4 border-b-2">
        <Text className="text-2xl font-bold text-black">Bienvenido</Text>
      </View>

      <Text className="mt-6 text-lg font-bold text-neutral-800">Maestría o carrera</Text>
      <TextInput
        value={careerName}
        onChangeText={setCareerName}
        placeholder="Nombre de la carrera"
        className="mt-4 rounded-lg border-2 p-3 text-base text-neutral-800"
      />

      {error && <Text className="mt-2 text-sm text-red">{error}</Text>}

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-neutral-800">Asignaturas</Text>
        <Pressable onPress={handleAddSubject} className="rounded border-2 bg-transparent p-2">
          <icons.plus width={24} height={24} />
        </Pressable>
      </View>

      <View className="mt-3 gap-3">
        {subjects.map((subject, index) => (
          <TextInput
            key={index}
            value={subject}
            onChangeText={(value) => handleChangeSubject(index, value)}
            placeholder={`Asignatura ${index + 1}`}
            className="rounded-lg border-2 p-3 text-base text-neutral-800"
          />
        ))}
      </View>

      <Pressable
        onPress={handleConfirm}
        disabled={isLoading}
        className="mt-6 rounded-lg bg-green border-2 p-4 disabled:opacity-60"
      >
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-center text-base font-medium text-black">Comenzar</Text>
        )}
      </Pressable>
    </ScreenScroll>
  )
}
