# Arquitectura

## Nivel 1: Diagrama de contexto

```
[Usuario] ──> (GUS App) ──> [Firebase (Auth + Firestore)]
```

- **GUS App**: Aplicación web en React que permite gestionar carreras, materias, documentos, evaluaciones y notas.
- **Firebase Auth**: Autenticación de usuarios via Google.
- **Cloud Firestore**: Base de datos NoSQL en tiempo real.

---

## Nivel 2: Contenedores

| Contenedor | Tecnología | Descripción |
|---|---|---|
| SPA (Frontend) | React 19 + TypeScript 6 + Vite 8 | Aplicación de página única |
| Ruteo | @tanstack/react-router | Manejo de rutas con lazy loading |
| Estado servidor | @tanstack/react-query v5 | Caché, fetching y mutations |
| UI | Tailwind CSS 4 + shadcn/ui + Base UI | Componentes atómicos |
| Editor rich-text | Yoopta Editor | Editor WYSIWYG con exportación Markdown |
| Autenticación | Firebase Auth (Google Popup) | `src/auth/` |
| Base de datos | Cloud Firestore | Colecciones NoSQL |

---

## Nivel 3: Componentes principales

### Capa de entrada (`src/main.tsx`)

```
<StrictMode>
  <QueryClientProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
</StrictMode>
```

### Sistema de rutas (`src/routes/`)

```
__root.tsx          → Layout raíz con Header + Outlet
/                   → Home (redirige a carrera existente o formulario crear)
/login              → Login con Google
/onboarding         → Alta de usuario + primera carrera
/career             → ProtectedRoute (wrapper)
/career/$career-id  → Detalle de carrera (lista materias + calendario)
/career/$career-id/new-subject  → Crear materia
/career/$career-id/subject/$subject-id  → Detalle materia (docs, evals, notas)
  /new-document     → Nuevo documento
  /new-evaluation   → Nueva evaluación
  /document/$document-id  → Editor de documento
```

### Capa de autenticación (`src/auth/`)

- `auth.ts`: Inicializa Firebase Auth, exporta Google sign-in y sign-out.
- `AuthContext.tsx`: Provider con `onAuthStateChanged`.
- `useAuth.ts`: Hook para consumir el contexto.
- `ProtectedRoute.tsx`: Componente que verifica auth + existencia de user doc en Firestore.

### Capa de datos (`src/hooks/`)

Cada hook expone queries (react-query) sobre Firestore:

| Hook | Colección | Operaciones |
|---|---|---|
| `useCareers` | `careers` | Listar por userId, crear |
| `useSubjects` | `subjects` | Listar por userId+careerId, crear, actualizar, eliminar |
| `useDocuments` | `subjects/{id}/documents` | Listar, obtener, crear, actualizar, eliminar |
| `useEvaluations` | `subjects/{id}/evaluations` | Listar, obtener, crear, actualizar, eliminar — incluye `useAllEvaluations` para múltiples subjects |
| `useNotes` | `subjects/{id}/notes` | Listar (ordenado por fecha), crear, actualizar, eliminar |
| `useUsers` | `users` | Obtener por uid, verificar alias, crear |

### Capa de UI (`src/components/`)

- `Header`: Barra superior con avatar y alias del usuario.
- `DocumentsList` / `MarkdownEditor` / `MarkdownPreview`: Gestión de documentos.
- `EvaluationsList` / `EvaluationItem` / `NewEvaluationDialog`: Evaluaciones por materia.
- `EvaluationsCalendar` / `CareerEvaluationsCalendar` / `SubjectEvaluationsCalendar`: Calendario con niveles de urgencia.
- `NotesList` / `Note`: Notas rápidas inline editables.
- `InlineEditableField`: Componentes reutilizables de edición inline (`InlineEditableText`, `InlineEditableSelect`).

### Capa de utilidades (`src/lib/`)

- `firebase.ts`: Inicialización de Firebase y export de `db`.
- `evaluations.ts`: Funciones de utilidad para tipos, fechas, niveles de urgencia.
- `exportDocument.ts`: Descarga de documento como archivo `.md`.
- `utils.ts`: `cn()` para merging de clases Tailwind.

---

## Nivel 4: Flujo de datos típico

1. Usuario ingresa -> `ProtectedRoute` verifica auth -> si no tiene documento `users/{uid}` -> redirige a `/onboarding`.
2. Onboarding crea `users/{uid}` y `careers/{id}`, redirige a `/career/$career-id`.
3. Cada ruta llama hooks con `useQuery`, que fetch de Firestore usando react-query.
4. Mutaciones (`useMutation`) invalidan queries automáticamente.
5. El calendario usa `useAllEvaluations` para recolectar evaluaciones de todas las materias de una carrera y mostrarlas con niveles de urgencia (`overdue`, `critical`, `soon`, `upcoming`).
