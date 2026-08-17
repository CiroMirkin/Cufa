import { format } from "@formkit/tempo"
import { evaluationToDate } from "./date"

export function formatDate(date: { date: string; time?: string }) {
  try {
    if (date.time) {
      return format(evaluationToDate(date), { date: "short", time: "short" }, "es-AR")
    }
    return format(evaluationToDate(date), "short", "es-AR")
  }
  catch {
    return date.date
  }
}
