import { MODALITY_LABELS, ScheduleModality, Schedule as ScheduleType } from "@/types/subject"
import { Text, View } from "react-native"
import { useScheduleTimeInfo } from "@/hooks/useScheduleTimeInfo"
import { formatMinutes, getMostProximateSchedule, sortSchedulesByDay } from "@/lib/schedule"
import clsx from "clsx"

interface LabelProps {
    label: string
    time?: string
    modality?: ScheduleModality
}

function ScheduleLabel({ label, time, modality }: LabelProps) {
    return (
        <View className="flex-col gap-px items-start">
            <View className="flex-row gap-2 items-center">
                <Text className="text-xs font-bold">{label}</Text>
                {modality &&
                <Text className={clsx(
                    "text-xs font-semibold rounded p-px px-1",
                    modality == "in_person" ? "bg-green/70" : "bg-blue/50",
                )}>
                    {MODALITY_LABELS[modality]}
                </Text>
                }
            </View>
            <Text className="text-2xl font-semibold">
                {time ? `${time}hs` : ""}
            </Text>
        </View>
    )
}

interface ItemProps {
    schedule: ScheduleType
    isLast: boolean
    isProximate: boolean
}

const TODAY_STATUSES = ["before", "during", "after", "no-time"]

function ScheduleItem({ schedule, isLast, isProximate }: ItemProps) {
    const { status, minutesUntilStart, minutesUntilEnd } = useScheduleTimeInfo(schedule)
    const itIsToday = TODAY_STATUSES.includes(status)
    const isDimmed = !itIsToday && !isProximate

    let label = schedule.day
    let time = schedule.startTime

    if (itIsToday) {
        label = "Hoy"
    }
    else if (status === "tomorrow") {
        label = schedule.startTime ? "Mañana" : ""
        time = schedule.startTime ?? "Mañana"
    }

    return (
        <View className={clsx("px-2 pr-3", !isLast && "border-r-2", isDimmed && "opacity-70")}>
            <ScheduleLabel label={label} time={time} modality={schedule.modality} />
            {status === "before" && minutesUntilStart !== null && (
                <Text className="text-xs font-semibold">Empieza en {formatMinutes(minutesUntilStart)}</Text>
            )}
            {status === "during" && minutesUntilEnd !== null && (
                <Text className="text-xs font-semibold">Termina en {formatMinutes(minutesUntilEnd)}</Text>
            )}
        </View>
    )
}

interface Props {
    schedules?: ScheduleType[]
}

function Schedule({ schedules }: Props) {
    if (!schedules || schedules.length === 0) return null

    const sortedSchedules = sortSchedulesByDay(schedules)
    const proximate = getMostProximateSchedule(schedules)

    return (
        <View className="py-4 px-2 mb-4 bg-[#fdf28b] rounded-lg border-2 flex-row gap-2">
            {sortedSchedules.map((schedule, index) => (
                <ScheduleItem
                    key={index}
                    schedule={schedule}
                    isLast={index === sortedSchedules.length - 1}
                    isProximate={proximate?.schedule === schedule}
                />
            ))}
        </View>
    )
}

export default Schedule
