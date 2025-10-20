# 📋 Instrucciones de Migración - Shorts Completo

## ✅ Lo que necesitas hacer

### 1️⃣ Ejecutar la Migración en Supabase

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** (en el menú lateral)
3. Crea una nueva query
4. Copia **TODO** el contenido del archivo `COMPLETE_SHORTS_MIGRATION.sql`
5. Pega en el editor
6. Click en **Run** o presiona `Ctrl + Enter`

### 2️⃣ Instalar Dependencia en la App

```bash
npm install @react-native-community/datetimepicker
```

### 3️⃣ ¡Listo!

La app ya tiene todo el código integrado. Solo necesitas la migración de BD y la dependencia.

---

## 📊 ¿Qué agrega esta migración?

### Columnas Nuevas en `shorts`:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `publish_at` | TIMESTAMP | Fecha de publicación |
| `expires_at` | TIMESTAMP | Fecha de caducidad |
| `duration_hours` | INTEGER | Duración (6-48 horas) |
| `is_permanent` | BOOLEAN | ¿Es publicación permanente? |
| `pinned_at` | TIMESTAMP | Fecha en que se fijó |

### Funciones Creadas:

1. ✅ `calculate_short_expiration()` - Calcula expiración automática
2. ✅ `check_permanent_shorts_limit()` - Valida límite de 15 permanentes
3. ✅ `deactivate_expired_shorts()` - Desactiva shorts expirados
4. ✅ `activate_scheduled_shorts()` - Activa shorts programados
5. ✅ `get_permanent_shorts_count()` - Cuenta publicaciones permanentes
6. ✅ `make_short_permanent()` - Convierte short en permanente
7. ✅ `make_short_temporary()` - Convierte permanente en temporal
8. ✅ `get_restaurant_profile_shorts()` - Obtiene shorts del perfil

### Vistas Creadas:

1. ✅ `active_shorts` - Shorts activos con tiempo restante
2. ✅ `restaurant_permanent_shorts` - Publicaciones permanentes con stats

---

## 🔍 Verificar que todo funcionó

Después de ejecutar la migración, ejecuta esto para verificar:

```sql
-- Verificar columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shorts' 
AND column_name IN ('publish_at', 'expires_at', 'duration_hours', 'is_permanent', 'pinned_at');

-- Deberías ver 5 filas
```

Si ves las 5 columnas, ¡todo está bien! ✅

---

## 🎯 Funcionalidades Disponibles

### Para el Admin del Restaurante:

#### 1. Crear Short Temporal (con caducidad)
- Selecciona duración: 6h, 12h, 24h, 48h
- Publica ahora o programa para después
- Se elimina automáticamente al expirar

#### 2. Crear Publicación Permanente
- Máximo 15 por restaurante
- No expira nunca
- Aparece en el perfil del restaurante
- Como un perfil de TikTok/Instagram

#### 3. Gestionar Shorts
- Ver todos los shorts (temporales y permanentes)
- Eliminar shorts
- Pausar/Activar shorts
- Convertir temporal → permanente
- Convertir permanente → temporal

### Para los Usuarios:

#### 1. Feed de Shorts
- Ver shorts temporales activos
- Scroll infinito tipo TikTok

#### 2. Perfil del Restaurante
- Ver las 15 publicaciones permanentes
- Como un perfil de Instagram/TikTok
- Siempre disponibles

---

## 🚨 Solución de Problemas

### Error: "column already exists"

**Solución**: Algunas columnas ya existen. Esto es normal, el script usa `IF NOT EXISTS`.

### Error: "function already exists"

**Solución**: Las funciones se están reemplazando con `CREATE OR REPLACE`. Esto es normal.

### Error: "relation does not exist"

**Problema**: La tabla `shorts` no existe.

**Solución**: Primero ejecuta `database/shorts_schema.sql` para crear la tabla base.

### Error al crear short: "Límite de 15 publicaciones permanentes alcanzado"

**Solución**: El restaurante ya tiene 15 publicaciones permanentes. Debe eliminar una antes de agregar otra.

---

## 📱 Probar en la App

### 1. Crear Short Temporal

1. Dashboard → "Crear Short"
2. Selecciona video
3. Elige duración (ej: 24h)
4. Publica ahora o programa
5. ✅ Se eliminará automáticamente después de 24h

### 2. Crear Publicación Permanente

1. Dashboard → "Crear Short"
2. Selecciona video
3. Activa "Publicación Permanente"
4. Publica
5. ✅ Aparecerá en el perfil del restaurante

### 3. Ver Perfil del Restaurante

1. Desde Shorts → Click en nombre del restaurante
2. O desde Home → Click en restaurante
3. ✅ Verás las publicaciones permanentes

---

## 📊 Estructura Final de `shorts`

```sql
CREATE TABLE public.shorts (
    -- Columnas originales
    id UUID PRIMARY KEY,
    restaurant_id INTEGER,
    video_url TEXT,
    thumbnail_url TEXT,
    title VARCHAR,
    description TEXT,
    tags ARRAY,
    views_count INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- ✨ NUEVAS COLUMNAS
    publish_at TIMESTAMP,      -- Cuándo se publica
    expires_at TIMESTAMP,       -- Cuándo expira
    duration_hours INTEGER,     -- Duración (6-48h)
    is_permanent BOOLEAN,       -- ¿Es permanente?
    pinned_at TIMESTAMP         -- Cuándo se fijó
);
```

---

## ✅ Checklist

- [ ] Ejecutar `COMPLETE_SHORTS_MIGRATION.sql` en Supabase
- [ ] Instalar `@react-native-community/datetimepicker`
- [ ] Verificar que las 5 columnas existan
- [ ] Probar crear short temporal
- [ ] Probar crear publicación permanente
- [ ] Verificar límite de 15 publicaciones

---

## 🎉 ¡Todo Listo!

Una vez completados estos pasos, tendrás:

✅ Shorts temporales con caducidad automática
✅ Publicaciones permanentes (máximo 15)
✅ Perfil de restaurante tipo TikTok
✅ Programación de publicaciones
✅ Gestión completa de shorts

---

## 📞 Soporte

Si algo no funciona:

1. Verifica que la migración se ejecutó sin errores
2. Revisa los logs de Supabase
3. Verifica que las columnas existan
4. Asegúrate de tener la dependencia instalada
