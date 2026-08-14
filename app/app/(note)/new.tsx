import { router } from "expo-router"
import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import NoteInput from "@/components/note/note-input"

export default function NewNoteScreen() {
    const { subjectId } = useLocalSearchParams<{ subjectId?: string }>()

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ title: "Nueva nota" }} />
            <NoteInput
                subjectId={subjectId ?? null}
                onDone={() => router.back()}
            />
        </View>
    )
}
