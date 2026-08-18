import { Schedule } from "@/types/subject"

const DAYS_MAP: Record<string, number> = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
}

export type ScheduleStatus = "not-today" | "tomorrow" | "no-time" | "before" | "during" | "after"

export interface ScheduleTimeInfo {
  status: ScheduleStatus
  minutesUntilStart: number | null
  minutesUntilEnd: number | null
}

function parseTimeToday(time: string, now: Date): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const date = new Date(now)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function getScheduleTimeInfo(schedule: Schedule, now: Date = new Date()): ScheduleTimeInfo {
  const scheduleDay = DAYS_MAP[schedule.day]
  const todayIndex = now.getDay()
  const tomorrowIndex = (todayIndex + 1) % 7

  if (scheduleDay === tomorrowIndex) {
    return { status: "tomorrow", minutesUntilStart: null, minutesUntilEnd: null }
  }

  if (scheduleDay !== todayIndex) {
    return { status: "not-today", minutesUntilStart: null, minutesUntilEnd: null }
  }

  if (!schedule.startTime || !schedule.endTime) {
    return { status: "no-time", minutesUntilStart: null, minutesUntilEnd: null }
  }

  const start = parseTimeToday(schedule.startTime, now)
  const end = parseTimeToday(schedule.endTime, now)

  if (now < start) {
    const minutesUntilStart = Math.ceil((start.getTime() - now.getTime()) / 60000)
    return { status: "before", minutesUntilStart, minutesUntilEnd: null }
  }

  if (now >= start && now <= end) {
    const minutesUntilEnd = Math.ceil((end.getTime() - now.getTime()) / 60000)
    return { status: "during", minutesUntilStart: null, minutesUntilEnd }
  }

  return { status: "after", minutesUntilStart: null, minutesUntilEnd: null }
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) return `${hours}h ${mins}min`
  return `${mins}min`
}

const TODAY_STATUSES: ScheduleStatus[] = ["before", "during", "after", "no-time"]

export function getUpcomingScheduleLabel(schedules?: Schedule[], now: Date = new Date()): string | null {
  if (!schedules || schedules.length === 0) return null

  const todaySchedule = schedules.find(
    (schedule) => TODAY_STATUSES.includes(getScheduleTimeInfo(schedule, now).status)
  )
  if (todaySchedule) {
    return `Hoy ${todaySchedule.startTime ? `${todaySchedule.startTime}hs` : ""}`
  }

  const tomorrowSchedule = schedules.find(
    (schedule) => getScheduleTimeInfo(schedule, now).status === "tomorrow"
  )
  if (tomorrowSchedule) {
    return `Mañana ${tomorrowSchedule.startTime ? `${tomorrowSchedule.startTime}hs` : ""}`
  }

  return null
}
