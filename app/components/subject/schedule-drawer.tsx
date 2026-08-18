import { useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import clsx from "clsx"
import Drawer from "@/components/ui/drawer"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { formatTimeLocal } from "@/lib/date"

interface Props {
  visible: boolean
  onClose: () => void
  subjectId: string
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

interface FormState {
  day: string
  startTime: Date | null
  endTime: Date | null
  showPicker: boolean
  pickerMode: "start" | "end"
}

function getInitialState(): FormState {
  return {
    day: days[0],
    startTime: null,
    endTime: null,
    showPicker: false,
    pickerMode: "start",
  }
}

export default function ScheduleDrawer({ visible, onClose, subjectId }: Props) {
  const addSchedule = useSubjectsStore((s) => s.addSchedule)
  const [form, setForm] = useState<FormState>(getInitialState)

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openPicker = (mode: "start" | "end") => {
    setForm((prev) => ({ ...prev, pickerMode: mode, showPicker: true }))
  }

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === "android") updateField("showPicker", false)
    if (selectedTime) {
      if (form.pickerMode === "start") {
        updateField("startTime", selectedTime)
      }
      else {
        updateField("endTime", selectedTime)
      }
    }
  }

  const handleCreate = () => {
    addSchedule(subjectId, {
      day: form.day,
      startTime: form.startTime ? formatTimeLocal(form.startTime) : undefined,
      endTime: form.endTime ? formatTimeLocal(form.endTime) : undefined,
    })
    setForm(getInitialState())
    onClose()
  }

  const handleCancel = () => {
    setForm(getInitialState())
    onClose()
  }

  return (
    <Drawer visible={visible} onClose={handleCancel}>
      <Text className="mb-3 text-lg font-bold text-neutral-800">
        Nuevo horario
      </Text>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Día *</Text>
        <View className="flex-row flex-wrap gap-2">
          {days.map((d) => (
            <Pressable
              key={d}
              onPress={() => updateField("day", d)}
              className={clsx(
                "rounded-full px-3 py-1.5",
                form.day === d ? "bg-blue" : "bg-neutral-200"
              )}
            >
              <Text
                className={clsx(
                  "text-sm font-medium",
                  form.day === d ? "text-white" : "text-black"
                )}
              >
                {d}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-3 flex-row gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-medium text-black">Hora de inicio</Text>
          <Pressable
            onPress={() => openPicker("start")}
            className="w-full rounded-lg border border-black bg-white p-3"
          >
            <Text className="text-base text-black">
              {form.startTime ? formatTimeLocal(form.startTime) : "--:--"}
            </Text>
          </Pressable>
          {form.startTime && (
            <Pressable onPress={() => updateField("startTime", null)} className="self-end">
              <Text className="text-sm text-red underline">Quitar hora</Text>
            </Pressable>
          )}
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-base font-medium text-black">Hora de fin</Text>
          <Pressable
            onPress={() => openPicker("end")}
            className="w-full rounded-lg border border-black bg-white p-3"
          >
            <Text className="text-base text-black">
              {form.endTime ? formatTimeLocal(form.endTime) : "--:--"}
            </Text>
          </Pressable>
          {form.endTime && (
            <Pressable onPress={() => updateField("endTime", null)} className="self-end">
              <Text className="text-sm text-red underline">Quitar hora</Text>
            </Pressable>
          )}
        </View>
      </View>

      {form.showPicker && (
        <DateTimePicker
          value={(form.pickerMode === "start" ? form.startTime : form.endTime) ?? new Date()}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTime}
        />
      )}

      <View className="mt-4 flex-row justify-end gap-3">
        <Pressable onPress={handleCancel} className="px-4 py-2 bg-neutral-100 border-2 border-neutral-300 rounded-lg">
          <Text className="text-sm text-neutral-500">Cancelar</Text>
        </Pressable>
        <Pressable onPress={handleCreate} className="rounded-lg bg-green border-2 px-4 py-2">
          <Text className="text-sm font-medium text-black">Crear</Text>
        </Pressable>
      </View>
    </Drawer>
  )
}
