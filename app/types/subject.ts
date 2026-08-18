
export interface Subject {
  id: string
  careerId: string
  
  name: string
  schedules?: Schedule[]
}

export interface Schedule {
  startTime?: string
  endTime?: string
  day: string
}
