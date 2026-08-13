import NoteInput from "@/components/note/note-input"
import { Pressable, Text, View } from "react-native"
import { useState } from "react"
import NoteList from "@/components/note/note-list"

export default function Notes() {
    const [notesInputVisible, setNotesInputVisible] = useState(false)

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 pt-4">
              <Text className="text-xl font-bold text-blue-500">Notas</Text>
              <Pressable
                onPress={() => setNotesInputVisible(true)}
                className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
              >
                <Text className="text-lg font-bold text-white">+</Text>
              </Pressable>
            </View>
            { notesInputVisible && (
                <NoteInput subjectId={null} />
            )}
            <NoteList subjectId={null} />
        </View>
    )
}
