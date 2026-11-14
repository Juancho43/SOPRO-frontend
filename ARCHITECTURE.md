# Guía de Arquitectura y Estilo de Código (Frontend)

Este documento define la arquitectura técnica, estándares de diseño, convenciones y patrones de desarrollo aplicados en el frontend de **SOPRO** (Angular 21+).

---

## 1. Visión General de Arquitectura

El proyecto está diseñado bajo un enfoque de **Feature-Driven Architecture** moderno, desacoplado y orientado a reactividad con **Angular Signals** y **rxResource**.

```mermaid
graph TD
    A[Vistas / Layouts (FocusLayout / MainLayout)] --> B[Smart Components (Features: Dashboard, Rituals, etc.)]
    B --> C[Dumb / UI Components (Cards, Accordions, Forms)]
    B --> D[State / Helpers (*Helper)]
    D --> E[Data Layer (*Http / Services)]
    E --> F[Backend API / Firebase Auth]
```

---

## 2. Organización del Proyecto

La estructura de carpetas bajo `src/app/` sigue una separación estricta por responsabilidad:

```text
src/app/
├── core/                  # Componentes estructurales globales y layouts
│   ├── focus-layout/      # Layout inmersivo sin distractores (Login, Formularios, Racha)
│   ├── main-layout/       # Layout con navegación principal (Header, Sidebar/Nav)
│   └── ...
├── features/              # Módulos por dominio funcional
│   ├── <feature_name>/
│   │   ├── logic/         # Estado, lógica de negocio y llamadas HTTP
│   │   │   ├── <name>-helper.ts   # Fachada de estado (Signals, rxResource, computed)
│   │   │   ├── <name>-http.ts     # Comunicación con APIs (HttpClient)
│   │   │   └── <name>.model.ts    # Interfaces y Tipos TypeScript
│   │   ├── <sub-component>/       # Componentes visuales específicos de la feature
│   │   └── <feature>.ts           # Vista / Smart Component principal
│   ├── dashboard/
│   ├── focusmate/
│   ├── login/
│   ├── rituals/
│   └── streak/
├── environments/          # Configuraciones por entorno (apiUrl, Firebase, etc.)
├── app.config.ts          # Configuración global de la app (providers, router, auth)
└── app.routes.ts          # Tabla de rutas principal con lazy loading
```

---

## 3. Patrones de Diseño y Capas

### A. Patrón Dual: HTTP Service + Helper (State Facade)
Cada feature divide la lógica en dos piezas clave:

1. **`*Http` (Data Layer):**
   - Responsabilidad única: realizar peticiones a la API backend.
   - Inyecta `HttpClient` y gestiona cabeceras (por ej., `Authorization: Bearer <token>`).
   - Retorna observables puros (`Observable<T>`).

2. **`*Helper` (State / Facade Layer):**
   - Inyectable con `providedIn: 'root'`.
   - Transforma los observables del servicio HTTP en reactividad moderna usando `rxResource`.
   - Expone señales computadas (`computed`) públicas en modo lectura para los componentes:
     - Gestiona estados de carga (`isLoading`), errores (`error`) y valor (`value`).
   - Expone métodos para recargar datos (`reload()`) o alterar estado.

### B. Smart vs. Dumb Components
- **Smart Components (Páginas/Vistas):**
  - Inyectan Helpers, Services o el Router.
  - Consumen Signals vía `computed()` y coordinan navegación o flujos de usuario.
- **Dumb Components (Presentacionales):**
  - Reciben datos vía `input()` / `@Input()` y emiten eventos vía `output()` / `@Output()`.
  - No dependen directamente de lógica de backend.

---

## 4. Convenciones de Código en Angular

### Standalone y Decorador `@Component`
- Todos los componentes deben ser **Standalone** (`imports: [...]` en el decorador).
- Nombres de selector con prefijo estándar: `selector: 'app-<nombre>'`.
- Estilos encapsulados con SCSS (`styleUrl: './<component>.scss'`).

```typescript
@Component({
  selector: 'app-dashboard',
  imports: [StreakCard, RitualAccordion, SessionsAccordion],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // ...
}
```

### Inyección de Dependencias
- Utilizar la función `inject()` de `@angular/core` en lugar de constructores verbosos:

```typescript
// Preferido
private router = inject(Router);
private ritualHelper = inject(RitualHelper);

// Evitar
constructor(private router: Router, private ritualHelper: RitualHelper) {}
```

### Modificadores de Acceso
- `private`: Servicios inyectados, recursos internos (`rxResource`) y lógica privada.
- `protected`: Propiedades y señales consumidas exclusivamente por la plantilla HTML del componente.
- `public`: Métodos y señales expuestos hacia otros componentes o por servicios Helper.

### Reactividad: Signals & `rxResource`
- Priorizar **Angular Signals** (`signal`, `computed`) sobre Observables manuales en las vistas.
- Evitar `subscribe()` en componentes. Dejar que `rxResource` o la reactividad de Signals gestione el ciclo de vida.
- Manejar estados transitorios y nulos limpiamente en computadas:

```typescript
public ritualStreak = computed(() =>
  this.ritualStreakResource.isLoading() || this.ritualStreakResource.error()
    ? null
    : this.ritualStreakResource.value()
);
```

---

## 5. Ruteo y Layouts

- **Lazy Loading obligatorio:** Cargar vistas y subrutas mediante `loadComponent` y `loadChildren`:
  ```typescript
  loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  ```
- **Separación de Layouts:**
  - `FocusLayout`: Para vistas inmersivas sin navegación (Login, `rituals/form`, `streaks/celebration`).
  - `MainLayout`: Para vistas con navegación global e interactiva (`home`, `rituals`, `finances`, `menu`).
- **Guards funcionales:** Uso de `canActivate: [authGuard]` y `canActivate: [GuestGuard]`.

---

## 6. Seguridad y Autenticación

- **Google Auth vía Firebase Authentication.**
- **Token JWT (`idToken`):** Siempre transmitido al backend Go a través del header:
  ```http
  Authorization: Bearer <idToken>
  ```
- **Protección de APIs de Terceros:** Nunca consumir directamente servicios externos (como Focusmate) desde el frontend. Consumir los endpoints proxy provistos por el backend `/api/...`.

---

## 7. Testing y Calidad

- **Runner de Pruebas:** Vitest (`npm run test`, `npm run test:watch`).
- **Formato:** Prettier (`npm run ...`).
- **Testing Unitario:** Probar Helpers y Componentes aislando llamadas HTTP con mocks.
