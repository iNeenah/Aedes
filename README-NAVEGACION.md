# 🦟 Vigilantes del Aedes - Guía de Navegación

## 🎯 Estructura del Proyecto

### 📊 **Landing Page** (Página Principal)
- **Ubicación**: `public/landing/index.html`
- **URL**: `/` (página principal)
- **Propósito**: Concientización, storytelling, datos estadísticos
- **Características**:
  - Hero section con estadísticas del dengue
  - Explicación del problema y la solución
  - Dashboard de concientización
  - Timeline del proyecto
  - Call-to-action para reportar

### 🐛 **Aplicación de Reportes**
- **Ubicación**: `src/App.jsx` (React)
- **URL**: `/app` o `/reportar`
- **Propósito**: Herramienta para reportar criaderos
- **Características**:
  - Mapa interactivo de Posadas
  - Formulario de reporte con foto
  - Geolocalización precisa
  - Sistema de gamificación
  - Navegación de vuelta a landing

## 🔄 Flujo de Usuario

```
1. Usuario entra al sitio (/) 
   ↓
2. Ve la landing page con información
   ↓
3. Hace clic en "Reportar Criadero"
   ↓
4. Va a la aplicación React (/app)
   ↓
5. Puede reportar criaderos
   ↓
6. Puede volver al inicio con el botón "← Volver al Inicio"
```

## 🎨 Estética Unificada

### Paleta de Colores
```css
--verde-principal: #00A859    /* Verde principal */
--verde-secundario: #007A3D   /* Verde oscuro */
--verde-claro: #4ADE80        /* Verde claro */
--rosa: #E6007E               /* Rosa principal */
--rosa-claro: #F472B6         /* Rosa claro */
--blanco: #FFFFFF             /* Blanco */
--gris-claro: #F8FAFC         /* Gris claro */
--gris-medio: #64748B         /* Gris medio */
--gris-oscuro: #1E293B        /* Gris oscuro */
```

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

### Componentes Unificados
- **Navbar**: Gradiente verde con navegación
- **Botones**: Gradiente rosa con sombras
- **Cards**: Bordes redondeados con sombras suaves
- **Inputs**: Focus en verde principal

## 🚀 Comandos de Desarrollo

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Configurar rutas
npm run setup-routes

# Iniciar servidor de desarrollo
npm start
```

### URLs en Desarrollo
- **React App**: `http://localhost:3000/`
- **Landing Page**: `http://localhost:3000/landing/`

### Producción
```bash
# Build para producción
npm run build

# Deploy a Vercel
vercel --prod

# Deploy a Netlify
netlify deploy --prod --dir=build
```

## 🔧 Configuración de Rutas

### Vercel (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/", "destination": "/landing/index.html" },
    { "source": "/app", "destination": "/index.html" },
    { "source": "/reportar", "destination": "/index.html" }
  ]
}
```

### Netlify (`public/_redirects`)
```
/  /landing/index.html  200
/app  /index.html  200
/reportar  /index.html  200
/*  /index.html  200
```

## 🎯 Navegación Entre Páginas

### Desde Landing → App
```javascript
function goToApp() {
    if (window.location.hostname === 'localhost') {
        window.location.href = 'http://localhost:3000/';
    } else {
        window.location.href = '/app';
    }
}
```

### Desde App → Landing
```javascript
const goToLanding = () => {
    if (window.location.hostname === 'localhost') {
        window.location.href = '/landing/index.html';
    } else {
        window.location.href = '/landing/';
    }
};
```

## 📱 Responsive Design

Ambas páginas están optimizadas para:
- 📱 **Móviles**: 320px - 767px
- 📱 **Tablets**: 768px - 1023px  
- 💻 **Desktop**: 1024px - 1439px
- 🖥️ **Large**: 1440px+

## 🔍 Testing

### URLs a Probar
- `/` → Debe mostrar landing page
- `/landing` → Debe mostrar landing page
- `/app` → Debe mostrar aplicación React
- `/reportar` → Debe mostrar aplicación React

### Navegación a Probar
- Botón "Reportar Criadero" en landing → Va a app
- Botón "← Volver al Inicio" en app → Va a landing
- Logo en app → Va a landing

## 🐛 Troubleshooting

### Problema: Landing no se muestra como página principal
**Solución**: Verificar configuración en `vercel.json` o `_redirects`

### Problema: Navegación no funciona entre páginas
**Solución**: Verificar las funciones `goToApp()` y `goToLanding()`

### Problema: Estilos no coinciden
**Solución**: Verificar que ambas páginas usen la misma paleta de colores

### Problema: React app no carga
**Solución**: Verificar que `npm start` esté corriendo y puertos disponibles

## 📊 Datos en Landing Page

Los datos mostrados son reales de Posadas 2025:
- **631** casos sospechosos de dengue
- **61%** criaderos en objetos inservibles  
- **18.8%** índice de vivienda (emergencia)
- **319** cubiertas eliminadas en una semana

## 🎮 Gamificación

El sistema incluye:
- Puntos por reportes (10 puntos base)
- Rankings entre barrios
- Logros por participación
- Feedback inmediato al usuario

## 🔐 Seguridad

- Validación de formularios
- Sanitización de inputs
- Límites de tamaño de archivos (10MB)
- Geolocalización opcional

---

**¡Listo para proteger Posadas del Aedes aegypti! 🦟🛡️**