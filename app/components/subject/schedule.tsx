import { Schedule as ScheduleType } from "@/types/subject"
import { Text, View } from "react-native"
import { useScheduleTimeInfo } from "@/hooks/useScheduleTimeInfo"
import { formatMinutes } from "@/lib/schedule"

interface Props {
    schedules?: ScheduleType[]
}

interface ItemProps {
    schedule: ScheduleType
}

const TODAY_STATUSES = ["before", "during", "after", "no-time"] 

function ScheduleItem({ schedule }: ItemProps) {
    const { status, minutesUntilStart, minutesUntilEnd } = useScheduleTimeInfo(schedule)
    const dayLabel = TODAY_STATUSES.includes(status) ? "Hoy" : schedule.day
 
    return (
        <View className="">
            {status !== "tomorrow" && 
                <View className="flex-row gap-2 items-end">
                    <Text className="text-xl font-semibold">{dayLabel}</Text>
                    <Text className="text-xl font-semibold">
                        {schedule.startTime ? `${schedule.startTime}hs` : ""}
                    </Text>
                </View>
            }
            {status === "tomorrow" && (
                <Text>{schedule.startTime ? `Mañana a las ${schedule.startTime}hs` : "Mañana"}</Text>
            )}
            {status === "before" && minutesUntilStart !== null && (
                <Text>Empieza en {formatMinutes(minutesUntilStart)}</Text>
            )}
            {status === "during" && minutesUntilEnd !== null && (
                <Text>Termina en {formatMinutes(minutesUntilEnd)}</Text>
            )}
        </View>
    )
}
 
function Schedule({ schedules }: Props) {
    console.log(schedules)
    if (!schedules || schedules.length === 0) return;

    return (
        <View className="p-4 mb-4 bg-[#fdf28b] rounded-lg border-2 flex gap-2">
            {schedules.map((schedule, index) => (
                <ScheduleItem key={index} schedule={schedule} />
            ))}
        </View>
    )
}

export default Schedule
