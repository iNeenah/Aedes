# 🦟 Vigilantes del Aedes - Estructura de Navegación

## 📁 Estructura del Proyecto

```
public/
├── index.html                 # Aplicación React (reportes)
├── landing/
│   └── index.html            # Landing page principal
├── app/
│   └── index.html            # Backup de la app React
├── _redirects                # Configuración de redirects
└── vercel.json               # Configuración de Vercel
```

## 🌐 Rutas y Navegación

### Página Principal (Landing)
- **URL**: `/` o `/landing`
- **Archivo**: `public/landing/index.html`
- **Descripción**: Página de concientización con storytelling, datos y estadísticas
- **Características**:
  - Hero section con estadísticas clave
  - Explicación del problema del dengue
  - Presentación de la solución
  - Dashboard de concientización
  - Timeline del proyecto
  - Impacto esperado
  - Call-to-action para reportar

### Aplicación de Reportes
- **URL**: `/app` o `/reportar`
- **Archivo**: `public/index.html` (React App)
- **Descripción**: Aplicación interactiva para reportar criaderos
- **Características**:
  - Mapa interactivo
  - Formulario de reporte
  - Geolocalización
  - Subida de fotos
  - Sistema de gamificación

## 🔄 Flujo de Usuario

1. **Usuario llega al sitio** → Ve la landing page con información y concientización
2. **Usuario se interesa** → Hace clic en "Reportar Criadero"
3. **Usuario es redirigido** → A la aplicación React para hacer reportes
4. **Usuario reporta** → Usa el mapa y formulario para reportar criaderos

## ⚙️ Configuración de Desarrollo

### Desarrollo Local
```bash
# Iniciar servidor de desarrollo React
npm start

# La landing page estará en:
# http://localhost:3000/landing/

# La aplicación estará en:
# http://localhost:3000/
```

### Producción (Vercel/Netlify)
- `/` → Muestra la landing page
- `/app` → Muestra la aplicación React
- `/reportar` → Alias para `/app`

## 🎯 Botones de Navegación

### En la Landing Page:
- **"Reportar Criadero"** (Navbar) → Va a la aplicación
- **"Reportar Criadero Ahora"** (CTA) → Va a la aplicación
- **"Acceder a la Herramienta"** (Footer) → Va a la aplicación

### Función JavaScript:
```javascript
function goToApp() {
    if (window.location.hostname === 'localhost') {
        window.location.href = 'http://localhost:3000/app';
    } else {
        window.location.href = '/app';
    }
}
```

## 📱 Responsive Design

Ambas páginas están optimizadas para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Paleta de Colores Consistente

```css
:root {
    --verde-principal: #00A859;
    --verde-secundario: #007A3D;
    --verde-claro: #4ADE80;
    --rosa: #E6007E;
    --rosa-claro: #F472B6;
    --blanco: #FFFFFF;
    --gris-claro: #F8FAFC;
    --gris-medio: #64748B;
    --gris-oscuro: #1E293B;
}
```

## 🚀 Deploy

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=build
```

La configuración en `vercel.json` y `_redirects` maneja automáticamente las rutas.