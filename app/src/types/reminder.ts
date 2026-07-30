
export interface ReminderItem {
  text: string
  checked: boolean
}

export interface Reminder {
  id: string
  subjectId: string
  title: string
  items: ReminderItem[]
  expiresAt: string
  createdAt: string
}
