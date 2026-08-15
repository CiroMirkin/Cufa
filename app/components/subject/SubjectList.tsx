import { FlatList, Text } from "react-native"
import { Link } from "expo-router"
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
      contentContainerClassName="gap-4 px-4 pt-4"
      renderItem={({ item }) => (
        <Link
        href={{
            pathname: "/(tabs)/(subject)/[id]",
            params: { id: item.id },
        }}
          className="flex-row items-center justify-between rounded-lg border-2 border-black bg-green p-4"
        >
          <Text className="text-xl font-medium text-black">
            {item.name}
          </Text>
        </Link>
      )}
    />
  )
}
