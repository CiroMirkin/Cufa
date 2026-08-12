
export interface Note {
  id: string
  subjectId: string | null
  careerId: string

  content: string
  createdAt: string
}
