# SPEC 05 — Notes entity

> **Status:** Draft · **Depends on:** SPEC 01, SPEC 04 · **Date:** 2026-07-29
> **Objective:** Agregar la entidad "note" como post-it corto (<200 caracteres, sin markdown) asociado a un subject, con subcolección en Firestore, CRUD inline en la página de materia, y seed con 2 notas en subjects distintos de la misma carrera.

---

## Scope

**In:**

- Tipo TypeScript `Note` con campo `content: string`.
- Subcolección `notes` en Firestore bajo `subjects/{subjectId}`.
- Hook `useNotes(subjectId)` con TanStack Query: lista, crear, editar, eliminar.
- Componente `NotesList` integrado en la página de materia (sin ruta propia).
- CRUD inline: crear, editar y eliminar notas desde el mismo componente.
- Validación: `content` ≤ 200 caracteres, sin markdown (texto plano).
- Seed actualizado: 2 notas en 2 subjects distintos de la carrera existente.

**Out of scope (for future specs):**

- Ruta dedicada para notas (se manejan inline).
- Markdown, rich text o cualquier formato enriquecido.
- Tags, categorías, colores o cualquier metadato adicional.
- Notas anidadas o jerarquía entre notas.
- Búsqueda o filtrado de notas.

---

## Data model

```typescript
// app/src/types/note.ts

interface Note {
  id: string;        // Firestore doc ID
  subjectId: string;  // referencia al subject padre
  content: string;   // texto plano, ≤ 200 caracteres
  createdAt: string; // ISO timestamp, se setea al crear
}
```

**Convenciones:**

- Colección `notes` como subcolección de `subjects/{subjectId}` en Firestore (misma arquitectura que evaluations).
- `content` en texto plano, sin markdown ni HTML.
- `createdAt` se asigna al momento de crear (serverTimestamp o Date.now()).
- Sin `updatedAt` — las notas son cortas, no se trackea modificación.

---

## Implementation plan

1. **Tipo Note.** Crear `app/src/types/note.ts` con `interface Note { id: string; subjectId: string; content: string; createdAt: string }`.

2. **Seed actualizado.** En `seed/seed.mjs`:
   - Agregar 2 documentos en la subcolección `notes` de 2 subjects distintos de la misma carrera.
   - Cada nota con `content` corto y `createdAt` como timestamp ISO.

3. **Hook useNotes.** Crear `app/src/hooks/useNotes.ts` con:
   - `useNotes(subjectId)` — lista de notas de un subject, ordenadas por `createdAt` descendente.
   - `useCreateNote()` — mutation que crea un documento en `subjects/{id}/notes`.
   - `useUpdateNote()` — mutation que actualiza `content`.
   - `useDeleteNote()` — mutation que elimina el documento.
   - Cada mutation invalida `["notes", subjectId]`.

4. **Componente NotesList.** Crear `app/src/components/NotesList.tsx`:
   - Renderiza notas como una grilla/tablero de post-its.
   - Cada post-it muestra `content` y la fecha.
   - Botón "Add note" que abre un textarea inline (≤200 chars).
   - Cada nota existente puede editarse inline o eliminarse (con confirmación).
   - Indicadores de carga y error.

5. **Integrar en página de materia.** En `app/src/routes/career/$career-id/subject/$subject-id.tsx`, agregar `<NotesList subjectId={subjectId} />` en la sección correspondiente del layout.

---

## Acceptance criteria

- [ ] La interfaz `Note` existe con campos `id`, `subjectId`, `content`, `createdAt`.
- [ ] `content` acepta hasta 200 caracteres en texto plano.
- [ ] La subcolección `notes` se crea bajo `subjects/{subjectId}` en Firestore.
- [ ] `useNotes(subjectId)` devuelve la lista de notas ordenadas por `createdAt` descendente.
- [ ] `useCreateNote()` crea un nuevo documento en `subjects/{id}/notes` con `createdAt`.
- [ ] `useUpdateNote()` actualiza `content` de una nota existente.
- [ ] `useDeleteNote()` elimina una nota de la subcolección.
- [ ] Las mutations invalidan `["notes", subjectId]` y la UI se actualiza.
- [ ] `NotesList` se renderiza dentro de la página de materia.
- [ ] Se puede crear una nota desde un textarea inline.
- [ ] Se puede editar una nota inline.
- [ ] Se puede eliminar una nota con confirmación.
- [ ] La UI muestra indicador de carga al obtener datos.
- [ ] La UI muestra mensaje de error si la consulta falla.
- [ ] `seed/seed.mjs` crea 2 notas en 2 subjects distintos de la misma carrera.

---

## Decisions

- **Sí:** Note como entidad simple con solo `content`. Sin título, sin markdown, sin rich text. Es un post-it.
- **Sí:** `createdAt` como ISO timestamp. Permite ordenar y mostrar antigüedad.
- **Sí:** Subcolección `notes` bajo `subjects/{id}` en Firestore. Misma arquitectura que evaluations (SPEC 03).
- **Sí:** TanStack Query para todas las operaciones. Misma convención que evaluations y documents.
- **Sí:** CRUD inline en la página de materia. Sin ruta dedicada.
- **Sí:** Seed con 2 notas en 2 subjects distintos de la misma carrera.
- **No:** Markdown, rich text o formato enriquecido. El límite de 200 caracteres no lo justifica.
- **No:** Tags, categorías, colores o metadatos adicionales.
- **No:** Ruta dedicada para notas (inline es más rápido y consistente con el concepto post-it).
- **No:** `updatedAt`. Las notas son efímeras, no se trackea modificación.
- **No:** Segunda carrera en el seed. Las 2 notas van en subjects distintos de la misma carrera existente.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| `content` > 200 caracteres enviado al servidor | Validación en el formulario (textarea con contador y maxLength). |
| Edición inline de múltiples notas simultáneas | Cada nota mantiene su propio estado de edición; no hay conflicto entre ellas. |

---

## What is **not** in this spec

- Ruta dedicada para notas (se manejan inline).
- Markdown, rich text o cualquier formato enriquecido.
- Tags, categorías, colores o cualquier metadato adicional.
- Notas anidadas o jerarquía entre notas.
- Búsqueda o filtrado de notas.

Cada uno de esos, si se necesita, va en su propio spec.
