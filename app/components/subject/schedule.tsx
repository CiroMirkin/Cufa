import { Schedule as ScheduleType } from "@/types/subject"
import { View } from "react-native"
import { getMostProximateSchedule, sortSchedulesByDay } from "@/lib/schedule"
import ScheduleItem from "./schedule-item"

interface Props {
    schedules?: ScheduleType[]
}

function Schedule({ schedules }: Props) {
    if (!schedules || schedules.length === 0) return null

    const sortedSchedules = sortSchedulesByDay(schedules)
    const proximate = getMostProximateSchedule(schedules)

    return (
        <View className="py-4 px-2 mb-4 bg-yellow rounded-lg border-2 flex-row gap-2">
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
