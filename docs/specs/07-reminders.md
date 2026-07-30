# SPEC 07 — Reminder entity

> **Status:** Draft · **Depends on:** SPEC 01, SPEC 05 · **Date:** 2026-07-30
> **Objective:** Agregar la entidad "recordatorio" (reminder) con título, fecha de expiración y lista opcional de ítems checkbox, asociado a un subject, con CRUD inline en la página de materia, vista próxima (< 7 días) en carrera, y seed con 2 recordatorios en subjects distintos.

---

## Scope

**In:**

- Tipo TypeScript `Reminder` con campos: `id`, `subjectId`, `title`, `items` (array de `{ text, checked }` opcional), `expiresAt`, `createdAt`.
- Subcolección `reminders` en Firestore bajo `subjects/{subjectId}`.
- Hook `useReminders(subjectId)` con TanStack Query: lista, crear, editar, eliminar.
- Hook `useCareerReminders(careerId, subjectIds)` para recordatorios próximos (< 7 días) visibles en la página de carrera.
- Componente `RemindersList` integrado en la página de materia (abajo de NotesList).
- Sección en la página de carrera que muestra recordatorios con expiración < 7 días.
- CRUD inline: título editable con `InlineEditableText`, items con checkbox + `InlineEditableText` para el texto.
- Agregar y eliminar items desde la UI.
- Validación: `title` obligatorio, `expiresAt` requerido, `text` de cada item ≤ 200 caracteres.
- Seed actualizado: 2 recordatorios en 2 subjects distintos de la misma carrera.

**Out of scope (for future specs):**

- Notificaciones push o recordatorios por email.
- Recordatorios globales (sin subject).
- Tags, categorías o colores.
- Búsqueda o filtrado de recordatorios.
- Recordatorios recurrentes.

---

## Data model

```typescript
// app/src/types/reminder.ts

interface ReminderItem {
  text: string   // ≤ 200 caracteres, editable inline
  checked: boolean
}

interface Reminder {
  id: string
  subjectId: string   // referencia al subject padre
  title: string       // obligatorio
  items: ReminderItem[]  // opcional, puede ser array vacío
  expiresAt: string   // ISO date string
  createdAt: string   // ISO timestamp
}
```

**Convenciones:**

- Colección `reminders` como subcolección de `subjects/{subjectId}` en Firestore (misma arquitectura que evaluations y notes).
- `items` se guarda como array plano en Firestore. Cada item se edita inline.
- `expiresAt` es fecha sin hora (formato ISO `YYYY-MM-DD`) para simplificar la comparación de < 7 días.
- `createdAt` se asigna al momento de crear.
- Sin `updatedAt`.

---

## Implementation plan

1. **Tipo Reminder.** Crear `app/src/types/reminder.ts` con `interface ReminderItem { text: string; checked: boolean }` e `interface Reminder { id: string; subjectId: string; title: string; items: ReminderItem[]; expiresAt: string; createdAt: string }`.

2. **Seed actualizado.** En `seed/seed.mjs`:
   - Agregar 2 documentos en la subcolección `reminders` de 2 subjects distintos de la misma carrera.
   - Un recordatorio con `items` no vacío (al menos 2 items), otro con `items: []`.
   - Cada uno con `expiresAt` y `createdAt` como timestamps ISO.

3. **Hook useReminders.** Crear `app/src/hooks/useReminders.ts` con:
   - `useReminders(subjectId)` — lista de recordatorios de un subject, ordenados por `expiresAt` ascendente.
   - `useCreateReminder(subjectId)` — mutation que crea un documento en `subjects/{id}/reminders`.
   - `useUpdateReminder(subjectId, reminderId)` — mutation que actualiza `title`, `items` y/o `expiresAt`.
   - `useDeleteReminder(subjectId)` — mutation que elimina el documento.
   - `useCareerReminders(careerId, subjectIds)` — recibe array de subjectIds, fetches recordatorios de cada uno con `useQueries`, filtra los que expiran en < 7 días, ordena por `expiresAt` ascendente.

4. **Componente RemindersList.** Crear `app/src/components/RemindersList.tsx`:
   - Renderiza recordatorios como cards apiladas, ordenadas por `expiresAt` ascendente.
   - Cada card muestra: título (InlineEditableText), fecha de expiración (InlineEditableText type="date"), y lista de items si existen.
   - Cada item: checkbox (toggle checked inline) + texto (InlineEditableText).
   - Botón "+" para agregar un nuevo item a la lista.
   - Botón delete en cada item (con confirmación).
   - Botón "Agregar recordatorio" que abre un inline form para crear uno nuevo.
   - Indicadores de carga y error.
   - Coloreado por urgencia: vencido (opacidad), < 3 días (rojo), < 7 días (naranja), mismo patrón que evaluations.

