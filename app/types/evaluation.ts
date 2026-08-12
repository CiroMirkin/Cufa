
export type EvaluationType = "partial" | "final" | "retake" | "practical_work" | "presentation"

export interface Evaluation {
  id: string
  subjectId: string

  title: string
  note: string
  type: EvaluationType

  date: string
  link: string
}
