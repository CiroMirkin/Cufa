import AsyncStorage from "@react-native-async-storage/async-storage"
import { Subject } from "@/types/subject"
import { Note } from "@/types/note"
import { Evaluation } from "@/types/evaluation"

const SUBJECTS_KEY = "subjects"

export async function getSubjects(): Promise<Subject[]> {
  const raw = await AsyncStorage.getItem(SUBJECTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function saveSubjects(subjects: Subject[]) {
  await AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects))
}

const NOTES_KEY = "notes"

export async function getNotes(): Promise<Note[]> {
  const raw = await AsyncStorage.getItem(NOTES_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function saveNotes(notes: Note[]) {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

const EVALUATIONS_KEY = "evaluations"

export async function getEvaluations(): Promise<Evaluation[]> {
  const raw = await AsyncStorage.getItem(EVALUATIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function saveEvaluations(evaluations: Evaluation[]) {
  await AsyncStorage.setItem(EVALUATIONS_KEY, JSON.stringify(evaluations))
}
