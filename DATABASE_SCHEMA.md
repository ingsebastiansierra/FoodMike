# 🗄️ Esquema de Base de Datos - TOC TOC

## 📊 Tablas Principales

### 1. `restaurants` - Restaurantes
```sql
id                  INTEGER PRIMARY KEY
name                VARCHAR NOT NULL
address             VARCHAR NOT NULL
description         TEXT
image               TEXT
coverimage          TEXT
phone               VARCHAR
email               VARCHAR
owner_id            UUID (FK -> auth.users)
stars               NUMERIC DEFAULT 0.0
reviews             INTEGER DEFAULT 0
deliveryfee         NUMERIC DEFAULT 0.00
minorder            NUMERIC DEFAULT 0.00
delivery_time       TEXT DEFAULT '30-45 min'
cuisine_type        TEXT
isopen              BOOLEAN DEFAULT true
isfeatured          BOOLEAN DEFAULT false
status              TEXT DEFAULT 'active'
schedule            JSONB
coordinates         JSONB
specialties         ARRAY
createdat           TIMESTAMP
updatedat           TIMESTAMP
```

### 2. `products` - Productos
```sql
id                  INTEGER PRIMARY KEY
name                VARCHAR NOT NULL
description         TEXT
price               NUMERIC NOT NULL
image               TEXT
category            VARCHAR
categoryid          INTEGER (FK -> categories)
restaurantid        INTEGER (FK -> restaurants)
restaurant          VARCHAR
stars               NUMERIC DEFAULT 0.0
reviews             INTEGER DEFAULT 0
isfeatured          BOOLEAN DEFAULT false
is_available        BOOLEAN DEFAULT true
preparation_time    INTEGER DEFAULT 15
calories            INTEGER
discount_percentage NUMERIC DEFAULT 0
extras              JSONB
allergens           ARRAY
tags                ARRAY
createdat           TIMESTAMP
updatedat           TIMESTAMP
```

### 3. `categories` - Categorías de Productos
```sql
id                  INTEGER PRIMARY KEY
name                VARCHAR NOT NULL
icon                TEXT
restaurantid        INTEGER (FK -> restaurants)
createdat           TIMESTAMP
updatedat           TIMESTAMP
```

### 4. `orders` - Pedidos
```sql
id                      UUID PRIMARY KEY
user_id                 UUID (FK -> auth.users)
restaurant_id           INTEGER (FK -> restaurants)
status                  TEXT (pending|confirmed|preparing|ready|delivered|cancelled)
subtotal                NUMERIC DEFAULT 0.00
delivery_fee            NUMERIC DEFAULT 0.00
total                   NUMERIC DEFAULT 0.00
delivery_address        JSONB
delivery_coordinates    JSONB
payment_method          TEXT
payment_status          TEXT DEFAULT 'pending'
wompi_transaction_id    TEXT
wompi_reference         TEXT
wompi_payment_method    TEXT
notes                   TEXT
estimated_delivery_time TIMESTAMP
paid_at                 TIMESTAMP
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### 5. `order_items` - Items de Pedidos
```sql
id                  UUID PRIMARY KEY
order_id            UUID (FK -> orders)
product_id          INTEGER (FK -> products)
quantity            INTEGER DEFAULT 1
unit_price          NUMERIC
total_price         NUMERIC
extras              JSONB
notes               TEXT
created_at          TIMESTAMP
```

### 6. `profiles` - Perfiles de Usuario
```sql
id                  UUID PRIMARY KEY (FK -> auth.users)
email               TEXT
full_name           TEXT
role                TEXT DEFAULT 'cliente'
is_active           BOOLEAN DEFAULT true
restaurant_id       INTEGER (FK -> restaurants)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### 7. `favorites` - Favoritos
```sql
id                  UUID PRIMARY KEY
user_id             UUID (FK -> auth.users)
product_id          INTEGER (FK -> products)
created_at          TIMESTAMP
```

### 8. `restaurant_schedules` - Horarios de Restaurantes
```sql
id                  INTEGER PRIMARY KEY
restaurant_id       INTEGER (FK -> restaurants)
day_of_week         INTEGER (0-6)
open_time           TIME
close_time          TIME
is_closed           BOOLEAN DEFAULT false
created_at          TIMESTAMP
```

### 9. `restaurant_stats` - Estadísticas de Restaurantes
```sql
id                  INTEGER PRIMARY KEY
restaurant_id       INTEGER UNIQUE (FK -> restaurants)
total_orders        INTEGER DEFAULT 0
total_revenue       NUMERIC DEFAULT 0
total_products      INTEGER DEFAULT 0
avg_rating          NUMERIC DEFAULT 0
total_customers     INTEGER DEFAULT 0
last_order_date     TIMESTAMP
updated_at          TIMESTAMP
```

