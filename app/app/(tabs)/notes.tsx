import { Text, View } from "react-native"
import { useState } from "react"
import NoteList from "@/components/note/note-list"
import ScreenScroll from "@/components/screen-scroll"
import { icons } from "@/constants/icons"
import { Link } from "expo-router"
import { useNotesStore } from "@/stores/notesStore"
import EmptySpace from "@/components/ui/empty-space"

export default function Notes() {
  const { notes } = useNotesStore()

  return (
    <ScreenScroll>
      <View className="flex-row items-center justify-between px-4 pt-6">
        <Text className="text-2xl font-bold text-black">Notas</Text>
        <Link href="/(tabs)/note/new" className="h-12 w-12 rounded border-2 bg-white">
          <View className="h-full w-full items-center justify-center">
            <icons.plus width={24} height={24} />
          </View>
      </Link>
      </View>

      <View className="px-4">
        {!notes || !notes.length && <EmptySpace icon="library" message="Aun no tenés notas" />}
        
        <NoteList
          notes={notes}
          showSubjectName
          withoutSubjectFirst
        />
      </View>
    </ScreenScroll>
  )
}
