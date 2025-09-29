# Vigilantes del Aedes

Sistema de Vigilancia Epidemiológica Web para el Control del Aedes aegypti en Posadas, Misiones, Argentina.

Una aplicación web progresiva (PWA) que permite a los ciudadanos reportar criaderos de mosquitos Aedes aegypti para combatir dengue, zika y chikungunya.

## Características Principales

- **Geolocalización Interactiva**: Mapeo preciso de criaderos
- **IA Gemini 2.0**: Ajuste automático de ubicaciones
- **Progressive Web App**: Funciona offline e instalable
- **Tiempo Real**: Sincronización instantánea con Supabase
- **Mapas Interactivos**: Visualización de reportes en tiempo real

## Stack Tecnológico

- React 18.2.0
- Tailwind CSS 3.3.0
- React-Leaflet 4.2.1
- Supabase (PostgreSQL + Storage)
- Google Gemini 2.0 API
- PWA Service Workers

## Instalación Rápida

### Prerrequisitos

- Node.js v16.0.0 o superior
- npm v8.0.0 o superior
- Cuenta en Supabase
- API Key de Google Gemini

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/iNeenah/Aedes.git
cd Aedes/pwa
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-anon-key
REACT_APP_GEMINI_API_KEY=tu-gemini-api-key
PORT=3001
```

4. **Configurar Supabase**

a. Crear un nuevo proyecto en [Supabase](https://supabase.com)

b. Ejecutar el script de configuración de la base de datos:
   - Ve a SQL Editor en tu dashboard de Supabase
   - Copia y ejecuta el contenido de `setup_supabase.sql`

c. Configurar Storage:
   - Ve a Storage en tu dashboard
   - Crea un bucket llamado "Reports" (público)
   - Ve a SQL Editor y ejecuta el contenido de `storage_policies.sql`

5. **Iniciar la aplicación**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3001`

## Configuración de Supabase (Detallado)

### 1. Base de Datos

El archivo `setup_supabase.sql` crea:
- Tabla `reports` para almacenar reportes de criaderos
- Políticas RLS para acceso público de lectura
- Triggers para timestamps automáticos

### 2. Storage

El archivo `storage_policies.sql` configura:
- Bucket "Reports" para imágenes
- Políticas de acceso público para lectura
- Políticas de inserción para usuarios

### 3. API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key en tu archivo `.env`

## Estructura del Proyecto

```
pwa/
├── public/                 # Archivos estáticos y PWA
├── src/
│   ├── App.jsx            # Componente principal
│   ├── index.js           # Punto de entrada
│   ├── index.css          # Estilos globales
│   └── lib/               # Configuraciones
├── setup_supabase.sql     # Script de BD
├── storage_policies.sql   # Políticas de storage
└── package.json           # Dependencias
```

## Scripts Disponibles

```bash
npm start          # Desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run lint       # Linting de código
```

## Despliegue

### Build de Producción
```bash
npm run build
```

### Plataformas Recomendadas
- **Netlify**: `netlify deploy --prod --dir=build`
- **Vercel**: `vercel --prod`
- **Firebase**: `firebase deploy`

## Solución de Problemas Comunes

### Error de conexión a Supabase
- Verifica que las URLs y keys en `.env` sean correctas
- Asegúrate de que el proyecto Supabase esté activo

### Error de Gemini API
- Verifica que la API key sea válida
- Confirma que tienes créditos disponibles en Google AI

### Problemas con el mapa
- Verifica conexión a internet
- Los tiles de OpenStreetMap pueden tardar en cargar

### Service Worker no funciona
- Asegúrate de estar en HTTPS o localhost
- Limpia cache del navegador

## Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## Contacto

- **Repositorio**: [https://github.com/iNeenah/Aedes](https://github.com/iNeenah/Aedes)
- **Issues**: [Reportar problema](https://github.com/iNeenah/Aedes/issues)

---

Desarrollado para la salud pública de Posadas, Misiones, Argentina.