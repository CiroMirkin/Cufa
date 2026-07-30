import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Calendar } from './ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Badge } from './ui/badge'
import {
  dateKey,
  formatDaysUntilLabel,
  getEvaluationTypeLabel,
  getUrgencyLevel,
  parseLocalDate,
  type EvaluationWithSubject,
  type UrgencyLevel,
} from '@/lib/evaluations'

interface EvaluationsCalendarProps {
  evaluations: EvaluationWithSubject[]
}

const urgencyDayClassNames: Record<UrgencyLevel, string> = {
  overdue:
    'bg-slate-200 text-slate-500 line-through hover:bg-slate-300',
  critical:
    'relative bg-red-100 text-red-900 hover:bg-red-200 after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-red-600',
  soon:
    'relative bg-orange-100 text-orange-900 hover:bg-orange-200 after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-orange-600',
  upcoming:
    'relative bg-emerald-100 text-emerald-900 hover:bg-emerald-200 after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-emerald-600',
}

export function EvaluationsCalendar({ evaluations }: EvaluationsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)

  // Muestra el mes siguiente si el día actual quedaría visible como "outside day" en su grilla
  const defaultMonth = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const year = today.getFullYear()
    const month = today.getMonth()
    const lastDay = new Date(year, month + 1, 0).getDate()
    const firstOfNext = new Date(year, month + 1, 1)
    const outsideDaysCount = firstOfNext.getDay()
    const daysLeft = lastDay - today.getDate()
    return daysLeft < outsideDaysCount ? firstOfNext : today
  }, [])

  const evaluationsByDate = useMemo(() => {
    const map = new Map<string, EvaluationWithSubject[]>()
    for (const evaluation of evaluations) {
      const key = dateKey(parseLocalDate(evaluation.date))
      const existing = map.get(key)
      if (existing) existing.push(evaluation)
      else map.set(key, [evaluation])
    }
    return map
  }, [evaluations])

  const datesByUrgency = useMemo(() => {
    const grouped: Record<UrgencyLevel, Date[]> = {
      overdue: [],
      critical: [],
      soon: [],
      upcoming: [],
    }
    for (const [key, dayEvaluations] of evaluationsByDate) {
      const level = getUrgencyLevel(dayEvaluations[0].date)
      grouped[level].push(parseLocalDate(key))
    }
    return grouped
  }, [evaluationsByDate])

  const multipleDates = useMemo(
    () =>
      Array.from(evaluationsByDate.values())
        .filter((list) => list.length > 1)
        .map((list) => parseLocalDate(list[0].date)),
    [evaluationsByDate]
  )

  function handleSelect(date: Date | undefined) {
    if (!date) return
    const key = dateKey(date)
    if (!evaluationsByDate.has(key)) return
    setSelectedDate(date)
    setOpen(true)
  }

  const selectedEvaluations = selectedDate
    ? evaluationsByDate.get(dateKey(selectedDate)) ?? []
    : []

  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        defaultMonth={defaultMonth}
        modifiers={{
          overdue: datesByUrgency.overdue,
          critical: datesByUrgency.critical,
          soon: datesByUrgency.soon,
          upcoming: datesByUrgency.upcoming,
          multiple: multipleDates,
        }}
        modifiersClassNames={{
          overdue: urgencyDayClassNames.overdue,
          critical: urgencyDayClassNames.critical,
          soon: urgencyDayClassNames.soon,
          upcoming: urgencyDayClassNames.upcoming,
          multiple: 'font-bold ring-1 ring-inset ring-current',
        }}
        className="rounded-md border"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </DialogTitle>
            <DialogDescription>
              {selectedEvaluations.length} trabajo{selectedEvaluations.length === 1 ? '' : 's'} ese día
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {selectedEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{evaluation.title}</p>
                  {evaluation.careerId && evaluation.subjectName ? (
                    <Link
                      to="/career/$career-id/subject/$subject-id"
                      params={{ 'career-id': evaluation.careerId, 'subject-id': evaluation.subjectId }}
                      className="text-sm font-medium text-primary underline"
                    >
                      {evaluation.subjectName}
                    </Link>
                  ) : evaluation.subjectName && (
                    <Badge variant="secondary">{evaluation.subjectName}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                  <span>{getEvaluationTypeLabel(evaluation.type)}</span>
                  <span>&middot;</span>
                  <span>{formatDaysUntilLabel(evaluation.date)}</span>
                  {evaluation.grade !== null && (
                    <>
                      <span>&middot;</span>
                      <span>Nota: {evaluation.grade}</span>
                    </>
                  )}
                </div>
                {evaluation.link && (
                  <a
                    href={evaluation.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline mt-1 inline-block"
                  >
                    Ver enlace
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
