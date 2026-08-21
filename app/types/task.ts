
export interface Task {
    id: string
    subjectId?: string

    title: string
    done: boolean
    createdAt: string

    note?: string
    date?: string
    link?: string
}
