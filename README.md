# Ride Balance API

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/EmersonTejada/ride-balance)
[![Hosted on](https://img.shields.io/badge/Hosted_on-AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](http://3.22.168.33:3000)
[![Pipeline Status](https://img.shields.io/gitlab/pipeline-status/EmersonTejada/ride-balance?branch=main&style=for-the-badge)](https://gitlab.com/EmersonTejada/ride-balance/-/commits/main)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

API RESTful para la gestión financiera de conductores de plataformas de ride-sharing. Permite registrar viajes, gastos, generar reportes y visualizar dashboards con métricas de ingresos y rentabilidad.

> **Este proyecto utiliza GitLab CI/CD para el despliegue automático en AWS EC2.** Puedes ver la configuración del pipeline [aquí en GitLab](https://gitlab.com/EmersonTejada/ride-balance).

## 📋 Descripción

Ride Balance API es una aplicación backend diseñada específicamente para conductores de servicios como Yummy, Ridery y Uber. La API proporciona funcionalidades completas para:

- **Gestión de ingresos**: Registro y seguimiento de viajes por plataforma
- **Control de gastos**: Categorización de gastos operativos (combustible, mantenimiento, etc.)
- **Reportes y analytics**: Resúmenes financieros, análisis por período y plataforma
- **Dashboard semanal**: Vista consolidada de métricas clave de la semana actual

## 🔴 Live Demo (AWS EC2)

¡Prueba la API en vivo! Está desplegada y corriendo en un contenedor de Docker dentro de una instancia EC2:

👉 **[http://3.22.168.33:3000](http://3.22.168.33:3000)**

*(Pronto disponible con dominio propio)*

---

## 🏗️ Arquitectura de la Aplicación

Los datos viajan de manera eficiente y segura a través de las siguientes capas:

```mermaid
graph LR
    A[React \n Frontend] -->|Peticiones HTTP/JSON| B(Express.js \n API / Backend)
    B -->|Prisma Client| C{Supabase \n PostgreSQL}
```

- **Frontend**: SPA construida en React (Consumidor principal).
- **Backend**: Servidor Express con validación Zod y autenticación JWT.
- **ORM**: Prisma para garantizar la seguridad de tipos entre TypeScript y la BD.
- **Base de Datos**: PostgreSQL alojada remotamente en Supabase.

### 🗂️ Estructura de Carpetas

La API sigue una arquitectura modular:

```
src/
├── app.ts                    # Punto de entrada de la aplicación
├── controllers/              # Controladores de rutas
├── errors/                   # Manejo de errores personalizados
├── middlewares/              # Middlewares (auth, validación, errores)
├── models/                   # Modelos de acceso a datos
├── prisma/                   # Cliente Prisma configurado
├── routes/                   # Definición de rutas
├── schemas/                 # Esquemas de validación Zod
├── services/                # Lógica de negocio
├── types/                   # Definiciones de tipos TypeScript
├── utils/                   # Utilidades
└── generated/               # Cliente Prisma generado
```

## 🚀 Características

- **Autenticación segura**: JWT con cookies httpOnly
- **Validación robusta**: Esquemas Zod para validación de datos
- **Base de datos**: PostgreSQL con Prisma ORM
- **TypeScript**: Tipado estático completo
- **Timezone awareness**: Soporte para zonas horarias en reportes
- **ES Modules**: Módulos ES modernos

## 📦 Dependencias Principales

| Dependencia | Propósito |
|-------------|-----------|
| Express 5 | Framework web |
| Prisma 7 | ORM de base de datos |
| PostgreSQL | Base de datos relacional |
| JWT | Autenticación basada en tokens |
| Zod | Validación de esquemas |
| bcrypt | Hashing de contraseñas |
| date-fns | Manipulación de fechas |
| cors | Configuración de CORS |
| cookie-parser | Parseo de cookies |

## 🔧 Requisitos del Sistema

- **Node.js**: 18.0.0 o superior
- **PostgreSQL**: 14.0 o superior
- **npm** o **yarn**

## 📥 Instalación Clásica (Manual)

Si deseas el entorno tradicional de Node.js:

1. **Clonar el repositorio**:
```bash
git clone https://github.com/EmersonTejada/ride-balance.git
cd ride-balance-api
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
   Crear un archivo `.env` en la raíz del proyecto (basado en `.env.example`):
```env
PORT=3000
JWT_SECRET=tu-secreto-jwt-muy-seguro
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ride_balance
NODE_ENV=development
```

4. **Inicializar la base de datos**:
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Ejecutar en desarrollo**:
```bash
npm run dev
```

6. **Ejecutar en producción**:
```bash
npm run build
npm start
```

## 🐳 Quick Start (Docker Compose)

La forma recomendada y más rápida de levantar el proyecto de forma local (ideal para si se suma otro desarrollador) es utilizando Docker.

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Clona el repositorio y crea tu archivo `.env`.
3. Para iniciar el entorno de desarrollo local con live-reloading activado:

```bash
docker compose -f docker-compose.dev.yml up -d
```

¡Y listo! La API estará disponible en `http://localhost:3000`.

## 🔄 Pipeline CI/CD (GitLab)

El proyecto cuenta con un flujo CI/CD completamente automatizado en GitLab con 3 etapas principales:

1. **Build**: Construye la imagen de Docker basada en Alpine.
2. **Test**: Valida el código compilado usando Jest y ES Modules.
3. **Deploy**: Despliega automáticamente (Continuos Deployment) en una instancia remota de AWS EC2 mediante SSH.

*(Estado en tiempo real del Pipeline)*
[![pipeline status](https://gitlab.com/EmersonTejada/ride-balance/badges/main/pipeline.svg)](https://gitlab.com/EmersonTejada/ride-balance/-/commits/main)

## 📡 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor con hot-reload usando nodemon |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm run start` | Ejecuta la aplicación compilada |

## 🔐 Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens). El token se envía al cliente en el cuerpo de la respuesta JSON tras un login exitoso y debe ser incluido en las cabeceras de autorizaciones subsecuentes.

### Flujo de Autenticación

1. **Login**: Envía credenciales y recibe el token JWT en la respuesta.
2. **Middleware**: Cada endpoint protegido requiere el token en la cabecera HTTP.
3. **Logout**: El cliente debe eliminar el token de su almacenamiento local (localStorage, SecureStore, etc).

### Encabezados Requeridos

Para endpoints protegidos, el cliente HTTP debe enviar el token usando el esquema `Bearer`:

```http
Authorization: Bearer tu-jwt-token
```

### Header de Zona Horaria

Para endpoints de reportes y dashboard, se recomienda enviar:
```http
X-Timezone: America/Caracas
```

## 📚 Endpoints de la API

### Autenticación (`/api/auth`)

#### Registrar Usuario
- **Método**: `POST`
- **Ruta**: `/api/auth/register`
- **Requiere autenticación**: No

**Cuerpo de solicitud**:
```json
{
  "email": "conductor@ejemplo.com",
  "name": "Juan Pérez",
  "password": "contraseña-segura123"
}
```

**Validación**:
- `email`: Email válido (formato estándar)
- `name`: Entre 2 y 50 caracteres
- `password`: Mínimo 6 caracteres

**Respuesta exitosa (201)**:
```json
{
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "email": "conductor@ejemplo.com",
    "name": "Juan Pérez",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

#### Iniciar Sesión
- **Método**: `POST`
- **Ruta**: `/api/auth/login`
- **Requiere autenticación**: No

**Cuerpo de solicitud**:
```json
{
  "email": "conductor@ejemplo.com",
  "password": "contraseña-segura123"
}
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*El cliente debe guardar este token y enviarlo en la cabecera `Authorization`*

**Códigos de error**:
- 401: Usuario no existe o contraseña incorrecta

---

#### Cerrar Sesión
- **Método**: `POST`
- **Ruta**: `/api/auth/logout`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Logout exitoso",
  "data": null
}
```

---

#### Obtener Perfil
- **Método**: `GET`
- **Ruta**: `/api/auth/me`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Usuario Verificado",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "conductor@ejemplo.com",
      "name": "Juan Pérez"
    }
  }
}
```

---

#### Actualizar Usuario
- **Método**: `PATCH`
- **Ruta**: `/api/auth/me`
- **Requiere autenticación**: Sí

**Cuerpo de solicitud** (campos opcionales):
```json
{
  "email": "nuevo@ejemplo.com",
  "name": "Nuevo Nombre",
  "password": "nueva-contraseña"
}
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Usuario actualizado exitosamente",
  "data": { /* usuario actualizado */ }
}
```

---

#### Eliminar Usuario
- **Método**: `DELETE`
- **Ruta**: `/api/auth/me`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Usuario eliminado exitosamente",
  "data": { /* usuario eliminado */ }
}
```

---

### Viajes (`/api/rides`)

#### Crear Viaje
- **Método**: `POST`
- **Ruta**: `/api/rides`
- **Requiere autenticación**: Sí

**Cuerpo de solicitud**:
```json
{
  "amount": 25.50,
  "platform": "yummy"
}
```

**Validación**:
- `amount`: Número positivo
- `platform`: Enum (`yummy`, `ridery`, `particular`)

**Respuesta exitosa (201)**:
```json
{
  "message": "Viaje creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "amount": 25.50,
    "platform": "yummy",
    "date": "2025-01-15T10:30:00Z",
    "userId": "uuid-del-usuario"
  }
}
```

---

#### Obtener Todos los Viajes
- **Método**: `GET`
- **Ruta**: `/api/rides`
- **Requiere autenticación**: Sí
- **Parámetros de query opcionales**:
  - `platform`: Filtrar por plataforma
  - `from`: Fecha inicial (formato ISO)
  - `to`: Fecha final (formato ISO)

**Ejemplo de petición**:
```
GET /api/rides?platform=yummy&from=2025-01-01&to=2025-01-31
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Viajes obtenidos exitosamente",
  "data": [
    {
      "id": "uuid-1",
      "amount": 25.50,
      "platform": "yummy",
      "date": "2025-01-15T10:30:00Z",
      "userId": "uuid-del-usuario"
    }
  ]
}
```

---

#### Obtener Viaje por ID
- **Método**: `GET`
- **Ruta**: `/api/rides/:id`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Viaje obtenido exitosamente",
  "data": { /* viaje específico */ }
}
```

**Códigos de error**:
- 404: Viaje no encontrado

---

#### Actualizar Viaje
- **Método**: `PATCH`
- **Ruta**: `/api/rides/:id`
- **Requiere autenticación**: Sí

**Cuerpo de solicitud** (campos parciales):
```json
{
  "amount": 30.00,
  "platform": "ridery"
}
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Viaje actualizado exitosamente",
  "data": { /* viaje actualizado */ }
}
```

---

#### Eliminar Viaje
- **Método**: `DELETE`
- **Ruta**: `/api/rides/:id`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Viaje eliminado exitosamente",
  "data": null
}
```

---

### Gastos (`/api/expenses`)

#### Crear Gasto
- **Método**: `POST`
- **Ruta**: `/api/expenses`
- **Requiere autenticación**: Sí

**Cuerpo de solicitud**:
```json
{
  "amount": 50.00,
  "description": "Tank full of gasoline",
  "category": "fuel",
  "subcategory": "fuel_refill",
  "date": "2025-01-15T10:00:00Z"
}
```

**Categorías válidas**:
| Categoría | Descripción |
|-----------|-------------|
| `fuel` | Combustible |
| `maintenance` | Mantenimiento del vehículo |
| `food` | Comida |
| `insurance` | Seguro |
| `parking` | Estacionamiento |
| `phone` | Teléfono/comunicación |
| `tolls` | Peajes |
| `other` | Otros |

**Subcategorías para `maintenance`**:
| Subcategoría | Descripción |
|--------------|-------------|
| `oil_change` | Cambio de aceite |
| `oil_refill` | Recarga de aceite |
| `repair` | Reparación general |
| `spare_part` | Repuestos |
| `tire` | Llantas |
| `brake` | Frenos |
| `battery` | Batería |

**Respuesta exitosa (201)**:
```json
{
  "message": "Gasto creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "amount": 50.00,
    "description": "Tank full of gasoline",
    "category": "fuel",
    "subcategory": "fuel_refill",
    "date": "2025-01-15T10:00:00Z",
    "userId": "uuid-del-usuario"
  }
}
```

---

#### Obtener Todos los Gastos
- **Método**: `GET`
- **Ruta**: `/api/expenses`
- **Requiere autenticación**: Sí
- **Parámetros de query opcionales**:
  - `category`: Filtrar por categoría
  - `subcategory`: Filtrar por subcategoría
  - `from`: Fecha inicial
  - `to`: Fecha final

**Respuesta exitosa (200)**:
```json
{
  "message": "Gastos obtenidos exitosamente",
  "data": [ /* lista de gastos */ ]
}
```

---

#### Obtener Gasto por ID
- **Método**: `GET`
- **Ruta**: `/api/expenses/:id`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Gasto obtenido exitosamente",
  "data": { /* gasto específico */ }
}
```

---

#### Actualizar Gasto
- **Método**: `PATCH`
- **Ruta**: `/api/expenses/:id`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Gasto actualizado correctamente",
  "data": { /* gasto actualizado */ }
}
```

---

#### Eliminar Gasto
- **Método**: `DELETE`
- **Ruta**: `/api/expenses/:id`
- **Requiere autenticación**: Sí

**Respuesta exitosa (200)**:
```json
{
  "message": "Gasto eliminado exitosamente",
  "data": { /* gasto eliminado */ }
}
```

---

### Reportes (`/api/reports`)

> ⚠️ **Nota**: Todos los endpoints de reportes requieren parámetros `from` y `to` en formato `YYYY-MM-DD`. El rango máximo permitido es de 7 días.

#### Resumen General
- **Método**: `GET`
- **Ruta**: `/api/reports/summary`
- **Requiere autenticación**: Sí
- **Encabezado recomendado**: `X-Timezone: America/Caracas`
- **Parámetros de query requeridos**:
  - `from`: Fecha inicial
  - `to`: Fecha final

**Ejemplo**:
```
GET /api/reports/summary?from=2025-01-01&to=2025-01-07
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Reporte obtenido exitosamente",
  "data": {
    "period": {
      "from": "2025-01-01T00:00:00Z",
      "to": "2025-01-07T23:59:59Z",
      "days": 7,
      "timezone": "America/Caracas"
    },
    "kpis": {
      "totalIncome": 500.00,
      "totalExpenses": 150.00,
      "totalRides": 25,
      "netIncome": 350.00,
      "avgIncomePerRide": 20.00
    },
    "charts": {
      "incomeByDay": [
        { "date": "2025-01-01", "amount": 75.00 },
        { "date": "2025-01-02", "amount": 100.00 }
      ],
      "expensesByCategory": [
        { "category": "fuel", "amount": 100.00 },
        { "category": "parking", "amount": 50.00 }
      ],
      "expensesByCategoryPercentage": [
        { "category": "fuel", "percentage": 66.67 },
        { "category": "parking", "percentage": 33.33 }
      ],
      "incomeByPlatformPercentage": [
        { "platform": "yummy", "percentage": 60.00 },
        { "platform": "ridery", "percentage": 40.00 }
      ]
    }
  }
}
```

---

#### Reporte de Viajes
- **Método**: `GET`
- **Ruta**: `/api/reports/rides`
- **Requiere autenticación**: Sí
- **Parámetros de query requeridos**: `from`, `to`

**Respuesta exitosa (200)**:
```json
{
  "message": "Reporte obtenido exitosamente",
  "data": {
    "period": { /* período */ },
    "kpis": {
      "totalIncome": 500.00,
      "totalRides": 25,
      "avgIncomePerRide": 20.00
    },
    "charts": {
      "incomeByDay": [ /* ingresos por día */ ],
      "incomeByPlatform": [
        { "platform": "yummy", "amount": 300.00, "percentage": 60.00 },
        { "platform": "ridery", "amount": 200.00, "percentage": 40.00 },
        { "platform": "particular", "amount": 0.00, "percentage": 0.00 }
      ]
    }
  }
}
```

---

#### Reporte de Gastos
- **Método**: `GET`
- **Ruta**: `/api/reports/expenses`
- **Requiere autenticación**: Sí
- **Parámetros de query requeridos**: `from`, `to`

**Respuesta exitosa (200)**:
```json
{
  "message": "Reporte obtenido exitosamente",
  "data": {
    "period": { /* período */ },
    "kpis": {
      "totalExpenses": 150.00
    },
    "charts": {
      "expensesByDay": [ /* gastos por día */ ],
      "expensesByCategory": [
        { "category": "fuel", "amount": 100.00, "percentage": 66.67 },
        { "category": "parking", "amount": 50.00, "percentage": 33.33 }
      ]
    }
  }
}
```

---

### Dashboard (`/api/dashboard`)

#### Dashboard Semanal
- **Método**: `GET`
- **Ruta**: `/api/dashboard/weekly`
- **Requiere autenticación**: Sí
- **Encabezado recomendado**: `X-Timezone: America/Caracas`

**Respuesta exitosa (200)**:
```json
{
  "message": "Dashboard semanal",
  "data": {
    "period": {
      "from": "2025-01-13T00:00:00Z",
      "to": "2025-01-19T23:59:59Z",
      "days": 7,
      "timezone": "America/Caracas"
    },
    "kpis": {
      "totalIncome": 750.00,
      "totalExpenses": 200.00,
      "totalRides": 35,
      "netIncome": 550.00,
      "avgIncomePerRide": 21.43
    },
    "charts": {
      "incomeByDay": [
        { "date": "2025-01-13", "amount": 100.00 },
        { "date": "2025-01-14", "amount": 150.00 }
      ]
    }
  }
}
```

---

## ❌ Manejo de Errores

La API utiliza una estructura consistente para el manejo de errores:

### Formato de Respuesta de Error
```json
{
  "message": "Descripción del error",
  "errors": [
    {
      "field": "campo",
      "message": "Error específico"
    }
  ]
}
```

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Error de validación |
| 401 | No autorizado (token inválido o ausente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

### Errores Comunes

| Escenario | Código | Mensaje |
|-----------|--------|---------|
| Token no proporcionado | 401 | "Token no proporcionado" |
| Token inválido | 401 | "Token inválido" |
| Usuario no existe | 401 | "Usuario no existe" |
| Contraseña incorrecta | 401 | "Contraseña incorrecta" |
| Viaje/gasto no encontrado | 404 | "No existe un viaje con el id {id}" |
| Validación fallida | 400 | "Error de validación" con detalles |

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (10 rounds de sal)
- **Tokens JWT**: Expiran en 1 hora
- **Autorización**: Validación requerida del esquema Bearer
- **Validación**: Todos los inputs son validados con Zod
- **SQL Injection**: Previsto mediante Prisma ORM

## 📊 Modelos de Datos

### Usuario
```typescript
{
  id: string           // UUID
  email: string        // Único
  password: string     // Hasheado
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Viaje
```typescript
{
  id: string              // UUID
  amount: Decimal(10,2)
  platform: 'yummy' | 'ridery' | 'particular'
  date: DateTime
  userId: string          // FK a User
}
```

### Gasto
```typescript
{
  id: string
  amount: Decimal(10,2)
  description?: string
  date: DateTime
  category: 'fuel' | 'maintenance' | 'food' | 'insurance' | 'parking' | 'phone' | 'tolls' | 'other'
  subcategory?: string
  userId: string
}
```

## 🧪 Desarrollo

### Estructura de Archivos Generados

El cliente Prisma se genera en `src/generated/prisma/` y no debe modificarse manualmente.

### Recargar Servidor en Desarrollo

El servidor se reinicia automáticamente cuando se detectan cambios en archivos `.ts` dentro de `src/`.

### Migraciones de Base de Datos

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Revertir última migración
npx prisma migrate rollback
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuciones

1. Fork del repositorio
2. Crear rama de feature
3. Commit de cambios
4. Push a la rama
5. Abrir Pull Request

---

**Ride Balance API** - Gestiona tus finanzas de conductor de forma inteligente 🚗💰
