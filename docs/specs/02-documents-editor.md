# SPEC 02 — Documents con editor

> **Status:** Implementado · **Depends on:** SPEC 01 · **Date:** 2026-07-26
> **Objective:** Permitir crear, ver, editar y eliminar documents en markdown dentro de cada materia, usando un editor rico abstraído cuya implementación puede cambiarse sin tocar Firebase.

---

## Scope

**In:**

- CRUD de documents (crear, ver, editar, eliminar) asociados a una materia.
- Cada document tiene título (string) y contenido (markdown).
- Almacenamiento en Firestore como subcolección `documents` bajo cada subject (`subjects/{id}/documents`).
- Editor rico abstraído detrás de un wrapper que acepta y devuelve markdown. La implementación concreta (Yoopta) está oculta detrás de esa interfaz.
- Wrapper del editor instalable como dependencia (`@yoopta/editor` + plugins de bloque + `@yoopta/exports`) pero reemplazable sin tocar Firebase ni los hooks.
- Ruta de materia (`/subject/$subjectId`) solo lista documents: título + primeros 50 caracteres del contenido. Click en un document lleva a la ruta de gestión.
- Ruta de gestión de documents (`/subject/$subjectId/$documentId`) con vistas para ver, editar y eliminar.
- Ruta para crear nuevo document (`/subject/$subjectId/newDocument`).
- Ruta de materia cambia de `$subjectName` a `$subjectId` para poder consultar la subcolección.
- Término "document" en toda la implementación: tipos, hooks, componentes, rutas y Firestore.

**Out of scope (for future specs):**

- Tags o categorías en documents.
- Búsqueda de texto dentro de documents.
- Imágenes o archivos adjuntos en el contenido del document.
- Exportación de documents (PDF, markdown descargable, etc.).
- Colaboración en tiempo real o compartir documents.

---

## Data model

Estructura en Firestore — subcolección bajo cada subject:

```ts
// app/src/types/document.ts

interface Document {
  id: string        // Firestore doc ID
  title: string     // Título del document
  content: string   // Contenido en markdown
  createdAt: string // ISO YYYY-MM-DD
}
```

Convenciones:

- `id` es el ID del documento en Firestore (string).
- `content` almacena markdown crudo (no JSON del editor).
- `createdAt` en formato ISO `YYYY-MM-DD`.
- No se introduce `updatedAt` — se puede agregar en una spec futura si se necesita.

Abstracción del editor — interfaz del wrapper:

```ts
// app/src/components/editor/MarkdownEditor.tsx (interfaz pública)

interface MarkdownEditorProps {
  content: string          // markdown de entrada
  onChange: (md: string) => void  // callback con markdown de salida
  placeholder?: string
}
```

El wrapper interno convierte markdown ↔ formato del editor concreto. Si se cambia de editor, solo se reemplaza la implementación interna del wrapper; la interfaz pública (`content` + `onChange` en markdown) no cambia.

---

## Implementation plan

1. **Instalar dependencias.** Yoopta v2 se distribuye en paquetes con scope, no como `yoopta-editor`. Ejecutar en `app/`:
   - `npm install @yoopta/editor slate slate-react slate-dom` (core + peer deps obligatorias)
   - Un paquete por cada tipo de bloque a soportar: `@yoopta/paragraph`, `@yoopta/headings`, `@yoopta/lists`, `@yoopta/code`, `@yoopta/blockquote`, `@yoopta/marks` (bold/italic/etc.)
   - `@yoopta/exports` (expone `markdown.serialize` / `markdown.deserialize`, usados por el wrapper)

   Verificar que el proyecto compila sin errores después de la instalación.

2. **Tipo Document.** Crear `app/src/types/document.ts` con la interfaz `Document` (`id`, `title`, `content`, `createdAt`).

