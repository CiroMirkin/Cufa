import { FlatList, Pressable, Text, View } from "react-native"
import { Link, router } from "expo-router"
import { Subject } from "@/types/subject"

interface Props {
  subjects: Subject[]
  onDelete: (id: string) => void
}

export default function SubjectList({ subjects, onDelete }: Props) {
  if (subjects.length === 0) {
    return (
      <Text className="mt-4 px-4 text-sm text-neutral-400">
        No hay asignaturas todavia.
      </Text>
    )
  }

  return (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item.id}
      className="flex-1"
      contentContainerClassName="gap-2 px-4 pt-4"
      renderItem={({ item }) => (
        <Link
        href={{
            pathname: "/subject/[id]",
            params: { id: item.id },
        }}
          className="flex-row items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
        >
          <Text className="text-base font-medium text-neutral-800">
            {item.name}
          </Text>
          <Pressable onPress={() => onDelete(item.id)} hitSlop={8} className="p-1.5">
            <Text className="text-red-500">Eliminar</Text>
          </Pressable>
        </Link>
      )}
    />
  )
}
