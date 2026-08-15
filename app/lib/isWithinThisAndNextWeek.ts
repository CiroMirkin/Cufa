import { getWeekRange } from "./getWeekRange"

export function isWithinThisAndNextWeek(dateStr: string) {
  const date = new Date(dateStr)
  const { start } = getWeekRange(0)
  const { end } = getWeekRange(1)
  return date >= start && date <= end
}
