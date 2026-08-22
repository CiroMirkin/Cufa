
export interface Subject {
  id: string
  careerId: string
  
  name: string
  schedules?: Schedule[]
}

export interface Schedule {
  id: string
  startTime?: string
  endTime?: string
  day: string
  modality?: ScheduleModality
}

export type ScheduleModality = "in_person" | "virtual"
export const MODALITY_LABELS: Record<ScheduleModality, string> = {
  in_person: "Presencial",
  virtual: "Virtual",
}
