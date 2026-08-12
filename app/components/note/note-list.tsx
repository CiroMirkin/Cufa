import { Note } from "@/types/note"
import { FlatList, Pressable, Text, View } from "react-native"

interface Props {
  notes: Note[]
  onDelete: (index: number) => void
}

function NoteList({ notes, onDelete }: Props) {
  if (!notes || notes.length === 0) {
    return (
      <Text className="px-4 pt-4 text-sm text-neutral-400">
        No hay notas todavia.
      </Text>
    )
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(_, index) => `${index}`}
      className="w-full"
      contentContainerClassName="gap-2 px-4 pt-4"
      renderItem={({ item, index }) => (
        <View className="flex-row items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
          <View className="flex-1 gap-1">
            <Text className="text-sm text-neutral-800">{item.content}</Text>
            <Text className="text-xs text-neutral-400">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          <Pressable onPress={() => onDelete(index)} hitSlop={8} className="p-1.5">
            <Text className="text-red-500">Eliminar</Text>
          </Pressable>
        </View>
      )}
    />
  )
}

export default NoteList
