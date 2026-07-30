import 'dotenv/config'
import { readFileSync } from "fs"
import admin from "firebase-admin"

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!serviceAccountPath) {
  console.error("Missing GOOGLE_APPLICATION_CREDENTIALS environment variable")
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"))
}
catch (err) {
  console.error(`Failed to read service account file: ${err.message}`)
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const batch = db.batch()

const userId = "test-user-001"
const careerId = "tecnicatura-universitaria-en-programacion-full-stack"
const careerRef = db.collection("careers").doc(careerId)
batch.set(careerRef, { name: "Tecnicatura Universitaria en Programación Full Stack", userId })

const subjects = [
  { name: "Metodologías de Resolución de Problemas", careerId, plan: "2026", userId },
  { name: "Arquitectura de Computadoras", careerId, plan: "2026", userId },
  { name: "Bases de Datos 2", careerId, plan: "2026", userId },
  { name: "Programación 1", careerId, plan: "2026", userId },
  { name: "Diseños y Arquitectura de Despliegue 1", careerId, plan: "2026", userId },
]

for (const subject of subjects) {
  const docId = subject.name.toLowerCase().replace(/\s+/g, "-")
  const docRef = db.collection("subjects").doc(docId)
  batch.set(docRef, subject, { merge: true })
}

try {
  await batch.commit()
  console.log(`Seeded 1 career(s) and ${subjects.length} subject(s) successfully.`)
}
catch (err) {
  console.error(`Failed to seed: ${err.message}`)
  process.exitCode = 1
}

const userRef = db.collection("users").doc(userId)
try {
  await userRef.set({
    uid: userId,
    alias: "martin-gonzales",
    email: "martin.gonzales@example.com",
    displayName: "Martin Gonzales",
    photoURL: "https://ui-avatars.com/api/?name=Martin+Gonzales",
    createdAt: new Date().toISOString(),
  })
  console.log("Seeded 1 user(s) successfully.")
}
catch (err) {
  console.error(`Failed to seed user: ${err.message}`)
  process.exitCode = 1
}

const evaluationData = {
  title: "Primer parcial de análisis",
  type: "partial",
  date: "2026-06-15",
  grade: null,
  link: "",
}

try {
  await db
    .collection("subjects")
    .doc("programación-1")
    .collection("evaluations")
    .add(evaluationData)
  console.log("Seeded 1 evaluation(s) successfully.")
}
catch (err) {
  console.error(`Failed to seed evaluation: ${err.message}`)
  process.exitCode = 1
}
const notes = [
  { subject: "programación-1", content: "Repasar funciones de orden superior" },
  { subject: "metodologías-de-resolución-de-problemas", content: "TP grupal entregar el viernes" },
]

for (const note of notes) {
  try {
    await db
      .collection("subjects")
      .doc(note.subject)
      .collection("notes")
      .add({
        subjectId: note.subject,
        content: note.content,
        createdAt: new Date().toISOString(),
      })
    console.log(`Seeded note in '${note.subject}' successfully.`)
  }
  catch (err) {
    console.error(`Failed to seed note in '${note.subject}': ${err.message}`)
    process.exitCode = 1
  }
}

const reminders = [
  {
    subject: "metodologías-de-resolución-de-problemas",
    title: "Inscripción a materias",
    items: [],
    expiresAt: "2026-08-15",
  },
]

for (const reminder of reminders) {
  try {
    await db
      .collection("subjects")
      .doc(reminder.subject)
      .collection("reminders")
      .add({
        subjectId: reminder.subject,
        title: reminder.title,
        items: reminder.items,
        expiresAt: reminder.expiresAt,
        createdAt: new Date().toISOString(),
      })
    console.log(`Seeded reminder in '${reminder.subject}' successfully.`)
  }
  catch (err) {
    console.error(`Failed to seed reminder in '${reminder.subject}': ${err.message}`)
    process.exitCode = 1
  }
  finally {
    await admin.app().delete()
  }
}