5. **Integrar en página de materia.** En `app/src/routes/career/$career-id/subject/$subject-id.tsx`, agregar `<RemindersList subjectId={subjectId} />` debajo de `<NotesList>` en la columna derecha.

6. **Sección de próximos en carrera.** En `app/src/routes/career/$career-id.tsx`:
   - Obtener subjectIds de la carrera (`subjects.map(s => s.id)`).
   - Usar `useCareerReminders(careerId, subjectIds)`.
   - Renderizar una sección con los recordatorios que expiran en < 7 días, agrupados o listados con el nombre de la materia.
   - Si no hay recordatorios próximos, no mostrar la sección.

---

## Acceptance criteria

- [ ] La interfaz `Reminder` existe con campos `id`, `subjectId`, `title`, `items`, `expiresAt`, `createdAt`.
- [ ] La interfaz `ReminderItem` existe con campos `text` y `checked`.
- [ ] `items` es un array de `ReminderItem`, puede ser vacío.
- [ ] La subcolección `reminders` se crea bajo `subjects/{subjectId}` en Firestore.
- [ ] `useReminders(subjectId)` devuelve recordatorios ordenados por `expiresAt` ascendente.
- [ ] `useCreateReminder(subjectId)` crea un nuevo documento en `subjects/{id}/reminders`.
- [ ] `useUpdateReminder(subjectId, reminderId)` actualiza `title`, `items` y/o `expiresAt`.
- [ ] `useDeleteReminder(subjectId)` elimina un recordatorio.
- [ ] `useCareerReminders(careerId, subjectIds)` devuelve solo recordatorios con expiración < 7 días.
- [ ] Las mutations invalidan la query correspondiente y la UI se actualiza.
- [ ] `RemindersList` se renderiza dentro de la página de materia.
- [ ] El título del recordatorio es editable inline con `InlineEditableText`.
- [ ] La fecha de expiración es editable inline con `InlineEditableText type="date"`.
- [ ] Cada item tiene un checkbox que cambia `checked` inline.
- [ ] Cada item tiene texto editable inline con `InlineEditableText`.
- [ ] Se puede agregar un nuevo item a un recordatorio existente.
- [ ] Se puede eliminar un item con confirmación.
- [ ] Se puede crear un recordatorio desde la UI.
- [ ] Se puede eliminar un recordatorio con confirmación.
- [ ] Los recordatorios vencidos se muestran con opacidad reducida.
- [ ] Los recordatorios a < 3 días se muestran con borde rojo.
- [ ] Los recordatorios a < 7 días se muestran con borde naranja.
- [ ] La página de carrera muestra recordatorios próximos (< 7 días) con nombre de materia.
- [ ] La sección de próximos no se muestra si no hay recordatorios < 7 días.
- [ ] La UI muestra indicador de carga al obtener datos.
- [ ] La UI muestra mensaje de error si la consulta falla.
- [ ] `seed/seed.mjs` crea 2 recordatorios en 2 subjects distintos de la misma carrera.
- [ ] Al menos un recordatorio del seed tiene items no vacíos.

---

## Decisions

- **Sí:** Recordatorio como entidad con título + lista opcional de items. Combina texto libre con checklist.
- **Sí:** Subcolección `reminders` bajo `subjects/{id}` en Firestore. Misma arquitectura que evaluations y notes.
- **Sí:** `items` como array plano en Firestore. Simple y suficiente para el alcance; no justifica una subcolección anidada.
- **Sí:** TanStack Query para todas las operaciones. Misma convención que el resto del proyecto.
- **Sí:** CRUD inline en la página de materia. Sin ruta dedicada.
- **Sí:** Vista próximos (< 7 días) en la página de carrera, fetcheando por subjectId. Sin campo `careerId` redundante.
- **Sí:** Código en inglés (`Reminder`, `ReminderItem`), labels en español en la UI.
- **Sí:** Seed con 2 recordatorios en 2 subjects distintos de la misma carrera.
- **Sí:** Mismo patrón de urgencia visual que evaluations (vencido, < 3 días, < 7 días).
- **No:** Notificaciones push o por email.
- **No:** Recordatorios globales sin subject.
- **No:** Tags, categorías o colores.
- **No:** Búsqueda o filtrado de recordatorios.
- **No:** Recordatorios recurrentes.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| `useCareerReminders` fetches todos los recordatorios de todas las materias y filtra en cliente; con muchas materias puede ser lento | Para el tamaño esperado del proyecto es aceptable. Si escala, migrar a una query compuesta con `where("expiresAt", ">=", ...)` en una colección plana. |
| Check toggle rápido: usuario hace click múltiples veces y se encadenan mutations | TanStack Query maneja cola de mutations; cada update es idempotente porque envía el array completo de items. |
