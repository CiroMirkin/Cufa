import { Task } from "@/types/task"

export function isTaskUrgent(task: Task, now: Date = new Date()): boolean {
    if (task.done || !task.date) return false

    const [year, month, day] = task.date.split("-").map(Number)
    const dueDate = new Date(year, month - 1, day)
    dueDate.setHours(23, 59, 59, 999)

    const msUntilDue = dueDate.getTime() - now.getTime()
    const daysUntilDue = msUntilDue / (1000 * 60 * 60 * 24)

    return daysUntilDue <= 4
}
