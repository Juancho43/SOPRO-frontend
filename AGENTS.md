# Normas y Directrices del Frontend (SOPRO-frontend)

Este proyecto corresponde a la capa Frontend del **Sistema Operativo Personal (SOP)**, basado en el **ADD (Architecture Decision Document)** y el **PRD (Product Requirements Document)**.

## Stack y Estructura
- **Framework:** Angular (Standalone Components, Signals, Reactive Forms).
- **Layouts:**
  - `FocusLayout` para vistas inmersivas (Login, Ritual Form `rituals/form`, Celebración de Racha `streaks/celebration`).
  - `MainLayout` para panel principal (Dashboard `home`, Historial `rituals`, Finanzas `finances`, Menú `menu`).
- **Autenticación:** Firebase Authentication (Google Auth). El token JWT (`idToken`) debe enviarse en la cabecera `Authorization: Bearer <token>` al backend Go.
- **Rutas:** Carga perezosa con `loadComponent` y protección con `authGuard` y `GuestGuard`.

## Reglas de Negocio (PRD - Épica 1)
1. **Ritual Diario:** Formulario con agradecimiento y 10 metas diarias. Solo se permite 1 ritual por día calendario.
2. **Racha Maestra:** Mostrar racha actual con fuego (🔥) en el Dashboard. Días consecutivos suman +1. Un día perdido resetea la racha actual a 0 pero guarda la racha máxima histórica.
3. **Historial:** Vista de calendario o lista para leer entradas pasadas en modo solo lectura.
4. **Focusmate:** Widget en Dashboard con próximas sesiones obtenido vía `/api/focusmate/sessions` (nunca consumir la API de Focusmate directamente desde el frontend).
