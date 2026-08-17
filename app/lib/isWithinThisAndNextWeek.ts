import { getWeekRange } from "./getWeekRange"

export function isWithinThisAndNextWeek(date: Date) {
  const { start } = getWeekRange(0)
  const { end } = getWeekRange(1)
  return date >= start && date <= end
}
