# Casos de uso y funcionalidades existentes

## Módulo: Autenticación

| Caso de uso | Descripción | Ruta/Componente |
|---|---|---|
| Login con Google | El usuario inicia sesión con su cuenta de Google mediante popup. | `/login` → `signInWithGoogle()` |
| Registro (onboarding) | El usuario nuevo crea su alias único y una primera carrera. | `/onboarding` → `useCreateUser` + `addDoc(careers)` |
| Cerrar sesión | Botón en el header que ejecuta `signOut()`. | `Header` → `signOut()` |
| Protección de rutas | Verifica auth + documento de usuario existe; redirige a login u onboarding. | `ProtectedRoute` |
| Persistencia de sesión | `onAuthStateChanged` mantiene sesión entre recargas. | `AuthContext` |

## Módulo: Carreras

| Caso de uso | Descripción | Hook/Componente |
|---|---|---|
| Crear carrera | Formulario con nombre de carrera. | `/` → `useCreateCareer` |
| Listar carreras del usuario | Redirige automáticamente a la primera si existe. | `/` → `useCareers` |
| Ver detalle de carrera | Muestra nombre, materias como cards, y calendario de evaluaciones. | `/career/$career-id` |

## Módulo: Materias

| Caso de uso | Descripción | Hook/Componente |
|---|---|---|
| Crear materia | Formulario con nombre + plan de estudio. | `/career/$career-id/new-subject` → `useCreateSubject` |
| Editar materia | Click en nombre de materia para edición inline (en la lista?). | `useUpdateSubject` |
| Eliminar materia | Confirmación y borrado. | `useDeleteSubject` |

## Módulo: Documentos

| Caso de uso | Descripción | Hook/Componente |
|---|---|---|
| Listar documentos | Cards con preview Markdown (primeros 120 chars). | `DocumentsList` → `useDocuments` |
| Crear documento | Editor Yoopta WYSIWYG + título. | `/subject/$subject-id/new-document` → `useCreateDocument` |
| Ver/editar documento | Editor con autosave (1s debounce). | `/subject/$subject-id/document/$document-id` → `useDocument` + `useUpdateDocument` |
| Eliminar documento | Confirmación y borrado con redirección. | `useDeleteDocument` |
| Exportar documento | Descarga como archivo `.md`. | `exportAsMarkdown()` |

## Módulo: Evaluaciones

| Caso de uso | Descripción | Hook/Componente |
|---|---|---|
| Listar evaluaciones | Lista ordenada: próximas primero, vencidas al final. | `EvaluationsList` → `useEvaluations` |
| Crear evaluación | Formulario (título, tipo, fecha, nota opcional, link opcional). | `NewEvaluationDialog` → `useCreateEvaluation` |
| Editar evaluación | Edición inline de título, tipo, fecha, nota. | `EvaluationItem` → `useUpdateEvaluation` |
| Eliminar evaluación | Confirmación y borrado. | `useDeleteEvaluation` |
| Ver todas las evaluaciones (carrera) | Calendario con fechas de evaluaciones de todas las materias. | `CareerEvaluationsCalendar` → `useAllEvaluations` |
| Ver evaluaciones (materia) | Calendario de una materia. | `SubjectEvaluationsCalendar` → `useEvaluations` |
| Niveles de urgencia | Código de colores: vencido (gris), crítico <3d (rojo), pronto <6d (naranja), próximo (verde). | `evaluations.ts` → `getUrgencyLevel` |

## Módulo: Notas

| Caso de uso | Descripción | Hook/Componente |
|---|---|---|
| Crear nota | Input inline con Enter para guardar. Máx 200 caracteres. | `NotesList` → `useCreateNote` |
| Editar nota | Edición inline. | `Note` → `useUpdateNote` |
| Eliminar nota | Confirmación y borrado. | `useDeleteNote` |
| Listar notas | Ordenadas por fecha descendente. | `useNotes` |

## Módulo: UI/UX compartido

| Componente | Uso |
|---|---|
| `InlineEditableText` | Campo de texto inline (click para editar, blur/Enter para guardar, Escape para cancelar). |
| `InlineEditableSelect` | Select inline (mismo patrón). |
| `MarkdownPreview` | Renderiza Markdown truncado a 120 chars. |
| `Breadcrumb` | Navegación jerárquica (Inicio > Carrera > Materia). |
| `Calendar` | Calendario con modifiers por nivel de urgencia. |

## Seed de datos

`seed/seed.mjs` — script que crea 1 usuario, 1 carrera, 5 materias, 1 evaluación y 2 notas de prueba usando `firebase-admin`.
