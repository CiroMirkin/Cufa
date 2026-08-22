import { Alert, Pressable, Text, View } from "react-native"
import Drawer from "@/components/ui/drawer"
import { MODALITY_LABELS, Schedule as ScheduleType } from "@/types/subject"
import ButtonIcon from "../ui/button-icon"
import cn from "@/lib/cn"
import { getScheduleDuration } from "@/lib/schedule"

interface Props {
    visible: boolean
    onClose: () => void
    schedules: ScheduleType[]
    onEdit: (schedule: ScheduleType) => void
    onDelete: (schedule: ScheduleType) => void
}

export default function ScheduleDetailDrawer({ visible, onClose, schedules, onEdit, onDelete }: Props) {
    const handleDelete = (schedule: ScheduleType) => {
        Alert.alert(
            "Eliminar horario",
            "¿Estás seguro de que querés eliminar este horario?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => onDelete(schedule) },
            ]
        )
    }

    return (
        <Drawer visible={visible} onClose={onClose}>
            {schedules.map((schedule, index) => (
                <View
                    key={schedule.id}
                    className={cn(
                        "flex-row justify-between items-end gap-4 py-4",
                        index !== schedules.length - 1 && "border-b-2"
                    )}
                >
                    <View className="gap-1">
                        <View>
                            <View className="flex-row justify-start items-center gap-2">
                                <Text className="text-xl font-bold text-neutral-800">{schedule.day}</Text>
                                {schedule.modality && (
                                    <Text className={cn(
                                        "text-base font-semibold rounded py-px px-2",
                                        schedule.modality == "in_person" ? "bg-green/70" : "bg-blue/50",
                                    )}>
                                        {MODALITY_LABELS[schedule.modality]}
                                    </Text>
                                )}
                            </View>
                            <Text className="text-xs">{getScheduleDuration(schedule)}</Text>
                        </View>
                        <Text className="text-2xl font-semibold text-black">
                            {schedule.startTime && `${schedule.startTime}hs`}
                            {schedule.endTime && ` ---- ${schedule.endTime}hs`}
                        </Text>
                    </View>

                    <View className="flex-row justify-end gap-3">
                        <ButtonIcon icon="pencil" onPress={() => onEdit(schedule)} className="bg-blue" />
                        <ButtonIcon icon="trash" onPress={() => handleDelete(schedule)} className="bg-red" />
                    </View>
                </View>
            ))}
        </Drawer>
    )
}
