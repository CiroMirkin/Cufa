
export type EvaluationType = "partial" | "final" | "retake" | "practical_work" | "presentation" | "task"

export interface Evaluation {
  id: string
  subjectId: string

  title: string
  note?: string
  type: EvaluationType

  date: string
  time?: string
  link?: string
  topics?: string[]
}

export const TYPE_LABELS: Record<EvaluationType, string> = {
  partial: "Parcial",
  final: "Final",
  retake: "Recuperatorio",
  practical_work: "TP",
  presentation: "Presentación",
  task: "Tarea",
}