3. **Renombrar ruta de materia.** Renombrar `app/src/routes/subject/$subjectName.tsx` a `app/src/routes/subject/$subjectId.tsx`. Actualizar el componente para que lea `$subjectId` de los params. Crear directorio `app/src/routes/subject/$subjectId/` para rutas hijas.

4. **Actualizar Home.** En `app/src/routes/home/home.tsx`, cambiar el `<Link>` para que pase `subjectId: subject.id` en vez de `subjectName: subject.name`.

5. **Subject layout.** En `app/src/routes/subject/$subjectId.tsx`, agregar `<Outlet />` en el `<main>` para renderizar rutas hijas.

6. **Hook useDocuments.** Crear `app/src/hooks/useDocuments.ts` con `useDocuments(subjectId)` (lista), `useDocument(subjectId, documentId)` (uno), `useCreateDocument`, `useUpdateDocument`, `useDeleteDocument`. Cada mutation invalida el queryKey `["documents", subjectId]`.

7. **Editor wrapper.** Crear `app/src/components/editor/MarkdownEditor.tsx`. Acepta `content: string` + `onChange: (md: string) => void`. Internamente crea la instancia de Yoopta (`createYooptaEditor`) con los plugins de bloque instalados, y usa `markdown.deserialize(editor, content)` de `@yoopta/exports` para inicializar el valor al montar, y `markdown.serialize(editor, data)` en cada `onChange` interno del editor para producir el markdown de salida. Si se cambia de editor, solo se reemplaza este archivo.

   El `content` prop solo se usa para inicializar el editor al montar — el wrapper no está controlado respecto a cambios posteriores de `content`. El componente que lo use (paso 11) debe remontarlo con un `key` distinto por cada document (p. ej. `key={documentId}`) para evitar que, al navegar entre documents, se siga mostrando el contenido del anterior.

8. **Documents list.** Crear `app/src/components/DocumentsList.tsx`. Recibe `subjectId`, usa `useDocuments`, renderiza cada document como un `<Link>` a `$documentId` mostrando título y primeros 50 caracteres del contenido. Incluye botón "Nuevo document" que enlaza a `newDocument`.

9. **Integrar lista en materia.** En `app/src/routes/subject/$subjectId.tsx`, renderizar `<DocumentsList subjectId={subjectId} />` antes del `<Outlet />`.

10. **Ruta newDocument.** Crear `app/src/routes/subject/$subjectId/newDocument.tsx`. Formulario con input de título + `<MarkdownEditor>`. Al submit, llama `useCreateDocument` y navega al document creado.

11. **Ruta $documentId.** Crear `app/src/routes/subject/$subjectId/$documentId.tsx`. Modo vista: muestra título + contenido renderizado desde markdown + botones Editar/Eliminar. Modo edición: input de título + `<MarkdownEditor key={documentId}>` con el contenido existente + botón Guardar. El `key` fuerza el remontaje del wrapper cuando cambia el document, evitando que quede el contenido del document anterior. Eliminar muestra confirmación y navega a `/subject/$subjectId`.

---

## Acceptance criteria

