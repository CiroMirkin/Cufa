# Organizador académico universitario

> **Status:** Draft · **Date:** 2026-07-21
> **Objective:** Permitir a un estudiante organizar su carrera universitaria por cuatrimestres, gestionando materias, TPs, evaluaciones, temas a repasar, apuntes y notas cortas, en una app React + Electron con persistencia local vía patrón repository.

---

## Scope

**In:**

- Gestión de una carrera universitaria dividida en cuatrimestres/semestres.
- Entidad `Carrera` con CRUD completo, aunque la UI solo contempla una carrera activa a la vez (no hay selector de múltiples carreras).
- Materias organizadas como `MateriaBase` (nombre, carrera, plan) + `MateriaInstancia` (cuatrimestre, año, estado: Cursando / Aprobada / Recursando / Abandonada).
- Soporte para recursar: una materia puede tener varias instancias vinculadas a la misma `MateriaBase`, creadas mediante un patrón factory.
- TPs por instancia de materia: título, fecha de entrega, estado (Pendiente / Entregado / Corregido), link adjunto, nota.
- Evaluaciones por instancia de materia (entidad separada de TP): título, tipo (Parcial / Final / Recuperatorio), fecha, nota.
- Checklist de temas a repasar por instancia de materia, con estado Pendiente / Listo.
- Apuntes (texto libre/markdown) asociados a `MateriaBase`, visibles desde cualquier instancia de esa materia.
- Notes/tips (texto corto, sin formato, sin tags) asociados a `MateriaBase`, con fecha.
- Dashboard estilo "bento" por materia, mostrando: TPs próximos, checklist de temas, últimas notas/calificaciones, últimos apuntes, últimos tips/notes.
- Persistencia local vía localStorage, implementada detrás de un patrón repository.
- Usuario único implícito (sin login ni selección de perfil), pero el repository queda preparado para incorporar un `userId` en una spec futura.

**Out of scope (for future specs):**

- Login/autenticación real y multiusuario con separación de cuentas.
- Manejo de múltiples carreras simultáneas o cambio entre carreras activas.
- Backend y sincronización entre dispositivos.
- Upload de archivos reales (por ahora solo links externos).
- Tags o categorías para las notes/tips.
- Promedios o cálculos automáticos de notas (queda para una spec futura si se pide).

---

## Data model

Este feature introduce las siguientes estructuras nuevas:

```js
const materiaBase = {
  id: "materia-uuid",
  nombre: "Álgebra I",
  carreraId: "carrera-uuid",
  plan: "2024",
};

const materiaInstancia = {
  id: "instancia-uuid",
  materiaBaseId: "materia-uuid",
  cuatrimestre: 1,
  anio: 2024,
  estado: "Cursando",
};

const tp = {
  id: "tp-uuid",
  instanciaId: "instancia-uuid",
  titulo: "TP1 - Matrices",
  fechaEntrega: "2024-05-10",
  estado: "Pendiente",
  link: "https://drive.google.com/...",
  nota: null,
};

const evaluacion = {
  id: "evaluacion-uuid",
  instanciaId: "instancia-uuid",
  titulo: "Primer parcial",
  tipo: "Parcial",
  fecha: "2024-06-01",
  nota: null,
};

const tema = {
  id: "tema-uuid",
  instanciaId: "instancia-uuid",
  titulo: "Diagonalización de matrices",
  estado: "Pendiente",
};

const apunte = {
  id: "apunte-uuid",
  materiaBaseId: "materia-uuid",
  titulo: "Resumen unidad 3",
  contenido: "# Markdown libre...",
  fechaCreacion: "2024-05-02",
};

const note = {
  id: "note-uuid",
  materiaBaseId: "materia-uuid",
  texto: "El profe mencionó el teorema de Cayley-Hamilton, revisar más adelante.",
  fecha: "2024-05-03",
};
```

Convenciones:

- Todos los IDs son strings (uuid v4).
- Fechas en formato ISO `YYYY-MM-DD`.
- `estado` de `materiaInstancia`: `"Cursando" | "Aprobada" | "Recursando" | "Abandonada"`.
- `estado` de `tp`: `"Pendiente" | "Entregado" | "Corregido"`.
- `tipo` de `evaluacion`: `"Parcial" | "Final" | "Recuperatorio"`.
- `estado` de `tema`: `"Pendiente" | "Listo"`.
- `nota` es `number | null` (sin definir aún escala — se confirma en Fase de implementación si es 1-10, 1-100, etc.).

---

## Implementation plan

1. Setup del proyecto: React + Electron, estructura de carpetas base (incluyendo capa `repository/`). Skeleton corriendo, ventana vacía.
2. Definir interfaces de repository (`CarreraRepository`, `MateriaRepository`, `TpRepository`, `EvaluacionRepository`, `TemaRepository`, `ApunteRepository`, `NoteRepository`) e implementación concreta sobre localStorage.
3. CRUD de `Carrera` y Cuatrimestre/Semestre, con UI que asume una sola carrera activa (sin selector). Prueba manual: crear la carrera, ver que persiste al recargar.
4. Implementar `MateriaInstanciaFactory` (crea instancias con id nuevo y estado inicial "Cursando" a partir de una `MateriaBase`) y el CRUD de `MateriaBase` / `MateriaInstancia` usando el factory para el alta. Prueba manual: crear una materia, recursarla, ver dos instancias ligadas a la misma base.
5. CRUD de TPs dentro de una instancia. Prueba manual: crear un TP, cambiar su estado, asignarle nota.
6. CRUD de Evaluaciones dentro de una instancia. Prueba manual: crear un parcial, asignarle nota.
7. CRUD del checklist de Temas dentro de una instancia. Prueba manual: crear temas, marcar como Listo.
8. CRUD de Apuntes asociados a `MateriaBase`. Prueba manual: crear un apunte desde una instancia, verificar que aparece también en otra instancia de la misma materia.
9. CRUD de Notes/tips asociados a `MateriaBase`. Prueba manual: crear una note, verificar que aparece en todas las instancias de esa materia.
10. Vista dashboard "bento" por materia, integrando los módulos: TPs próximos, checklist de temas, últimas notas/calificaciones, últimos apuntes, últimos tips/notes.
11. Empaquetado Electron mínimo para validar que la app corre como app de escritorio, no solo en navegador.

