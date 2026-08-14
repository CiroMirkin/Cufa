import { Link } from "expo-router"
import { Text } from "react-native"
import { Note } from "@/types/note"

interface Props {
    note: Note
    subjectName?: string
}

function firstLine(content: string) {
    return content.split("\n")[0]
}

export default function NoteItem({ note, subjectName }: Props) {
    return (
        <Link
            href={{
                pathname: "/(note)/[id]",
                params: { id: note.id }
            }}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3"
        >
            {!subjectName && (
                <Text className="mb-1 self-start rounded border px-1 text-xs text-neutral-500">
                    Sin asignatura
                </Text>
            )}
            {subjectName && (
                <Text className="mb-1 self-start rounded border px-1 text-xs text-neutral-800">
                    {subjectName}
                </Text>
            )}

            <Text numberOfLines={1} className="text-base text-neutral-800">
                {firstLine(note.content)}
            </Text>
            
            <Text className="text-xs text-neutral-500">
                {new Date(note.createdAt).toLocaleString()}
            </Text>
        </Link>
    )
}
