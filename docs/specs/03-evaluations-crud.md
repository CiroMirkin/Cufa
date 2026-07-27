# SPEC 03 — Evaluations CRUD

> **Status:** Draft · **Depends on:** SPEC 01 · **Date:** 2026-07-27
> **Objective:** Permitir crear, ver, editar y eliminar evaluaciones (parcial, final, recuperatorio, TP, presentación) asociadas a un subject en Firestore.

---

## Scope

**In:**

- CRUD completo de evaluations (crear, ver, editar, eliminar) asociadas a un subject.
- Cada evaluation tiene: título (`title`), tipo (`type`), fecha (`date`), nota (`grade`), y link opcional (`link`).
- Tipos de evaluation: `"partial"`, `"final"`, `"retake"`, `"practical_work"`, `"presentation"`.
- Almacenamiento en Firestore como subcolección `evaluations` bajo cada subject (`subjects/{id}/evaluations`).
- Tipo TypeScript `Evaluation` con los campos definidos.
- Hook `useEvaluations(subjectId)` con TanStack Query (lista, uno, crear, actualizar, eliminar).
- Ruta de listing dentro de la página de materia (mostrando lista de evaluations).
- Ruta para crear nueva evaluation.
- Ruta para ver/editar/eliminar una evaluation existente (mode switching como en SPEC 02).
- Indicadores de carga y error para cada operación.

**Out of scope (for future specs):**

- Dashboard con próximos vencimientos o cálculos de promedio.
- Tags o categorías adicionales en evaluations.
- Nota mínima, condición (aprobado/desaprobado), o escala de notas configurable.
- Upload de archivos (solo link externo).
- Notificaciones o recordatorios de fecha.
- Las entidades `tp` y `presentacion` como entidades separadas — quedan unificadas dentro del tipo `type`.

---

## Data model

```typescript
// app/src/types/evaluation.ts

type EvaluationType = "partial" | "final" | "retake" | "practical_work" | "presentation";

interface Evaluation {
  id: string;          // Firestore doc ID
  subjectId: string;   // referencia al subject padre
  title: string;       // "Primer parcial de álgebra"
  type: EvaluationType;
  date: string;        // ISO YYYY-MM-DD
  grade: number | null; // null si aún no está calificada
  link: string;        // opcional, vacío si no hay
}
```

**Convenciones:**

- Subcolección `evaluations` dentro de `subjects/{subjectId}` en Firestore.
- `grade` es `number | null` — `null` significa "sin nota aún".
- `link` es string, vacío por defecto si no hay link.
- No se introduce `createdAt`/`updatedAt` por ahora.

---

## Implementation plan

1. **Tipo Evaluation.** Crear `app/src/types/evaluation.ts` con `EvaluationType` y `Evaluation`.

2. **Hook useEvaluations.** Crear `app/src/hooks/useEvaluations.ts` con:
   - `useEvaluations(subjectId)` — lista de evaluations de un subject.
   - `useEvaluation(subjectId, evaluationId)` — una evaluation específica.
   - `useCreateEvaluation` — mutation que crea un document en `subjects/{id}/evaluations`.
   - `useUpdateEvaluation` — mutation que actualiza title, type, date, grade, link.
   - `useDeleteEvaluation` — mutation que elimina el document.
   Cada mutation invalida `["evaluations", subjectId]`.

3. **Evaluations list.** Crear `app/src/components/EvaluationsList.tsx`. Recibe `subjectId`, usa `useEvaluations`, renderiza cada evaluation mostrando título, tipo, fecha y nota. Botón "New evaluation" que navega a `newEvaluation`.

4. **Integrar lista en materia.** En `app/src/routes/subject/$subjectId.tsx`, agregar `<EvaluationsList subjectId={subjectId} />` debajo de `<DocumentsList>` (o donde corresponda en el layout).

