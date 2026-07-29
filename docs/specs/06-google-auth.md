# SPEC 06 — Google Auth

> **Status:** Implementado · **Depends on:** SPEC 01 · **Date:** 2026-07-29
> **Objective:** Integrar autenticación con Google OAuth vía Firebase Auth, con ruta `/login`, onboarding de alias, colección `users` en Firestore, logout global, y protección de rutas de carrera.

---

## Scope

**In:**

- Provider único: Google OAuth (Firebase Auth). Sin email/contraseña.
- Ruta `/login` con botón "Ingresar con Google".
- Onboarding post-login: pantalla única para definir el alias (displayName propio de la app).
- Colección `users/{uid}` en Firestore con `{ alias, email, displayName, photoURL, createdAt }`.
- Logout global desde el header/navbar.
- Protección de rutas: toda la sección de carreras (`/career/*`) redirige a `/login` si no hay sesión.
- Raíz `/` sin autenticar también redirige a `/login`.
- Persistencia de sesión por defecto de Firebase Auth (IndexedDB).
- Componentes shadcn para login, onboarding y header.

**Out of scope (for future specs):**

- Email/contraseña como provider alternativo.
- Roles y permisos (admin, editor, etc.).
- Página de perfil (el alias solo se setea en onboarding; no habrá edición posterior).
- Recuperación de contraseña, verificación de email.
- Sesión expirada por tiempo (se omite por ahora).
- Protección de rutas fuera de `/career/*` (ej. `/login` es pública).

---

## Data model

```typescript
// Firestore — colección users
// Colección: users/{uid}

interface AppUser {
  uid: string;         // Firebase Auth UID
  alias: string;       // único en toda la app, definido por el usuario en onboarding
  email: string;       // de Google OAuth
  displayName: string; // de Google OAuth
  photoURL: string;    // de Google OAuth
  createdAt: string;   // ISO timestamp, se setea al crear el documento
}
```

**Convenciones:**

- `alias` único en toda la colección `users`. Se valida contra Firestore antes de guardar (query `where("alias", "==", alias)`). Si ya existe, se muestra error y se pide otro.
- Colección `users` plana en Firestore, misma arquitectura que `careers` y `subjects`.
- `uid` es el mismo que el `uid` de Firebase Auth.

---

## Implementation plan

1. **Tipo AppUser.** Crear `app/src/types/user.ts` con `interface AppUser { uid: string; alias: string; email: string; displayName: string; photoURL: string; createdAt: string }`.

2. **Seed actualizado.** En `seed/seed.mjs`, agregar un documento en `users/{uid}` de prueba con alias "martin gonzales", email, displayName, photoURL y createdAt.

3. **Provider de Auth.** Crear `app/src/lib/auth.ts`:
   - Inicializar `onAuthStateChanged` con Firebase Auth.
   - Exponer `signInWithGoogle()` (popup) y `signOut()`.
   - Exponer un hook `useAuth()` que devuelva `{ user, loading }` usando TanStack Query o un contexto React.

4. **Colección users en Firestore.** En `app/src/hooks/useUsers.ts`:
   - `useCreateUser()` — mutation que escribe `{ uid, alias, email, displayName, photoURL, createdAt }` en `users/{uid}`.
   - `useCheckAlias(alias)` — query que verifica si el alias ya existe (con `where`).
   - `useUser(uid)` — query que lee el documento de `users/{uid}`.

5. **Ruta `/login`.** Crear `app/src/routes/login.tsx` con componentes shadcn (Card, Button):
   - Botón "Ingresar con Google" que llama a `signInWithGoogle()`.
   - Si el login falla, mostrar error.
   - Tras login exitoso, verificar si ya existe `users/{uid}`:
     - Si existe → redirect a `/career`.
     - Si no existe → redirect a `/onboarding`.

6. **Onboarding route.** Crear `app/src/routes/onboarding.tsx` con componentes shadcn (Card, Input, Button):
   - Ruta pública (no protegida) accesible solo si el usuario está autenticado pero no tiene documento en `users/{uid}`.
   - Formulario con un campo `alias` (input), validación de unicidad contra Firestore al perder foco o al enviar.
   - Al enviar, llama a `useCreateUser()` y redirige a `/career`.
   - Si el usuario ya tiene documento en `users`, redirigir directamente a `/career`.