## 🎬 Tablas de Shorts (Contenido Social)

### 10. `shorts` - Videos Cortos
```sql
id                  UUID PRIMARY KEY
restaurant_id       INTEGER (FK -> restaurants)
video_url           TEXT NOT NULL
thumbnail_url       TEXT
title               VARCHAR NOT NULL
description         TEXT
tags                ARRAY
views_count         INTEGER DEFAULT 0
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP

-- Programación y Caducidad
publish_at          TIMESTAMP DEFAULT NOW()
expires_at          TIMESTAMP
duration_hours      INTEGER DEFAULT 48 (6-48)

-- Publicaciones Permanentes
is_permanent        BOOLEAN DEFAULT false
pinned_at           TIMESTAMP
```

**Tipos de Shorts:**
- **Temporales**: `is_permanent = false`, se eliminan automáticamente
- **Permanentes**: `is_permanent = true`, máximo 15 por restaurante

### 11. `short_likes` - Likes en Shorts
```sql
id                  UUID PRIMARY KEY
short_id            UUID (FK -> shorts)
user_id             UUID (FK -> auth.users)
created_at          TIMESTAMP
UNIQUE(short_id, user_id)
```

### 12. `short_comments` - Comentarios en Shorts
```sql
id                  UUID PRIMARY KEY
short_id            UUID (FK -> shorts)
user_id             UUID (FK -> auth.users)
comment             TEXT NOT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## 🍽️ Tabla de Menús del Día

### 13. `daily_menus` - Menús del Día
```sql
id                  UUID PRIMARY KEY
restaurant_id       INTEGER (FK -> restaurants)
name                VARCHAR NOT NULL
description         TEXT
price               NUMERIC NOT NULL
image_url           TEXT
available_days      ARRAY DEFAULT ['monday'...'sunday']
start_time          TIME DEFAULT '11:00:00'
end_time            TIME DEFAULT '16:00:00'
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## 🔗 Relaciones Principales

```
auth.users
    ├─> profiles (1:1)
    ├─> restaurants (1:N) via owner_id
    ├─> orders (1:N)
    ├─> favorites (1:N)
    ├─> short_likes (1:N)
    └─> short_comments (1:N)

restaurants
    ├─> products (1:N)
    ├─> categories (1:N)
    ├─> orders (1:N)
    ├─> shorts (1:N)
    ├─> daily_menus (1:N)
    ├─> restaurant_schedules (1:N)
    └─> restaurant_stats (1:1)

products
    ├─> order_items (1:N)
    └─> favorites (1:N)

orders
    └─> order_items (1:N)

shorts
    ├─> short_likes (1:N)
    └─> short_comments (1:N)
```

## 📈 Índices Importantes

### Shorts
- `idx_shorts_restaurant` - Por restaurante
- `idx_shorts_created_at` - Por fecha
- `idx_shorts_active` - Por estado activo
- `idx_shorts_publish_at` - Por fecha de publicación
- `idx_shorts_expires_at` - Por fecha de expiración
- `idx_shorts_permanent` - Por publicaciones permanentes

### Orders
- Por usuario, restaurante, estado, fecha

### Products
- Por restaurante, categoría, disponibilidad

## 🔐 Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado con políticas específicas:

- **Lectura pública**: shorts activos, productos, restaurantes
- **Escritura autenticada**: likes, comentarios, favoritos
- **Escritura de propietario**: shorts, productos, menús del restaurante

## 🎯 Convenciones de Nombres

### Timestamps
- Tablas antiguas: `createdat`, `updatedat` (sin guión bajo)
- Tablas nuevas: `created_at`, `updated_at` (con guión bajo)

### IDs
- Tablas antiguas: `INTEGER` con secuencia
- Tablas nuevas: `UUID` con `gen_random_uuid()`

### Booleanos
- Tablas antiguas: `isopen`, `isfeatured` (sin guión bajo)
- Tablas nuevas: `is_active`, `is_available` (con guión bajo)

### Foreign Keys
- Siempre terminan en `_id` o `id`
- Ejemplo: `restaurant_id`, `user_id`, `categoryid`

## ⚠️ Nombres que NO Existen

| ❌ NO Usar | ✅ Usar |
|-----------|---------|
| `rating` | `stars` |
| `logo` | `image` |
| `created_at` (en restaurants) | `createdat` |
| `updated_at` (en restaurants) | `updatedat` |

## 📊 Estadísticas y Contadores

### Calculados en tiempo real:
- Likes en shorts
- Comentarios en shorts
- Vistas de shorts

### Almacenados:
- Total de pedidos por restaurante
- Revenue total
- Rating promedio
