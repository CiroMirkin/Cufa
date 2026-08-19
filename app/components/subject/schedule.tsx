import { Schedule as ScheduleType } from "@/types/subject"
import { Text, View } from "react-native"
import { useScheduleTimeInfo } from "@/hooks/useScheduleTimeInfo"
import { formatMinutes, getMostProximateSchedule, sortSchedulesByDay } from "@/lib/schedule"
import clsx from "clsx"

interface Props {
    schedules?: ScheduleType[]
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
    const dayLabel = itIsToday ? "Hoy" : schedule.day
    const isDimmed = !itIsToday && !isProximate

    return (
        <View className={clsx("px-2 pr-3", !isLast && "border-r-2", isDimmed && "opacity-70")}>
            {status !== "tomorrow" &&
                <View className="flex-col gap-px items-start">
                    <Text className="text-xs font-semibold">{dayLabel}</Text>
                    <Text className="text-2xl font-semibold">
                        {schedule.startTime ? `${schedule.startTime}hs` : ""}
                    </Text>
                </View>
            }
            {status === "tomorrow" && (
                <View className="flex-col gap-px items-start">
                    <Text className="text-xs font-semibold">{schedule.startTime && "Mañana"}</Text>
                    <Text className="text-2xl font-semibold">
                        {schedule.startTime ? `${schedule.startTime}hs` : "Mañana"}
                    </Text>
                </View>
            )}
            {status === "before" && minutesUntilStart !== null && (
                <Text className="text-xs font-semibold">Empieza en {formatMinutes(minutesUntilStart)}</Text>
            )}
            {status === "during" && minutesUntilEnd !== null && (
                <Text className="text-xs font-semibold">Termina en {formatMinutes(minutesUntilEnd)}</Text>
            )}
        </View>
    )
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
