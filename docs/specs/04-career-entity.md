# SPEC 04 — Career entity

> **Status:** Implementado · **Depends on:** SPEC 01 · **Date:** 2026-07-29
> **Objective:** Agregar la entidad "carrera" con colección en Firestore, formulario de creación al primer inicio (shadcn), seed de carrera default, e integrarla en la navegación como raíz de las rutas de materia.

---

## Scope

**In:**

- Colección `careers` en Firestore con documentos de tipo `{ id, name }`.
- Tipo TypeScript `Career` con campos `id`, `name`.
- Hook `useCareers()` (lista) y `useCreateCareer` (mutation) con TanStack Query.
- Seed actualizado: crear carrera default "Tecnicatura Universitaria en Programación Full Stack".
- Ruta `/` modificada: sin carreras → formulario de creación (shadcn); con carreras → redirect a la última creada.
- Nueva ruta `/career/$career-id` como home renovada (reemplaza el listado de subjects que hoy está en `/`).
- Rutas de subject migradas: `/subject/$subject-id` → `/career/$career-id/subject/$subject-id` (ídem para documents y evaluations anidadas).
- El texto hardcodeado "Carrera" en la página de materia se reemplaza por el `name` real de la carrera.
- Componentes shadcn para el formulario de creación y layout.
- Código en inglés (tipos, hooks, rutas, nombres de archivo); UI en español (textos visibles).

**Out of scope (for future specs):**

- Selector o cambio de carrera activa en la UI (aunque el CRUD lo permita).
- Edición o eliminación de carrera desde la UI.
- Cuatrimestres/semestres como entidad (mencionado en SPEC 00, no implementado aquí).
- Las demás entidades del SPEC 00 (materiaInstancia, TPs, temas, apuntes, notes).

---

## Data model

```typescript
// app/src/types/career.ts

interface Career {
  id: string;   // Firestore doc ID
  name: string; // "Tecnicatura Universitaria en Programación Full Stack"
}
```

**Convenciones:**

- Colección `careers` en Firestore (plana, misma arquitectura que `subjects`).
- `id` es el ID del documento en Firestore.
- No se introducen subcolecciones bajo `careers`.
- Una carrera puede tener múltiples subjects vinculados vía `careerId: string`.

---

## Implementation plan

1. **Tipo Career.** Crear `app/src/types/career.ts` con `interface Career { id: string; name: string }`.

2. **Hook useCareers.** Crear `app/src/hooks/useCareers.ts` con:
   - `useCareers()` — lista de carreras desde Firestore, ordenadas por creación descendente.
   - `useCreateCareer()` — mutation que crea un documento en la colección `careers`.

3. **Seed actualizado.** En `seed/seed.mjs`:
   - Agregar documento en colección `careers`: `{ name: "Tecnicatura Universitaria en Programación Full Stack" }`.
   - Actualizar el `careerId` del subject existente para que apunte al ID de esa carrera.

4. **Ruta `/` modificada.** En `app/src/routes/index.tsx`, reemplazar el componente Home por uno que:
   - Consulta carreras con `useCareers()`.
   - Si está cargando → spinner/loader.
   - Si no hay carreras → formulario shadcn (Card, Input, Button) para crear la primera.
   - Si hay carreras → redirect a `/career/{id}` de la última creada.

5. **Ruta `/career/$career-id`.** Crear `app/src/routes/career/$career-id.tsx`:
   - Lee la carrera por ID (con un hook o query inline desde Firestore).
   - Muestra su `name` como header principal.
   - Lista de subjects (mismo contenido que `home.tsx` actual).
   - Incluye `<Outlet />` para rutas hijas.

6. **Migrar rutas de subject bajo career.**
   - Mover `app/src/routes/subject/$subject-id.tsx` → `app/src/routes/career/$career-id/subject/$subject-id.tsx`.
   - Mover todas las rutas hijas (`subject/$subject-id/`) → `career/$career-id/subject/$subject-id/`.
   - Actualizar todos los `to` y `params` en Links y navigate calls para incluir `career-id`.

7. **Reemplazar "Carrera" hardcodeado.** En el header de la página de materia, reemplazar `{subjectId} - Carrera` por `{subjectId} - {career.name}`, obteniendo la carrera desde Firestore o desde el contexto de la ruta padre.

---

## Acceptance criteria

- [ ] La interfaz `Career` existe con campos `id` y `name`.
- [ ] La colección `careers` se crea en Firestore.
- [ ] `useCareers()` devuelve la lista de carreras desde Firestore.
- [ ] `useCreateCareer()` crea un nuevo documento en `careers`.
- [ ] `seed/seed.mjs` crea una carrera "Tecnicatura Universitaria en Programación Full Stack".
- [ ] `seed/seed.mjs` actualiza el `careerId` del subject para que apunte a esa carrera.
- [ ] Al entrar a `/` sin carreras, se muestra un formulario shadcn para crear la primera.
- [ ] Al crear la primera carrera desde el formulario, se redirige a `/career/{id}`.
- [ ] Al entrar a `/` con carreras existentes, se redirige a `/career/{id}` de la última creada.
- [ ] La ruta `/career/$career-id` muestra el nombre de la carrera y la lista de subjects.
- [ ] La ruta `/career/$career-id/subject/$subject-id` funciona y muestra la página de materia.
- [ ] Las rutas de documents y evaluations funcionan bajo el nuevo path.
- [ ] El texto "Carrera" hardcodeado se reemplaza por el nombre real de la carrera.
- [ ] Los componentes nuevos usan shadcn.
- [ ] Código en inglés (tipos, hooks, rutas, archivos); UI en español (textos visibles).

---

## Decisions

- **Sí:** Colección `careers` en Firestore (plana). Misma arquitectura que `subjects` (SPEC 01).
- **Sí:** TanStack Query para lectura y mutations de careers. Misma convención que subjects y evaluations.
- **Sí:** Una carrera creada por seed + posibilidad de crear más desde la UI, pero sin selector de carrera activa.
- **Sí:** Ruta `/career/$career-id` como nueva home. Subjects se mueven debajo de career.
- **Sí:** Código en inglés (tipos, hooks, rutas, nombres de archivo); UI en español.
- **Sí:** shadcn para todos los componentes nuevos de UI (formulario de creación y layout).
- **Sí:** Sin campo `plan` en Career (a diferencia de Subject que sí tiene `plan`).
- **No:** Selector o cambio de carrera activa en la UI. Aunque el CRUD lo permita, la UI no lo expone.
- **No:** Edición o eliminación de carrera desde la UI. Solo creación.
- **No:** Cuatrimestres/semestres como entidad (mencionado en SPEC 00, fuera de este alcance).

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Al migrar rutas de subject, los links existentes (routeTree.gen.ts, bookmarks) se rompen | TanStack Router regenera el tree automáticamente; solo hay que actualizar los `to` y `params` en todos los Links y navigate calls. |
| Dos pestañas abiertas simultáneamente crean dos carreras (race condition al no haber carrera) | Bajo impacto porque la UI igual redirige a la última creada. Se puede mitigar en una spec futura con optimistic lock. |
| Subjects existentes en Firestore tienen `careerId` que no coincide con la nueva carrera del seed | El seed actualiza explícitamente el `careerId` del subject existente. |

---

## What is **not** in this spec

- Selector o cambio de carrera activa en la UI.
- Edición o eliminación de carrera desde la UI.
- Cuatrimestres/semestres como entidad.
- Las demás entidades del SPEC 00 (materiaInstancia, TPs, temas, apuntes, notes).

Cada uno de esos, si se necesita, va en su propio spec.