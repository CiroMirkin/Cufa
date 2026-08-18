<div align="center">

# Cufa

*Organizador académico para estudiantes universitarios*

[Características](#características) • [Empezando](#empezando) • [Scripts](#scripts) • [Estructura del proyecto](#estructura-del-proyecto) • [Modelo de datos](#modelo-de-datos)

</div>

Cufa es una aplicación móvil para Android que ayuda a un estudiante universitario a organizar su carrera por cuatrimestres: materias, trabajos prácticos, evaluaciones, temas a repasar y notas, todo pensado para quien además de estudiar trabaja o tiene poco tiempo disponible.

> [!NOTE]
> La aplicación funciona completamente sin conexión a internet. Todos los datos se guardan de forma local en el dispositivo.

## Características

- **Carrera:** onboarding inicial para cargar los datos de la carrera y lista de asignaturas asociadas.
- **Asignaturas:** creación, edición y eliminación, con horarios opcionales y cuenta regresiva mientras dura la clase.
- **Evaluaciones:** parciales, finales, recuperatorios, trabajos prácticos y presentaciones, con fecha, enlace, notas y lista de temas. Se ordenan por proximidad y se resaltan con un código de colores según el tiempo restante.
- **Notas:** notas libres o asociadas a una asignatura, con listado resumido y detalle editable.
- **Pantalla principal:** muestra primero las evaluaciones próximas y luego las asignaturas de la carrera.

> [!IMPORTANT]
> La versión actual soporta una sola carrera activa. El soporte para múltiples carreras está planeado para una versión futura.

## Stack técnico

- [Expo](https://expo.dev) (React Native) con [Expo Router](https://docs.expo.dev/router/introduction/) para la navegación
- [NativeWind](https://www.nativewind.dev) (Tailwind CSS) para los estilos
- [Zustand](https://zustand.docs.pmnd.rs) para el estado global
- Persistencia local mediante patrón repository, sin dependencia de backend

## Empezando

### Requisitos

- [Node.js](https://nodejs.org) 20.19.5
- [Expo Go](https://expo.dev/go) en tu dispositivo, o un emulador de Android/iOS configurado

### Instalación

```bash
npm install
```

### Ejecutar la app

```bash
npm start
```

Esto abre el bundler de Expo. Desde ahí podés escanear el código QR con Expo Go o elegir una plataforma específica:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Compila y ejecuta la app en Android |
| `npm run ios` | Compila y ejecuta la app en iOS |
| `npm run web` | Ejecuta la app en el navegador |
| `npm run lint` | Corre el linter del proyecto |
| `npm run reset-project` | Reinicia la plantilla base de Expo Router |

> [!TIP]
> Corré `npx expo-doctor` de tanto en tanto para verificar que las dependencias del proyecto coincidan con las que espera el SDK de Expo instalado.

## Build de producción

Para generar el APK de producción con [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
eas build --platform android --profile production-apk
```

## Estructura del proyecto

```
app/
├── app                 # Rutas de Expo Router
│   └── (tabs)          # Navegación principal por tabs
├── assets              # Íconos e imágenes
├── components          # Componentes de UI por dominio (evaluation, note, subject, ui)
├── constants           # Constantes compartidas
├── hooks               # Hooks personalizados
├── lib                 # Utilidades (fechas, rangos de semana, etc.)
├── stores              # Estado global con Zustand
└── types               # Tipos de dominio
```

## Modelo de datos

La aplicación gira en torno a cuatro entidades: `Career`, `Subject`, `Note` y `Evaluation`. El detalle completo de los campos y las reglas de negocio (asociación obligatoria de evaluaciones a una asignatura, código de colores por proximidad, etc.) está documentado en [PRODUCT.md](./PRODUCT.md).