7. **Logout global.** En `app/src/components/Header.tsx` (shadcn):
   - Agregar foto de perfil + nombre del usuario (desde `useAuth()` y `useUser(uid)`).
   - Botón "Cerrar sesión" que llama a `signOut()` y redirige a `/login`.

8. **Protección de rutas.** Crear `app/src/lib/ProtectedRoute.tsx`:
   - Componente `ProtectedRoute` que:
     - Si `loading` → spinner.
     - Si no hay `user` → redirect a `/login`.
     - Si hay `user` pero no hay documento en `users` → redirect a `/onboarding`.
     - Si hay `user` y hay documento → renderiza `<Outlet />`.
   - Envolver las rutas de `/career/*` con `ProtectedRoute`.

9. **Raíz no autenticada.** Modificar `app/src/routes/index.tsx`:
   - Si no hay sesión → redirect a `/login` (en lugar de mostrar formulario de carrera o redirect a `/career`).

---

## Acceptance criteria

- [ ] Existe `app/src/types/user.ts` con `interface AppUser`.
- [ ] El seed crea un documento `users/{uid}` con alias "martin gonzales".
- [ ] `signInWithGoogle()` abre el popup de Google OAuth.
- [ ] `signOut()` cierra la sesión y redirige a `/login`.
- [ ] `/login` es pública y muestra botón "Ingresar con Google".
- [ ] Tras login exitoso sin documento en `users`, redirige a `/onboarding`.
- [ ] Tras login exitoso con documento en `users`, redirige a `/career`.
- [ ] `/onboarding` tiene un campo `alias` con validación de unicidad.
- [ ] Si el alias ya existe, se muestra error y no se envía.
- [ ] Al completar onboarding, se crea `users/{uid}` en Firestore y redirige a `/career`.
- [ ] `/career/*` sin autenticación redirige a `/login`.
- [ ] `/career/*` con autenticación sin onboarding redirige a `/onboarding`.
- [ ] `/career/*` con autenticación y onboarding completo muestra el contenido.
- [ ] `/` sin autenticación redirige a `/login`.
- [ ] El header global muestra foto, nombre y botón "Cerrar sesión".
- [ ] El alias "martin gonzales" existe en el seed.

---

## Decisions

- **Sí:** Google OAuth como único provider. Sin email/contraseña; simplifica el alcance y evita gestión de contraseñas.
- **Sí:** Colección `users/{uid}` en Firestore con alias, email, displayName, photoURL y createdAt. El alias es propio de la app; el resto viene de Google.
- **Sí:** Alias único en toda la app. Se valida con query `where("alias", "==", alias)` antes de guardar.
- **Sí:** Onboarding en ruta dedicada (`/onboarding`) justo después del login. Evita mezclar la lógica en `/login`.
- **Sí:** Logout global en el header/navbar. Accesible desde cualquier ruta protegida.
- **Sí:** `ProtectedRoute` como wrapper de las rutas `/career/*`. Misma arquitectura que otras protecciones en TanStack Router.
- **Sí:** Componentes shadcn para toda la UI nueva (login, onboarding, header).
- **Sí:** Seed con usuario de prueba "martin gonzales".
- **No:** Email/contraseña como provider alternativo.
- **No:** Roles y permisos (admin, editor, etc.).
- **No:** Página de perfil o edición de alias posterior al onboarding.
- **No:** Expiración de sesión por tiempo (se difiere a un spec futuro si se necesita).
- **No:** Protección de rutas fuera de `/career/*`.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| El popup de Google OAuth es bloqueado por el navegador | Usar `signInWithRedirect` como fallback si `signInWithPopup` falla con `auth/popup-blocked`. |
| Alias duplicado: dos usuarios envían el mismo alias simultáneamente | Validación previa con `where` + regla de seguridad en Firestore que rechace escrituras con `alias` duplicado. |
| Usuario cierra el onboarding sin completarlo | Permanece en `/onboarding` hasta que complete o cierre sesión. No hay acceso a `/career` sin documento en `users`. |

---

## What is **not** in this spec

- Email/contraseña como provider alternativo.
- Roles y permisos (admin, editor, etc.).
- Página de perfil o edición de alias posterior al onboarding.
- Recuperación de contraseña, verificación de email.
- Sesión expirada por tiempo.
- Protección de rutas fuera de `/career/*`.

Cada uno de esos, si se necesita, va en su propio spec.
