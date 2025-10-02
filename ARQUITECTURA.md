# Arquitectura del Proyecto - Vigilantes del Aedes

## 📁 Estructura Reorganizada

El proyecto ha sido reorganizado siguiendo las mejores prácticas de separación de responsabilidades entre client-side y server-side:

### 🖥️ **Client-Side Components** (`src/components/`)
Componentes React que manejan la interfaz de usuario y la interacción:

- **`Header.jsx`** - Navegación y branding
- **`InfoModal.jsx`** - Modales de información y errores
- **`LocationSelector.jsx`** - Selector de ubicación en mapa
- **`ReportForm.jsx`** - Formulario de reporte de criaderos
- **`ReportsMap.jsx`** - Visualización de mapa con reportes

### ⚙️ **Server Actions** (`src/server-actions/`)
Funciones que manejan operaciones con servicios externos:

- **`reports.js`** - CRUD operations con Supabase
  - `uploadImageToStorage()` - Subida de imágenes
  - `createReport()` - Creación de reportes
  - `fetchReports()` - Obtención de reportes
  - `subscribeToReports()` - Suscripción tiempo real
  - `getCriticalityWeight()` - Cálculo de pesos

- **`ai.js`** - Operaciones con Google Gemini AI
  - `adjustLocationWithAI()` - Ajuste de coordenadas
  - `analyzeBreedingSite()` - Análisis de imágenes

### 🔧 **Configuration & Constants** (`src/lib/`, `src/constants/`)
Configuraciones centralizadas y constantes:

- **`lib/supabase.js`** - Cliente y configuración Supabase
- **`lib/gemini.js`** - Cliente y configuración Gemini AI
- **`constants/config.js`** - Configuración general de la app
- **`constants/zones.js`** - Datos de zonas de Posadas
- **`constants/leaflet.js`** - Configuración de mapas

### 🎣 **Custom Hooks** (`src/hooks/`)
Hooks reutilizables para lógica client-side:

- **`useGeolocation.js`** - Manejo de geolocalización

### 🛠️ **Utilities** (`src/utils/`)
Funciones utilitarias client-side:

- **`validation.js`** - Validaciones de formularios y datos
- **`formatting.js`** - Formateo de fechas, coordenadas, etc.

## 🔄 **Flujo de Datos**

### **1. Reporte de Criadero**
```
ReportForm (client) 
  → validateReportForm() (utils)
  → uploadImageToStorage() (server-action)
  → adjustLocationWithAI() (server-action)
  → createReport() (server-action)
  → Supabase Database
```

### **2. Visualización de Reportes**
```
ReportsMap (client)
  → fetchReports() (server-action)
  → subscribeToReports() (server-action)
  → Supabase Realtime
  → Update UI
```

### **3. Procesamiento con IA**
```
Image Upload (client)
  → adjustLocationWithAI() (server-action)
  → Google Gemini API
  → Enhanced coordinates
  → Update form state
```

## 🏗️ **Separación de Responsabilidades**

### **Client-Side (React Components)**
- ✅ Interfaz de usuario
- ✅ Manejo de estado local
- ✅ Validaciones de formulario
- ✅ Interacciones del usuario
- ✅ Renderizado condicional

### **Server-Side (Server Actions)**
- ✅ Comunicación con APIs externas
- ✅ Operaciones de base de datos
- ✅ Subida de archivos
- ✅ Procesamiento con IA
- ✅ Lógica de negocio

### **Shared (Utils & Constants)**
- ✅ Validaciones
- ✅ Formateo de datos
- ✅ Configuraciones
- ✅ Constantes de la aplicación

## 🔒 **Seguridad y Mejores Prácticas**

### **Variables de Entorno**
- Todas las API keys están en variables de entorno
- Validación de existencia de credenciales
- Fallbacks para modo demo/desarrollo

### **Validación de Datos**
- Validación client-side para UX
- Sanitización de inputs
- Validación de tipos de archivo
- Límites de tamaño de archivos

### **Manejo de Errores**
- Try-catch en todas las operaciones async
- Mensajes de error descriptivos
- Fallbacks para servicios no disponibles
- Logging de errores para debugging

## 📊 **Performance**

### **Optimizaciones Client-Side**
- Lazy loading de imágenes
- Debounce en búsquedas
- Memoización de componentes pesados
- Code splitting por rutas

### **Optimizaciones Server-Side**
- Conexión reutilizable a Supabase
- Cache de configuraciones
- Batch operations cuando es posible
- Timeouts apropiados para APIs

## 🧪 **Testing Strategy**

### **Unit Tests**
- Funciones utilitarias (`utils/`)
- Server actions (mocked)
- Custom hooks

### **Integration Tests**
- Flujo completo de reporte
- Integración con Supabase
- Integración con Gemini AI

### **E2E Tests**
- Flujo de usuario completo
- Casos de error
- Responsive design

## 🚀 **Deployment**

### **Build Process**
1. Validación de variables de entorno
2. Build optimizado con Vite
3. Análisis de bundle size
4. Deploy a Vercel/Netlify

### **Environment Configuration**
- **Development**: Variables locales + emuladores
- **Staging**: Variables de prueba
- **Production**: Variables de producción + monitoring

Esta arquitectura proporciona:
- ✅ **Separación clara** de responsabilidades
- ✅ **Escalabilidad** para nuevas funcionalidades
- ✅ **Mantenibilidad** del código
- ✅ **Testabilidad** de componentes
- ✅ **Performance** optimizada
- ✅ **Seguridad** mejorada