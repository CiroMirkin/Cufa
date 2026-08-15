import { Evaluation, EvaluationType } from "@/types/evaluation";
import { Subject } from "@/types/subject";
import { useState } from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { TYPE_LABELS } from "@/types/evaluation";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/date";

function EvaluationEditItem({
  evaluation,
  subjects,
  onSave,
  onCancel,
}: {
  evaluation: Evaluation
  subjects: Subject[]
  onSave: (updates: Partial<Omit<Evaluation, "id">>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(evaluation.title)
  const [date, setDate] = useState(() => parseDateTimeLocal(evaluation.date))
  const [showPicker, setShowPicker] = useState(false)
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date")
  const [type, setType] = useState<EvaluationType>(evaluation.type)
  const [note, setNote] = useState(evaluation.note || "")
  const [link, setLink] = useState(evaluation.link || "")
  const [topicsRaw, setTopicsRaw] = useState(evaluation.topics?.join(", ") || "")
  const [subjectId, setSubjectId] = useState(evaluation.subjectId)

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false)
    if (selectedDate) {
      const current = new Date(date)
      if (pickerMode === "date") {
        current.setFullYear(selectedDate.getFullYear())
        current.setMonth(selectedDate.getMonth())
        current.setDate(selectedDate.getDate())
        if (Platform.OS === "android") {
          setPickerMode("time")
          setShowPicker(true)
        }
      } else {
        current.setHours(selectedDate.getHours())
        current.setMinutes(selectedDate.getMinutes())
      }
      setDate(current)
    }
  }

  const openDatePicker = () => {
    setPickerMode("date")
    setShowPicker(true)
  }

  const handleSave = () => {
    if (!title.trim() || !subjectId) return
    const topics = topicsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    onSave({
      subjectId,
      title: title.trim(),
      date: formatDateTimeLocal(date),
      type,
      note: note.trim() || undefined,
      link: link.trim() || undefined,
      topics: topics.length > 0 ? topics : undefined,
    })
  }

  return (
    <View className="gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <Text className="text-sm font-semibold text-blue-800">Editar evaluación</Text>

      <View className="flex-row flex-wrap gap-2">
        {subjects.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSubjectId(s.id)}
            className={`rounded-full px-3 py-1.5 ${
              subjectId === s.id ? "bg-blue-500" : "bg-white"
            }`}
          >
            <Text
              className={`text-xs ${
                subjectId === s.id ? "text-white" : "text-neutral-700"
              }`}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nombre"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />

      <Pressable
        onPress={openDatePicker}
        className="rounded-lg border border-neutral-300 bg-white p-2"
      >
        <Text className="text-sm text-neutral-800">
          {formatDateTimeLocal(date).replace("T", " ")}
        </Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}

      <View className="flex-row flex-wrap gap-2">
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setType(value as EvaluationType)}
            className={`rounded-full px-3 py-1.5 ${
              type === value ? "bg-blue-500" : "bg-white"
            }`}
          >
            <Text
              className={`text-xs ${
                type === value ? "text-white" : "text-neutral-700"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={2}
        placeholder="Notas"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />
      <TextInput
        value={link}
        onChangeText={setLink}
        placeholder="Enlace"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />
      <TextInput
        value={topicsRaw}
        onChangeText={setTopicsRaw}
        placeholder="Temas separados por coma"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />

      <View className="flex-row justify-end gap-2">
        <Pressable
          onPress={onCancel}
          className="rounded-lg bg-neutral-200 px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-neutral-700">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          className="rounded-lg bg-blue-500 px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-white">Guardar</Text>
        </Pressable>
      </View>
    </View>
  )
}


export default EvaluationEditItem