5. **Ruta newEvaluation.** Crear `app/src/routes/subject/$subjectId/newEvaluation.tsx`. Formulario con inputs para título, tipo (select con las 5 opciones), fecha, nota (opcional), link (opcional). Al submit, llama `useCreateEvaluation` y navega a la evaluation creada.

6. **Ruta $evaluationId.** Crear `app/src/routes/subject/$subjectId/$evaluationId.tsx`. Modo vista: muestra todos los campos + botones Edit / Delete. Modo edición: formulario precargado + botón Save. Delete muestra confirmación y navega a `/subject/$subjectId`.

---

## Acceptance criteria

- [ ] La interfaz `Evaluation` tiene los campos `id`, `subjectId`, `title`, `type`, `date`, `grade`, `link`.
- [ ] El tipo `EvaluationType` acepta `"partial"`, `"final"`, `"retake"`, `"practical_work"`, `"presentation"`.
- [ ] `useEvaluations(subjectId)` devuelve la lista de evaluations de un subject desde Firestore.
- [ ] `useEvaluation(subjectId, evaluationId)` devuelve una evaluation específica.
- [ ] `useCreateEvaluation` inserta un nuevo document en `subjects/{id}/evaluations`.
- [ ] `useUpdateEvaluation` actualiza title, type, date, grade, link de una evaluation existente.
- [ ] `useDeleteEvaluation` elimina una evaluation de la subcolección.
- [ ] Las mutations invalidan `["evaluations", subjectId]` y la UI se actualiza.
- [ ] La página de materia muestra una lista de evaluations (título, tipo, fecha, nota).
- [ ] La lista tiene un botón "New evaluation" que navega a la ruta de creación.
- [ ] La ruta de creación (`/subject/$subjectId/newEvaluation`) tiene formulario con todos los campos.
- [ ] Al guardar una nueva evaluation, se crea en Firestore y se navega a su vista.
- [ ] La ruta de una evaluation (`/subject/$subjectId/$evaluationId`) muestra todos sus campos.
- [ ] Desde la vista se puede entrar a modo edición y guardar cambios.
- [ ] Desde la vista se puede eliminar la evaluation (con confirmación) y se navega a `/subject/$subjectId`.
- [ ] La UI muestra indicador de carga mientras se obtienen datos.
- [ ] La UI muestra mensaje de error si la consulta falla.

---

## Decisions

- **Sí:** Evaluación como entidad unificada con campo `type`. En lugar de tener entidades separadas (TP, Parcial, etc.), un solo tipo `Evaluation` con un enum `EvaluationType` cubre todos los casos.
- **Sí:** Firestore como persistence (subcolección bajo subject). Sigue la misma arquitectura que SPEC 02 (documents).
- **Sí:** `grade: number | null`. `null` representa "sin calificar", evitando valores mágicos como -1 o 0.
- **Sí:** TanStack Query para mutations con invalidación de queries. Misma convención que SPEC 02.
- **No:** Dashboard con próximos vencimientos. Se pospone a un spec futuro si se pide.
- **No:** Upload de archivos. Solo link externo, consistente con el MVP original.
- **No:** createdAt / updatedAt. CRUD mínimo; se puede agregar en un spec futuro si se necesita.
- **No:** Escala de notas configurable. Se asume escala 1-10 (o la que el usuario use) sin validación de rango por ahora.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `grade` como `number | null` sin validación de rango puede almacenar valores inconsistentes (ej. 11 en escala 1-10) | El hook no valida rango; se documenta que la validación queda para la UI del formulario si se desea. |
| Eliminar una evaluation no confirma antes de borrar | El UI muestra confirmación antes de llamar `useDeleteEvaluation`. |

---

## What is **not** in this spec

- Dashboard con próximos vencimientos o cálculos de promedio.
- Tags o categorías adicionales en evaluations.
- Nota mínima, condición o escala de notas configurable.
- Upload de archivos (solo link externo).
- Notificaciones o recordatorios de fecha.
- createdAt / updatedAt.

Cada uno de esos, si se necesita, va en su propio spec.
