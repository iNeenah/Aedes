# Configuración de Supabase para Vigilantes del Aedes

## 📋 Requisitos Previos
- Cuenta en Supabase (https://supabase.com)
- Proyecto React ya configurado

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la **URL del proyecto** y la **anon key** (las necesitarás más adelante)

### 2. Crear la Tabla `reports`

Ve al **SQL Editor** en tu proyecto Supabase y ejecuta:

```sql
-- Crear tabla reports
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT,
    photo_url TEXT NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL
);

-- Habilitar Row Level Security (RLS) pero permitir todo por ahora
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT a todos
CREATE POLICY "Allow public read" ON reports FOR SELECT USING (true);

-- Política para permitir INSERT a todos
CREATE POLICY "Allow public insert" ON reports FOR INSERT WITH CHECK (true);
```

### 3. Crear Bucket de Storage

1. Ve a **Storage** en el panel de Supabase
2. Crea un nuevo bucket llamado `reports`
3. Marca el bucket como **público**

### 4. Configurar Políticas de Storage

En el **SQL Editor**, ejecuta:

```sql
-- Política para permitir subida de archivos
INSERT INTO storage.policies (id, bucket_id, name, type, definition, check)
VALUES (
    'reports-insert-policy',
    'reports',
    'Allow public uploads',
    'INSERT',
    'true',
    'true'
);

-- Política para permitir lectura de archivos
INSERT INTO storage.policies (id, bucket_id, name, type, definition, check)
VALUES (
    'reports-select-policy',
    'reports',
    'Allow public downloads',
    'SELECT',
    'true',
    'true'
);
```

### 5. Configurar Real-time

1. Ve a **Database > Replication**
2. Activa la replicación para la tabla `reports`

### 6. Obtener API Key de Gemini (Opcional)

1. Ve a https://ai.google.dev/
2. Crea un proyecto y obtén tu API key
3. En el código, reemplaza `TU_GEMINI_API_KEY_AQUI` con tu key real

### 7. Verificar Configuración

Tu estructura final debe verse así:

#### Tabla `reports`:
- `id` (BIGSERIAL, PRIMARY KEY)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `description` (TEXT, nullable)
- `photo_url` (TEXT, NOT NULL)
- `latitude` (FLOAT8, NOT NULL)
- `longitude` (FLOAT8, NOT NULL)

#### Storage:
- Bucket `reports` (público)
- Políticas de INSERT y SELECT habilitadas

## 🧪 Pruebas

### Insertar Datos de Prueba

```sql
INSERT INTO reports (description, photo_url, latitude, longitude) VALUES
('Recipiente con agua estancada', 'https://via.placeholder.com/400x300', -27.3671, -55.8961),
('Maceta abandonada', 'https://via.placeholder.com/400x300', -27.368, -55.897),
('Neumático viejo', 'https://via.placeholder.com/400x300', -27.366, -55.895);
```

### Verificar Real-time

En el **SQL Editor**:

```sql
-- Esto debería activar las suscripciones en tiempo real
SELECT * FROM reports ORDER BY created_at DESC;
```

## 🔧 Solución de Problemas

### Error: "relation 'reports' does not exist"
- Verifica que hayas ejecutado el SQL para crear la tabla

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén creadas correctamente

### Error de Storage
- Verifica que el bucket `reports` exista y sea público
- Verifica que las políticas de storage estén activas

### No se cargan reportes
- Verifica la conexión a internet
- Verifica que las credenciales de Supabase sean correctas
- Revisa la consola del navegador para errores específicos

## 📱 Uso de la Aplicación

1. **Subir foto**: La aplicación detectará automáticamente la zona de Posadas
2. **Sin geolocalización**: No pide permisos de ubicación
3. **IA automática**: Gemini AI analiza la imagen y asigna coordenadas
4. **Tiempo real**: Los reportes aparecen inmediatamente en el mapa

## 🎯 Zonas de Posadas Detectadas por IA

La IA puede detectar estas zonas:
- Centro (-27.3671, -55.8961)
- Villa Cabello (-27.3580, -55.9020)
- Itaembé Miní (-27.3450, -55.8850)
- Villa Urquiza (-27.3750, -55.8700)
- San José (-27.3900, -55.8900)
- Nemesio Parma (-27.3800, -55.9100)
- Villa Sarita (-27.3600, -55.8800)
- Bajada Vieja (-27.3650, -55.8950)

## ✅ Lista de Verificación

- [ ] Proyecto Supabase creado
- [ ] Tabla `reports` creada con columnas correctas
- [ ] Políticas RLS configuradas
- [ ] Bucket `reports` creado (público)
- [ ] Políticas de storage configuradas
- [ ] Real-time habilitado
- [ ] Credenciales actualizadas en App.jsx
- [ ] API Key de Gemini configurada (opcional)
- [ ] Datos de prueba insertados
- [ ] Aplicación probada y funcionando

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica las credenciales de Supabase
3. Asegúrate de que la tabla existe
4. Verifica las políticas de seguridad