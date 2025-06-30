# InmoMarket Frontend

Aplicación frontend para el mercado inmobiliario desarrollada con React, Vite y Tailwind CSS.

## 🚀 Características

- **Autenticación unificada**: Sistema de autenticación basado en Zustand para mejor rendimiento
- **Almacenamiento encriptado**: Datos de autenticación encriptados en localStorage para mayor seguridad
- **Protección de rutas**: Redirección automática para usuarios autenticados/no autenticados
- **Manejo de errores**: ErrorBoundary para capturar errores en producción
- **Responsive Design**: Interfaz adaptativa para móviles y desktop
- **Tema oscuro/claro**: Soporte para múltiples temas

## 🛠️ Tecnologías

- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router DOM
- Lucide React (Iconos)
- Sonner (Notificaciones)
- CryptoJS (Encriptación)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd inmomarket-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENCRYPTION_KEY=your-secret-encryption-key-here
```

**⚠️ Importante**: Para producción, genera una clave de encriptación segura:
```bash
# Generar una clave aleatoria de 32 bytes
openssl rand -hex 32
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## 🚀 Despliegue en Vercel

### Configuración automática:
1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es una aplicación Vite/React
3. El archivo `vercel.json` configurará las rutas correctamente

### Variables de entorno en Vercel:
- `VITE_API_BASE_URL`: URL de tu API backend
- `VITE_ENCRYPTION_KEY`: Clave de encriptación para localStorage (REQUERIDA)

## 🔐 Seguridad

### Encriptación de Datos de Autenticación
- Todos los datos de autenticación se almacenan encriptados en localStorage
- Utiliza encriptación AES-256 para proteger tokens y información sensible
- Migración automática de datos no encriptados existentes
- Clave de encriptación configurable mediante variable de entorno

### Variables de Entorno Requeridas
```bash
# Desarrollo
VITE_ENCRYPTION_KEY=dev-secret-key-2024

# Producción (generar clave segura)
VITE_ENCRYPTION_KEY=your-32-byte-hex-encryption-key
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base
│   ├── ProtectedRoute.jsx  # Protección de rutas
│   └── ErrorBoundary.jsx   # Manejo de errores
├── pages/              # Páginas de la aplicación
├── stores/             # Stores de Zustand
├── services/           # Servicios de API
└── contexts/           # Contextos de React (legacy)
```

## 🔐 Autenticación

El sistema de autenticación utiliza Zustand con persistencia en localStorage:

```javascript
import { useAuthStore } from '@/stores/useAuthStore';

const { token, login, logout } = useAuthStore();
```

## 🛡️ Protección de Rutas

Las rutas están protegidas automáticamente:

- **Rutas públicas** (`/login`, `/register`): Redirigen a `/` si el usuario está autenticado
- **Rutas privadas**: Redirigen a `/login` si el usuario no está autenticado
