# SPEC 01 — Firebase + subjects read-only

> **Status:** Draft · **Depends on:** SPEC 00 · **Date:** 2026-07-25
> **Objective:** Configurar Firebase Firestore, consumir subjects (materias) en solo lectura vía TanStack Query, y crear un script de seed con Admin SDK.

---

## Scope

**In:**

- Configuración de Firebase Firestore con credenciales vía `import.meta.env.VITE_FIREBASE_*`.
- Inicialización de la app de Firebase y export del objeto `db` (Firestore) listo para usar.
- Definición del tipo `Subject` en TypeScript: `{ id, name, careerId, plan }`.
- Creación de una query hook `useSubjects()` con TanStack Query que lee todos los subjects desde Firestore.
- Integración del hook en la UI existente: reemplazar el link hardcodeado "Analisis sistemico" por una lista de subjects obtenida de Firestore.
- Script de seed ejecutable en `seed/seed.mjs` que inserta subjects en Firestore usando `firebase-admin`.
- El seed incluye al menos la materia "Análisis Matemático" con `careerId: "ingenieria"`.

**Out of scope (for future specs):**

- Firebase Auth.
- Escritura, edición o eliminación de subjects desde la UI.
- Las demás entidades del MVP (materiaInstancia, TPs, evaluaciones, temas, apuntes, notes) — siguen para futuros specs.
- localStorage — el MVP original lo contemplaba, pero este spec migra subjects a Firestore. El resto queda pendiente de definición.
- Migración de datos existentes (no hay datos previos).

---

## Data model

Este spec introduce una sola estructura nueva:

```ts
interface Subject {
  id: string;
  name: string;        // "Análisis Matemático"
  careerId: string;    // "ingenieria"
  plan: string;        // "2024"
}
```

**Convenciones:**

- `id` es el ID del documento en Firestore (string).
- `name` y `careerId` son strings en minúscula con espacios reales (no kebab-case) para nombres visibles.
- `plan` es un string de año (`"2024"`).
- No se introducen subcolecciones — todos los subjects están en una colección plana `subjects`.

---

## Implementation plan

1. **Firebase config.** Crear `app/.env` con `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc. Crear `app/.env.example` con los mismos nombres pero valores placeholder. Agregar `.env` a `app/.gitignore`.
2. **Inicializar Firebase.** Crear `app/src/lib/firebase.ts` que llama `initializeApp` con las vars de entorno y exporta `getFirestore()` como `db`.
3. **QueryClientProvider.** Envolver la app en `app/src/main.tsx` con `QueryClientProvider` de TanStack Query.
4. **Tipo Subject.** Crear `app/src/types/subject.ts` con la interfaz `Subject`.
5. **Hook useSubjects.** Crear `app/src/hooks/useSubjects.ts` que usa `useQuery` de TanStack Query con un `queryFn` que lee la colección `subjects` de Firestore (sin `getDocsFromCache`, siempre red).
6. **Home dinámico.** Actualizar `app/src/routes/home/home.tsx` para que renderice la lista de subjects desde `useSubjects()`, mostrando un loader/mensaje de error según el estado de la query.
7. **Seed script.** Crear `seed/seed.mjs` con `firebase-admin`: inicializa la app con `credential.cert()` desde una variable de entorno `GOOGLE_APPLICATION_CREDENTIALS`, escribe la colección `subjects` con documentos como `{ name: "Análisis Matemático", careerId: "ingenieria", plan: "2024" }`. Instalar `firebase-admin` como devDependency en el workspace raíz o local.
8. **Gitignore para seed.** Agregar `service-account.json` (o el path que se use) a `app/.gitignore` y prevenir commits de credenciales.

---

## Acceptance criteria

- [ ] `app/.env.example` existe con los nombres de las variables de Firebase (sin valores reales).
- [ ] La app de Firebase se inicializa sin errores al cargar la app.
- [ ] `db` (Firestore) se exporta desde `app/src/lib/firebase.ts`.
- [ ] La app está envuelta en `QueryClientProvider`.
- [ ] `Subject` tiene los campos `id`, `name`, `careerId`, `plan`.
- [ ] `useSubjects()` devuelve la lista de subjects desde Firestore.
- [ ] La pantalla de Home muestra una lista dinámica de subjects (no un link hardcodeado).
- [ ] Mientras carga la query, se muestra un indicador de carga.
- [ ] Si la query falla, se muestra un mensaje de error.
- [ ] `seed/seed.mjs` existe y corre sin errores con las credenciales de Admin SDK.
- [ ] Después de correr el seed, la colección `subjects` en Firestore contiene al menos el documento "Análisis Matemático".

---

## Decisions

- **Sí:** Firestore como reemplazo de localStorage para subjects. La app arranca con Firebase como fuente de verdad desde el inicio.
- **Sí:** `Subject` con campos `name`, `careerId`, `plan`. Se descarta la estructura `MateriaBase` del MVP original por nombres en inglés, manteniendo `careerId` para compatibilidad futura multi-carrera.
- **Sí:** TanStack Query + Firestore. Toda lectura de datos pasa por TanStack Query, dejando la puerta abierta a caching, refetch y optimistic updates sin cambiar la arquitectura.
- **Sí:** `firebase-admin` para el seed script. Es la herramienta estándar para operaciones de backend sobre Firestore.
- **Sí:** `.env.example` versionado, `.env` ignorado. Las credenciales nunca se commitan.
- **No:** Firebase Auth en este spec. Se pospone a un spec futuro si se necesita autenticación.
- **No:** Escritura de subjects desde la UI. Este spec es solo lectura; crear/editar materias va en otro spec.
- **No:** localStorage. Aunque el MVP lo definía, este spec migra subjects a Firestore. El resto de entidades se definen en futuros specs.
- **No:** Migración de datos (no hay datos previos que migrar).

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Credenciales de Firebase commitadas accidentalmente | `.env` en `.gitignore`, service account key también en `.gitignore`, `.env.example` contiene solo placeholders |

---

## What is **not** in this spec

- Firebase Auth.
- Escritura, edición o eliminación de subjects desde la UI.
- Las demás entidades del MVP (materiaInstancia, TPs, evaluaciones, temas, apuntes, notes).
- localStorage para subjects.

Cada uno de esos, si llega, va en su propio spec.
