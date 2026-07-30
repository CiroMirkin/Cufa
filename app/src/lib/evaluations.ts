import type { Evaluation, EvaluationType } from '@/types/evaluation'

export const evaluationTypes: { value: EvaluationType; label: string }[] = [
  { value: 'partial', label: 'Parcial' },
  { value: 'final', label: 'Final' },
  { value: 'retake', label: 'Recuperatorio' },
  { value: 'practical_work', label: 'TP' },
  { value: 'presentation', label: 'Presentación' },
]

export function getEvaluationTypeLabel(type: EvaluationType) {
  return evaluationTypes.find((t) => t.value === type)?.label ?? type
}

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'upcoming'

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function getDaysUntil(dateString: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = parseLocalDate(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}

export function getUrgencyLevel(dateString: string): UrgencyLevel {
  const daysUntil = getDaysUntil(dateString)
  if (daysUntil < 0) return 'overdue'
  if (daysUntil < 3) return 'critical'
  if (daysUntil < 6) return 'soon'
  return 'upcoming'
}

export function formatDaysUntilLabel(dateString: string) {
  const daysUntil = getDaysUntil(dateString)
  if (daysUntil < 0) {
    const days = Math.abs(daysUntil)
    return `Venció hace ${days} día${days === 1 ? '' : 's'}`
  }
  if (daysUntil === 0) return 'Vence hoy'
  if (daysUntil === 1) return 'Vence mañana'
  return `Vence en ${daysUntil} días`
}

export interface EvaluationWithSubject extends Evaluation {
  subjectName?: string
  careerId?: string
}