- [ ] `@yoopta/editor`, sus peer deps (`slate`, `slate-react`, `slate-dom`), los plugins de bloque necesarios y `@yoopta/exports` están instalados en `app/`.
- [ ] La interfaz `Document` tiene los campos `id`, `title`, `content`, `createdAt`.
- [ ] `useDocuments(subjectId)` devuelve la lista de documents de un subject desde Firestore.
- [ ] `useDocument(subjectId, documentId)` devuelve un document específico.
- [ ] `useCreateDocument` inserta un nuevo document en la subcolección `subjects/{id}/documents`.
- [ ] `useUpdateDocument` actualiza el título y contenido de un document existente.
- [ ] `useDeleteDocument` elimina un document de la subcolección.
- [ ] Las mutations invalidan el queryKey `["documents", subjectId]` y la UI se actualiza automáticamente.
- [ ] El wrapper `MarkdownEditor` acepta `content` (markdown string) y `onChange` (callback con markdown string).
- [ ] El wrapper `MarkdownEditor` no expone ningún tipo o API de Yoopta en su interfaz pública.
- [ ] La ruta `/subject/$subjectId` muestra una lista de documents de esa materia.
- [ ] Cada document en la lista muestra su título y los primeros 50 caracteres del contenido.
- [ ] La lista tiene un botón "Nuevo document" que navega a `/subject/$subjectId/newDocument`.
- [ ] La ruta `/subject/$subjectId/newDocument` muestra un formulario con input de título y el editor.
- [ ] Al guardar en newDocument, se crea el document en Firestore y se navega a su ruta.
- [ ] La ruta `/subject/$subjectId/$documentId` muestra el document en modo vista (título + contenido renderizado).
- [ ] Desde la vista se puede entrar a modo edición (título + editor con contenido existente).
- [ ] Al guardar en modo edición, se actualiza el document en Firestore.
- [ ] Desde la vista se puede eliminar el document (con confirmación) y se navega a `/subject/$subjectId`.
- [ ] La ruta de materia cambió de `$subjectName` a `$subjectId`.
- [ ] El Home navega a `/subject/$subjectId` usando el `id` del subject.

---

## Decisions

- **Sí:** Markdown como formato de almacenamiento. Portátil, alineado con el spec original, y no depende de ningún editor específico.
- **No:** JSON de Yoopta como formato de almacenamiento. Si se cambia de editor, los datos almacenados no serían legibles sin el converter exacto.
- **Sí:** Subcolección `subjects/{id}/documents`. Mantiene los datos de un subject agrupados y facilita reglas de seguridad por subject.
- **No:** Colección plana `documents` con campo `subjectId`. Más flexible para queries globales, pero innecesario en este alcance.
- **Sí:** Wrapper `MarkdownEditor` como capa de abstracción. Interfaz pública solo expone markdown; la implementación concreta (Yoopta) está oculta.
- **No:** Exponer tipos de Yoopta en componentes o hooks. Si se cambia de editor, no se debería tocar nada fuera del wrapper.
- **Sí:** Ruta única `$documentId` para ver/editar/eliminar con mode switching. Evita duplicar UI para vista y edición.
- **No:** Rutas separadas para view vs edit. Más rutas, más complejidad, sin beneficio real en este alcance.
- **No:** Campo `updatedAt`. CRUD mínimo; se puede agregar en una spec futura si se necesita.
- **No:** Tags, búsqueda, imágenes, exportación, colaboración. Cada uno va en su propia spec si se necesita.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Yoopta-Editor (y sus peer deps `slate`/`slate-react`/`slate-dom`) no son compatibles con React 19 | Verificar compatibilidad antes de implementar. Si no funciona, buscar versión compatible o alternativa (Plate, TipTap) que cumpla la misma interfaz del wrapper. |
| La conversión markdown ↔ JSON del editor (`@yoopta/exports`) pierde formato en casos no soportados por los plugins instalados | Definir un set fijo de fixtures de markdown (listas anidadas, código con lenguaje, links, negrita+cursiva combinadas, headings) y probarlas de forma repetible en cada ciclo editar→guardar→recargar, no solo una vez de forma manual. |
| `onChange` serializa todo el documento a markdown en cada cambio, lo que puede degradar el rendimiento en documentos largos | Medir después de la implementación. Si hay problemas, aplicar debounce al `onChange` antes de evaluar lazy loading o limitar el tamaño del contenido. |

---

## What is **not** in this spec

- Tags o categorías en documents.
- Búsqueda de texto dentro de documents.
- Imágenes o archivos adjuntos en el contenido del document.
- Exportación de documents (PDF, markdown descargable, etc.).
- Colaboración en tiempo real o compartir documents.
- Campo `updatedAt` en el document.

Cada uno de esos, si se necesita, va en su propio spec.

---

## Referencias

- Website: https://yoopta.dev/
- Repositorio: https://github.com/yoopta-editor/Yoopta-Editor
