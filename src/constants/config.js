// Application configuration constants
export const APP_CONFIG = {
  name: 'Vigilantes del Aedes',
  version: '2.0.0',
  description: 'Sistema de Vigilancia Epidemiológica Web',
  
  // File upload limits
  maxImageSize: 10 * 1024 * 1024, // 10MB
  
  // Map configuration
  defaultZoom: 13,
  heatmapRadius: 25,
  heatmapBlur: 15,
  
  // Criticality evolution
  criticalityIncrement: 0.05, // per day
  maxCriticality: 1.0,
  
  // URLs
  landingUrl: './landing/index.html'
};

export const CRITICALITY_LEVELS = {
  BAJA: { weight: 0.3, color: 'green', icon: '🟢' },
  MEDIA: { weight: 0.6, color: 'yellow', icon: '🟡' },
  ALTA: { weight: 0.9, color: 'orange', icon: '🟠' },
  CRITICA: { weight: 1.0, color: 'red', icon: '🔴' }
};

export const BREEDING_SITE_TYPES = [
  { value: 'Balde/Recipiente', label: 'Balde o recipiente de agua' },
  { value: 'Neumático', label: 'Neumático abandonado' },
  { value: 'Maceta', label: 'Maceta o jardinera' },
  { value: 'Canaleta', label: 'Canaleta obstruida' },
  { value: 'Bebedero', label: 'Bebedero de animales' },
  { value: 'Tanque', label: 'Tanque de agua' },
  { value: 'Piscina', label: 'Piscina abandonada/sucia' },
  { value: 'Otros', label: 'Otros recipientes' }
];

export const ACCESS_TYPES = [
  { value: 'Acceso libre', label: 'Acceso libre desde la calle' },
  { value: 'Patio privado', label: 'En patio privado - pedir permiso' },
  { value: 'Terreno baldío', label: 'En terreno baldío' },
  { value: 'Zona comercial', label: 'En zona comercial' },
  { value: 'Escuela/Institución', label: 'En escuela o institución' },
  { value: 'Difícil acceso', label: 'Difícil acceso - requiere coordinación' }
];