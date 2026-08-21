import { useEffect, useState } from "react"
import { Schedule } from "@/types/subject"
import { getScheduleTimeInfo, ScheduleTimeInfo } from "@/lib/schedule"

export function useScheduleTimeInfo(schedule: Schedule): ScheduleTimeInfo {
  const [info, setInfo] = useState<ScheduleTimeInfo>(() =>
    getScheduleTimeInfo(schedule),
  )

  useEffect(() => {
    const update = () => setInfo(getScheduleTimeInfo(schedule))
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [schedule])

  return info
}
