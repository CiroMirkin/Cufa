
export interface Reminder {
  id: string
  subjectId: string
  title: string
  content?: string
  done: boolean
  expiresAt: string
  createdAt: string
}
