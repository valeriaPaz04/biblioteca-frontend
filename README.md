# Biblioteca Nexus - Frontend

## 🎯 Introducción

Biblioteca Nexus es una aplicación web completa para la gestión de bibliotecas digitales, construida con React y Vite. La aplicación permite a los usuarios gestionar autores, libros, préstamos y perfiles de usuario, conectándose a una API REST backend. Incluye funcionalidades de autenticación, registro, recuperación de contraseña y generación de reportes en PDF.

## 📚 Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **Vite**: Herramienta de desarrollo rápida para proyectos modernos
- **React Router DOM**: Para navegación y enrutamiento
- **EmailJS**: Para envío de correos electrónicos
- **html2canvas**: Para capturar contenido HTML como imágenes
- **jsPDF**: Para generar documentos PDF
- **CSS Modules**: Para estilos modulares y scoped

## 🏗️ Arquitectura del Proyecto

```
Biblioteca_Front-End/rutas-auth/
├── public/
│   ├── vite.svg
│   ├── autores-pdf-template.html    # Plantilla PDF para autores
│   ├── libros-pdf-template.html     # Plantilla PDF para libros
│   └── prestamos-pdf-template.html  # Plantilla PDF para préstamos
├── src/
│   ├── assets/                      # Imágenes y recursos estáticos
│   ├── components/
│   │   ├── Navbar.jsx               # Barra de navegación
│   │   ├── Footer.jsx               # Pie de página
│   │   ├── Common/
│   │   │   ├── LoadingSpinner.jsx   # Spinner de carga
│   │   │   └── MessageAlert.jsx     # Alertas de mensajes
│   │   └── EmailJSConfig.jsx        # Configuración de EmailJS
│   ├── context/
│   │   └── AuthContext.jsx          # Contexto de autenticación
│   ├── pages/                       # Páginas de la aplicación
│   │   ├── Home.jsx                 # Página de inicio
│   │   ├── Login.jsx                # Página de login
│   │   ├── Register.jsx             # Página de registro
│   │   ├── Dashboard.jsx            # Dashboard principal
│   │   ├── Profile.jsx              # Perfil de usuario
│   │   ├── ForgotPassword.jsx       # Recuperar contraseña
│   │   ├── ResetPassword.jsx        # Resetear contraseña
│   │   ├── User.jsx                 # Gestión de usuarios
│   │   ├── Escritores.jsx           # Lista de autores
│   │   ├── Libros.jsx               # Lista de libros
│   │   ├── Prestamos.jsx            # Gestión de préstamos
│   │   ├── RegisterEscritor.jsx     # Registrar autor
│   │   ├── RegisterLibro.jsx        # Registrar libro
│   │   ├── RegisterUser.jsx         # Registrar usuario
│   │   ├── RegisterPrestamo.jsx     # Registrar préstamo
│   │   ├── LibroDetalle.jsx         # Detalles de libro
│   │   ├── EscritorDetalle.jsx      # Detalles de autor
│   │   └── css/                     # Estilos CSS
│   ├── routes/
│   │   └── PrivateRoute.jsx         # Ruta protegida
│   ├── services/
│   │   └── autorService.js          # Servicios para autores
│   ├── utils/
│   │   ├── userHelpers.js           # Utilidades de usuario
│   │   └── validators.js            # Validadores
│   ├── App.jsx                      # Componente principal
│   ├── App.css                      # Estilos globales
│   └── main.jsx                     # Punto de entrada
├── index.html                       # HTML principal
├── vite.config.js                   # Configuración de Vite
├── package.json                     # Dependencias
└── README.md                        # Esta documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend de Biblioteca Nexus corriendo (ver README del backend)

### Pasos de Instalación

1. **Clona o descarga el proyecto**
   ```bash
   git clone <url-del-repositorio>
   cd Biblioteca_Front-End/rutas-auth
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   - Crea un archivo `.env` en la raíz del proyecto
   - Configura las variables necesarias (EmailJS, URLs del backend)

4. **Ejecuta la aplicación**
   ```bash
   npm run dev
   ```

5. **Accede a la aplicación**
   - Abre tu navegador en `http://localhost:5173`
   - La aplicación debería cargar la página de inicio

## 🎨 Funcionalidades Principales

### Autenticación y Autorización
- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nuevas cuentas de usuario
- **Recuperación de Contraseña**: Sistema de reset con códigos por email
- **Rutas Protegidas**: Acceso restringido a ciertas secciones según autenticación

### Gestión de Biblioteca
- **Autores**: CRUD completo de autores con información detallada
- **Libros**: Gestión de catálogo de libros con referencias a autores
- **Préstamos**: Sistema de préstamo y devolución de libros
- **Usuarios**: Administración de usuarios (solo para administradores)

### Interfaz de Usuario
- **Dashboard**: Panel principal con estadísticas y navegación
- **Perfil**: Gestión del perfil personal del usuario
- **Búsqueda y Filtros**: Navegación por el catálogo
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla

### Reportes y Exportación
- **PDF Generation**: Exportación de reportes en PDF para autores, libros y préstamos
- **Plantillas HTML**: Plantillas personalizables para los reportes

## 🔧 Configuración de EmailJS

Para el funcionamiento del sistema de recuperación de contraseña:

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email para códigos de recuperación
4. Actualiza las variables en `EmailJSConfig.jsx` y `.env`

## 📱 Páginas y Rutas

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Página de inicio | No |
| `/login` | Inicio de sesión | No |
| `/register` | Registro de usuario | No |
| `/forgot-password` | Recuperar contraseña | No |
| `/reset-password` | Resetear contraseña | No |
| `/dashboard` | Panel principal | Sí |
| `/profile` | Perfil de usuario | Sí |
| `/user` | Gestión de usuarios | Sí |
| `/authors` | Lista de autores | Sí |
| `/authors/:id` | Detalles de autor | Sí |
| `/books` | Lista de libros | Sí |
| `/book/:id` | Detalles de libro | Sí |
| `/borrow` | Gestión de préstamos | Sí |

## 🎨 Estilos y UI

La aplicación utiliza CSS Modules para estilos scoped y modulares:

- **Forms.css**: Estilos para formularios de login y registro
- **Dashboard.css**: Estilos del panel principal
- **CommonForms.css**: Estilos compartidos para formularios
- **Responsive**: Diseño adaptable con media queries

## 🔗 Conexión con Backend

La aplicación se conecta a la API REST del backend en `http://localhost:5000`:

- **Autenticación**: `/api/usuarios/login`
- **Autores**: `/api/autores`
- **Libros**: `/api/libros`
- **Préstamos**: `/api/prestamos`
- **Usuarios**: `/api/usuarios`

## 🛠️ Desarrollo y Contribución

### Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run preview  # Vista previa de la build
npm run lint     # Ejecuta ESLint
```

### Estructura de Componentes

- **Context API**: Para manejo global del estado de autenticación
- **React Router**: Para navegación SPA
- **Hooks Personalizados**: Para lógica reutilizable
- **Servicios**: Separación de la lógica de API

## 🚀 Próximos Pasos

- Implementar búsqueda avanzada con filtros
- Agregar notificaciones en tiempo real
- Implementar tema oscuro/claro
- Optimizar rendimiento con lazy loading
- Agregar tests unitarios con Jest
- Implementar PWA (Progressive Web App)
- Agregar internacionalización (i18n)

---

** Has llegado al final del documento **