---

## Acceptance criteria

- [ ] Se puede crear la carrera (única) con sus cuatrimestres/semestres.
- [ ] La UI no permite crear ni activar una segunda carrera simultánea.
- [ ] Se puede crear una `MateriaBase` y asociarla a la carrera.
- [ ] Se puede crear una `MateriaInstancia` para un cuatrimestre/año específico.
- [ ] Recursar una materia crea una nueva `MateriaInstancia` (vía `MateriaInstanciaFactory`) vinculada a la misma `MateriaBase`, sin duplicar la base.
- [ ] Cambiar el estado de una `MateriaInstancia` entre Cursando / Aprobada / Recursando / Abandonada se refleja inmediatamente en el dashboard.
- [ ] Se puede crear, editar y eliminar un TP dentro de una instancia, con su estado, link y nota.
- [ ] Se puede crear, editar y eliminar una Evaluación (Parcial/Final/Recuperatorio) dentro de una instancia, con su nota.
- [ ] Se puede crear, editar y eliminar un tema del checklist, alternando entre Pendiente y Listo.
- [ ] Un apunte creado desde una instancia de una materia es visible desde cualquier otra instancia de esa misma materia.
- [ ] Una note/tip creada desde una instancia de una materia es visible desde cualquier otra instancia de esa misma materia.
- [ ] El dashboard "bento" de una materia muestra: TPs próximos, checklist de temas, últimas notas/calificaciones, últimos apuntes, últimos tips/notes.
- [ ] Toda la información persiste tras recargar la app (localStorage).
- [ ] La app corre tanto en navegador (web) como empaquetada en Electron (escritorio).

---

## Decisions

- **Sí:** localStorage como persistencia inicial. Simple, sin backend, suficiente para uso de un solo usuario en sus propios dispositivos.
- **No:** IndexedDB o backend real por ahora. Overengineering para el alcance actual; se evalúa en una spec futura si se necesita sync entre dispositivos.
- **Sí:** patrón repository para toda la persistencia. Aísla localStorage detrás de una interfaz, permitiendo migrar a backend o IndexedDB sin reescribir la lógica de negocio.
- **Sí:** `MateriaBase` + `MateriaInstancia` como entidades separadas. Modela correctamente el recursado sin duplicar información de la materia en sí.
- **Sí:** patrón factory (`MateriaInstanciaFactory`) para crear instancias a partir de una `MateriaBase`. Centraliza la generación de id y el seteo de estado inicial ("Cursando"), separando esa responsabilidad del repository (que solo persiste).
- **Sí:** Apuntes y notes/tips viven en `MateriaBase` (no en la instancia). Se comparten automáticamente entre todas las instancias de una materia sin necesidad de lógica de copia/snapshot.
- **Sí:** Evaluación como entidad separada de TP. Un parcial no siempre tiene sentido de "link adjunto" del mismo modo que un TP, y sus estados/flujo son distintos.
- **No:** estado único "Entrega" compartido entre TP y Evaluación. Se prefirió claridad de dominio sobre menor cantidad de entidades.
- **Sí:** una sola carrera activa en la UI, aunque la entidad `Carrera` mantenga CRUD completo. Deja la puerta abierta a multi-carrera en el futuro sin necesitar cambios estructurales grandes.
- **No:** login/multiusuario real en esta spec. Se pospone; el repository queda preparado (namespacing futuro por `userId`) pero no se implementa ahora.
- **No:** upload de archivos reales para TPs/evaluaciones. Solo links externos, ya que no hay backend de almacenamiento en este alcance.
- **No:** tags o categorías en notes/tips. Se buscó mantenerlas simples, como anotaciones rápidas sin estructura.
- **No:** cálculo automático de promedios de notas. Fuera de alcance; se evalúa si se pide explícitamente en una spec futura.

---

## Risks

| Riesgo                                                            | Mitigación                                                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| localStorage tiene límite de tamaño (~5-10MB según navegador)      | Alcance actual (un usuario, texto plano) está lejos del límite; se reevalúa si se agregan archivos.           |
| Pérdida de datos si se borra el localStorage del navegador         | Fuera de alcance de esta spec; se podría agregar export/import manual en una spec futura.                     |
| Migración futura a backend/multiusuario rompe el repository actual | El patrón repository ya aísla la persistencia; migrar implica reemplazar la implementación, no la interfaz.   |

---

## What is **not** in this spec

- Login/autenticación real y multiusuario con separación de cuentas.
- Manejo de múltiples carreras simultáneas o cambio entre carreras activas.
- Backend y sincronización entre dispositivos.
- Upload de archivos reales (por ahora solo links externos).
- Tags o categorías para las notes/tips.
- Cálculo automático de promedios de notas.

Cada uno de estos, si se necesita, va en su propia spec.