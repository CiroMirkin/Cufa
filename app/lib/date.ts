import { format, parse } from "@formkit/tempo"
import { Evaluation } from "@/types/evaluation"

const LOCALE = "es-AR"
const DATE_FORMAT = "YYYY-MM-DD"
const TIME_FORMAT = "HH:mm"
const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm"

export function formatDateLocal(date: Date): string {
  return format(date, DATE_FORMAT, LOCALE)
}

export function formatTimeLocal(date: Date): string {
  return format(date, TIME_FORMAT, LOCALE)
}

export function formatDateTimeLocal(date: Date): string {
  return format(date, DATETIME_FORMAT, LOCALE)
}

export function evaluationToDate(evaluation: Pick<Evaluation, "date" | "time">): Date {
  const result = parse(evaluation.date, DATE_FORMAT, LOCALE)
  if (evaluation.time) {
    const t = parse(evaluation.time, TIME_FORMAT, LOCALE)
    result.setHours(t.getHours(), t.getMinutes(), 0, 0)
  }
  else {
    result.setHours(0, 0, 0, 0)
  }
  return result
}

export function stringToLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function parseTimeLocal(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}
