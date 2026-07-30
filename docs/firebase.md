# Firebase

## Configuración inicial

### Variables de entorno (`app/.env.example`)

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Inicialización (`src/lib/firebase.ts`)

```ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export { app }
export const db = getFirestore(app)
```

No se usa `getAnalytics` ni `getStorage`.

---

## Autenticación

### Provider: Google

Archivo: `src/auth/auth.ts`

```ts
const googleProvider = new GoogleAuthProvider()
export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}
```

### AuthContext (`src/auth/AuthContext.tsx`)

Escucha cambios de sesión con `onAuthStateChanged`. Expone `{ user, loading }`.

### ProtectedRoute (`src/auth/ProtectedRoute.tsx`)

Verifica en orden:
1. Auth loading termina
2. Usuario autenticado
3. Documento `users/{uid}` existe en Firestore

Si algo falla, redirige a `/login` o `/onboarding`.

---

## Patrón de acceso a datos

### Estructura general de hooks

Cada entidad sigue el mismo patrón:

```ts
// 1. Referencias a colecciones
function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "documents")
}

// 2. Queries con react-query
export function useDocuments(subjectId: string) {
  return useQuery({
    queryKey: ["documents", subjectId],
    queryFn: () => fetchDocuments(subjectId),
  })
}

// 3. Mutations con invalidación automática
export function useCreateDocument(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => addDoc(getDocsRef(subjectId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", subjectId] })
    },
  })
}
```

### Reglas del patrón

- Las subcolecciones (documents, evaluations, notes) reciben `subjectId` como parámetro en cada hook; la referencia se construye dentro del hook, no es global.
- Las colecciones raíz (careers, subjects, users) tienen referencias globales (`const careersRef = collection(db, "careers")`).
- Las queries se deshabilitan con `enabled: !!uid` si falta el parámetro.
- Las mutations invalidan queries relacionadas en `onSuccess`.
- `useUpdateDocument` y `useUpdateEvaluation` además hacen `setQueryData` optimista.

### Colecciones y subcolecciones

| Path | Tipo | Hook |
|---|---|---|
| `careers/{id}` | Documento | `useCareers` |
| `subjects/{id}` | Documento | `useSubjects` |
| `users/{id}` | Documento | `useUsers` |
| `subjects/{id}/documents/{id}` | Subcolección | `useDocuments` |
| `subjects/{id}/evaluations/{id}` | Subcolección | `useEvaluations` |
| `subjects/{id}/notes/{id}` | Subcolección | `useNotes` |

### Seed script

Existe `seed/seed.mjs` que usa `firebase-admin` con service account para poblar datos de prueba. Se ejecuta con Node.js, no depende del frontend.
