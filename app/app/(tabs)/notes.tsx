import { Text, View } from "react-native"
import { useState } from "react"
import NoteList from "@/components/note/note-list"
import ScreenScroll from "@/components/screen-scroll"
import { icons } from "@/constants/icons"
import { Link } from "expo-router"

export default function Notes() {
  const [notesInputVisible, setNotesInputVisible] = useState(false)

  return (
    <ScreenScroll>
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-2xl font-bold text-blue">Notas</Text>
        <Link
          href={{ pathname: "/(tabs)/note/new", params: { subjectId: null } }}
          className="rounded border-2 bg-blue p-2"
        >
          <icons.plus width={24} height={24} />
        </Link>
      </View>

      <NoteList subjectId={null} withoutSubjectFirst />
    </ScreenScroll>
  )
}
