import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { Evaluation } from "@/types/evaluation"
import { evaluationToDate } from "@/lib/date"

const CHANNEL_ID = "evaluations"
const REMINDER_HOUR = 10
const REMINDER_MINUTE = 0
const DAYS_BEFORE = [5, 4, 3, 2, 1]

const syncedSignatures = new Map<string, string>()

export function setNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    })
}

export async function ensurePermissionsAsync(): Promise<boolean> {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: "Evaluaciones",
            importance: Notifications.AndroidImportance.DEFAULT,
        })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    if (existingStatus === "granted") return true

    const { status } = await Notifications.requestPermissionsAsync()
    return status === "granted"
}

function getSignature(evaluation: Pick<Evaluation, "date" | "time">): string {
    return `${evaluation.date}|${evaluation.time ?? ""}`
}

function getReminderDates(evaluation: Pick<Evaluation, "date" | "time">): Date[] {
    const evaluationDate = evaluationToDate(evaluation)
    const now = new Date()

    return DAYS_BEFORE.map((daysBefore) => {
        const reminderDate = new Date(evaluationDate)
        reminderDate.setDate(reminderDate.getDate() - daysBefore)
        reminderDate.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0)
        return reminderDate
    }).filter((date) => date.getTime() > now.getTime())
}

export async function cancelEvaluationReminders(
    evaluation: Pick<Evaluation, "notificationIds">
): Promise<void> {
    if (!evaluation.notificationIds?.length) return
    await Promise.all(
        evaluation.notificationIds.map((id) =>
            Notifications.cancelScheduledNotificationAsync(id).catch(() => { })
        )
    )
}

export async function scheduleEvaluationReminders(evaluation: Evaluation): Promise<string[]> {
    await cancelEvaluationReminders(evaluation)

    const dates = getReminderDates(evaluation)

    const results = await Promise.all(
        dates.map(async (date) => {
            try {
                return await Notifications.scheduleNotificationAsync({
                    content: {
                        title: evaluation.title,
                        body: "Tenés una evaluación próxima.",
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date,
                        channelId: CHANNEL_ID,
                    },
                })
            }
            catch {
                return null
            }
        })
    )

    return results.filter((id): id is string => id !== null)
}

export async function syncAllReminders(
    evaluations: Evaluation[],
    updateEvaluation: (id: string, changes: Partial<Omit<Evaluation, "id">>) => void
): Promise<void> {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    for (const evaluation of evaluations) {
        const isFuture = evaluationToDate(evaluation).getTime() >= startOfToday.getTime()
        const signature = getSignature(evaluation)

        if (!isFuture) {
            if (evaluation.notificationIds?.length) {
                await cancelEvaluationReminders(evaluation)
                updateEvaluation(evaluation.id, { notificationIds: [] })
            }
            syncedSignatures.delete(evaluation.id)
            continue
        }

        const alreadySynced =
            syncedSignatures.get(evaluation.id) === signature && !!evaluation.notificationIds?.length
        if (alreadySynced) continue

        const ids = await scheduleEvaluationReminders(evaluation)
        syncedSignatures.set(evaluation.id, signature)
        updateEvaluation(evaluation.id, { notificationIds: ids })
    }
}

export async function cancelOrphanReminders(
    previousEvaluations: Evaluation[],
    currentEvaluations: Evaluation[]
): Promise<void> {
    const currentIds = new Set(currentEvaluations.map((e) => e.id))
    const deleted = previousEvaluations.filter((e) => !currentIds.has(e.id))

    await Promise.all(
        deleted.map((evaluation) => {
            syncedSignatures.delete(evaluation.id)
            return cancelEvaluationReminders(evaluation)
        })
    )
}
