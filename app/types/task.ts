
export interface Task {
    id: string
    careerId: string
    subjectId?: string

    title: string
    done: boolean
    createdAt: string

    note?: string
    date?: string
    link?: string
}
