# Organizador académico universitario — Documento de producto (PRD)
**Fecha:** 11-08-2026

## 1. Resumen

Aplicación móvil Android para que un estudiante universitario organice su carrera por cuatrimestres, gestionando materias, trabajos prácticos, evaluaciones, temas a repasar y notas.

**Stack técnico:** Expo (React Native) + NativeWind (Tailwind), con persistencia local mediante patrón repository.

## 2. Objetivo

Permitir a un estudiante organizar su carrera universitaria por cuatrimestres, gestionando materias, TPs, evaluaciones, temas a repasar y notas.

Idea base del producto: calendario + block de notas.

## 3. Usuario objetivo

Estudiante que además de estudiar trabaja o realiza otras actividades que demandan tanto tiempo como estudiar, por lo que se olvida de sus tareas pendientes o de la proximidad de un examen.

## 4. Objetivo fundamental del producto

Recordarle al usuario la proximidad de un examen o tarea pendiente.

## 5. Requisitos no funcionales

- La aplicación debe funcionar sin conexión a internet.

## 6. Modelo de datos

### 6.1 Carrera

```
Career {
  id: string
  name: string
}
```

### 6.2 Asignatura

```
Schedule {
  startTime: string
  endTime: string
  day: string
}

Subject {
  id: string
  name: string

  careerId: string
  schedules?: Schedule[]
}
```

Datos de una asignatura: nombre, id de carrera y una lista opcional de horarios (hora de inicio, hora de término y día).

### 6.3 Nota

```
Note {
  id: string
  subjectId: string | null
  careerId: string

  content: string
  createdAt: string
}
```

### 6.4 Evaluación

```
EvaluationType = "partial" | "final" | "retake" | "practical_work" | "presentation" | "Task"

Evaluation {
  id: string
  subjectId: string

  title: string
  date: string
  type: EvaluationType

  note?: string
  link?: string
  topics?: string[]
}
```

## 7. Casos de uso y especificaciones por módulo

### 7.1 Carrera

**Alcance de la versión actual:** solo es posible tener una carrera. En una versión futura debe ser posible tener varias.

**Pantalla principal (home):** la carrera se muestra como pantalla principal.

- **CU-01 — Onboarding de carrera:** si no se detecta la existencia de una carrera, se debe pedir al usuario que ingrese los datos de la carrera (sub-ruta de onboarding).
- **CU-02 — Ver lista de asignaturas:** el usuario puede ver una lista de las asignaturas.
- **CU-03 — Ver contenido de una asignatura:** el usuario puede ver el contenido de una asignatura (sub-ruta).
- **CU-04 — Crear asignatura:** el usuario puede crear asignaturas desde el drawer. El nombre es un campo requerido y único.
- **CU-05 — Ver evaluaciones próximas:** se debe ver una lista de todas las evaluaciones próximas, ordenadas primero por las más cercanas, luego las que se realicen esta semana y la semana entrante.

**Orden de la pantalla principal:** primero se muestra la lista de evaluaciones y luego las asignaturas.

### 7.2 Asignaturas

Las asignaturas están asociadas a una carrera, a una evaluación o a una nota.

Al entrar al detalle de una asignatura, el usuario puede:

- **CU-06 — Cambiar nombre de asignatura:** (sub-ruta de ajustes).
- **CU-07 — Eliminar asignatura:** (sub-ruta de ajustes).
- **CU-08 — Agregar notas:** (sub-ruta).
- **CU-09 — Agregar evaluaciones:** (sub-ruta).
- **CU-10 — Ver evaluaciones de la asignatura:** deben mostrarse ordenadas según su proximidad, de menor a mayor. Las evaluaciones que ya pasaron no se deben mostrar, pero tampoco se deben eliminar.
- **CU-11 — Ver lista de notas de la asignatura:** se debe poder ver una lista de las notas con título y primera línea de contenido.
- **CU-12 — Ver detalle de una nota:** se debe poder hacer clic en una nota para ver su contenido, editarla y eliminarla (sub-ruta).

**Especificación — horarios y cuenta regresiva de clase:** si los horarios de una asignatura están registrados, se debe mostrar la cantidad de horas y minutos que faltan para el término de la clase, siempre que se esté dentro del horario de la clase.

### 7.3 Notas

Dentro de la pantalla de notas se pueden crear notas que estén o no asociadas a una asignatura. Una nota se puede asociar a una asignatura antes o después de creada.

- **CU-13 — Ver lista de notas:** se puede ver una lista de todas las notas existentes; primero se muestran las que no están asociadas a ninguna asignatura.
- **CU-14 — Crear nota:** (sub-ruta).
- **CU-15 — Ver listado resumido de notas:** se debe poder ver una lista de las notas con título, fecha y primera línea de contenido.
- **CU-16 — Ver/editar detalle de nota:** se debe poder hacer clic en una nota para ver su contenido, editar su contenido, eliminarla o asociarla a una asignatura (sub-ruta).

### 7.4 Evaluaciones

Dentro de la pantalla de evaluaciones, estas se deben ordenar según su proximidad, de menor a mayor.

- **CU-17 — Ver todas las evaluaciones:** se deben mostrar las evaluaciones de todas las asignaturas.
- **CU-18 — Crear evaluación:** (sub-ruta). Las evaluaciones contienen: nombre (requerido), fecha (requerido), tipo (valor por defecto "evaluación"), enlace, notas (menos de 5 mil caracteres) y lista de temas.
- **CU-19 — Ver/editar/eliminar evaluación:** se debe poder hacer clic en una evaluación para ver su detalle, editarla y eliminarla (collapse).

**Regla de negocio — asociación obligatoria:** no puede existir una evaluación que no esté asociada a una asignatura.

**Regla de negocio — código de colores según proximidad:**

| Tiempo restante | Color |
|---|---|
| Más de 2 semanas | Blanco |
| Menos de 2 semanas | Verde |
| 7 días o menos | Amarillo |
| 4 días o menos | Rojo |
