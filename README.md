# Frontend - Sistema de Gestión de Nuevos Colaboradores

Este es el frontend de la aplicación para la gestión de nuevos colaboradores. Permite visualizar, crear y gestionar usuarios, solicitudes de acceso y asignaciones de computadores mediante una interfaz moderna e intuitiva.

## 🧱 Tecnologías Utilizadas

- Angular 20+ (Componentes standalone)
- TypeScript
- RxJS
- Bootstrap 5 + Bootstrap Icons
- Chart.js (ng2-charts)
- Angular Forms / Reactive Forms
- **Grafana** (Visualización de datos)

---

## 📦 Estructura del Proyecto

```
new-collaborators-ui/
├── src/
│   ├── app/
│   │   ├── users/               # Módulo de usuarios
│   │   ├── access-requests/     # Módulo de solicitudes de acceso
│   │   ├── computer-assign/     # Módulo de asignación de computadores
│   │   ├── main/                # Módulo principal de navegación
│   │   ├── shared/              # Componentes y servicios compartidos
│   │   ├── guards/              # Guards para protección de rutas
│   ├── assets/                  # Imágenes y estilos
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

---

## 🖥️ Scripts de Proyecto

```bash
npm install      # Instalar dependencias
npm start        # Iniciar servidor local en http://localhost:4200
npm run build    # Compilar para producción
npm run test     # Ejecutar pruebas (si aplica)
```

---

## 🚀 Ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/new-collaborators-ui.git
cd new-collaborators-ui
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecuta el proyecto:
```bash
npm start
```

---

## 🧩 Módulos Implementados

### 👤 Usuarios
- Lista de usuarios con filtro por nombre/correo
- Formulario de creación/edición
- Validaciones reactivas

### 🔐 Solicitudes de Acceso
- Registro de solicitudes por tipo (software/hardware/permisos)
- Selección de aplicaciones
- Estado de solicitud (pendiente, aprobado, rechazado)

### 💻 Asignación de Computadores
- Inventario disponible de equipos
- Formulario de asignación
- Historial de asignaciones
- Gráfica de estado (disponibles vs. asignados)

---

## 📊 Visualización con Grafana

El sistema se integra con **Grafana** para proporcionar visualización en tiempo real del estado de los computadores.  
Se configura una conexión entre Grafana y la base de datos PostgreSQL para generar dashboards personalizados.

### Métricas visualizadas:
- Total de computadores registrados
- Computadores disponibles vs. asignados
- Historial de asignaciones por usuario
- Tendencias de solicitudes de acceso por tipo

Esta visualización permite al área de TI tomar decisiones informadas sobre la gestión de recursos tecnológicos en la organización.

---

## 🛡️ Guards de Rutas

El sistema utiliza **Angular Route Guards** para proteger rutas específicas del sistema.  
Ejemplos:
- `AuthGuard` para verificar autenticación.
- `RoleGuard` para permitir acceso según rol del usuario (admin, rrhh, etc.).

---

## 🎨 Estilo y UX

- Bootstrap 5 + Bootstrap Icons
- Diseño modular e intuitivo
- Uso de tarjetas y navegación clara entre módulos
- Responsive

---

## 🌐 Comunicación con el Backend

Utiliza servicios Angular (`HttpClient`) para consumir la API REST expuesta por el backend en `http://localhost:3000`.
