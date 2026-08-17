import { Text, View } from "react-native"
import { Link } from "expo-router"
import { Subject } from "@/types/subject"
import { icons } from "@/constants/icons"

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
    <View className="w-full border-2 rounded-lg mt-4 overflow-hidden">
      {subjects.map((item, index) => (
        <Link
          key={item.id}
          href={{
            pathname: "/(tabs)/(subject)/[id]",
            params: { id: item.id },
          }}
          className={`bg-orange ${
            index !== subjects.length - 1 ? "border-b-2 border-black" : ""
          }`}
        >
          <View className="w-full flex-row items-center justify-between p-4">
            <Text className="text-xl font-medium text-black">
              {item.name}
            </Text>
            <icons.chevron_right width={24} height={24} />
          </View>
        </Link>
      ))}
    </View>
  )
}
