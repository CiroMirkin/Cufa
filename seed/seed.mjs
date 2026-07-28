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

const subjects = [
  { name: "Análisis Matemático", careerId: "ingenieria", plan: "2026" },
]

const batch = db.batch()

for (const subject of subjects) {
  const docId = subject.name.toLowerCase().replace(/\s+/g, "-")
  const docRef = db.collection("subjects").doc(docId)
  batch.set(docRef, subject, { merge: true })
}

try {
  await batch.commit()
  console.log(`Seeded ${subjects.length} subject(s) successfully.`)
}
catch (err) {
  console.error(`Failed to seed subjects: ${err.message}`)
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
    .doc("analisis-matematico")
    .collection("evaluations")
    .add(evaluationData)
  console.log("Seeded 1 evaluation(s) successfully.")
}
catch (err) {
  console.error(`Failed to seed evaluation: ${err.message}`)
  process.exitCode = 1
}
finally {
  await admin.app().delete()
}
