# Ride Balance API

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/EmersonTejada/ride-balance)
[![Hosted on](https://img.shields.io/badge/Hosted_on-AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://ridebalance.com)
[![Pipeline Status](https://img.shields.io/gitlab/pipeline-status/EmersonTejada/ride-balance?branch=main&style=for-the-badge)](https://gitlab.com/EmersonTejada/ride-balance/-/commits/main)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-1.14-844FBA?style=for-the-badge&logo=terraform&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30-C21325?style=for-the-badge&logo=jest&logoColor=white)

API RESTful para la gestión financiera de conductores de plataformas de ride-sharing. Permite registrar viajes, gastos, generar reportes y visualizar dashboards con métricas de ingresos y rentabilidad.

> **Este proyecto utiliza GitLab CI/CD para el despliegue automático en AWS EC2, con infraestructura gestionada por Terraform, protegida por Cloudflare y monitorizada con Grafana, Prometheus y Loki.** Puedes ver la configuración del pipeline [aquí en GitLab](https://gitlab.com/EmersonTejada/ride-balance).

## 📋 Descripción

Ride Balance API es una aplicación backend diseñada específicamente para conductores de servicios como Yummy, Ridery y Uber. La API proporciona funcionalidades completas para:

- **Gestión de ingresos**: Registro y seguimiento de viajes por plataforma
- **Control de gastos**: Categorización de gastos operativos (combustible, mantenimiento, etc.)
- **Reportes y analytics**: Resúmenes financieros, análisis por período y plataforma
- **Dashboard semanal**: Vista consolidada de métricas clave de la semana actual

## 🔴 Live Demo (AWS EC2)

¡Prueba la API en vivo! Está desplegada en una instancia EC2 de AWS (provisionada con Terraform), corriendo en Docker, con Nginx como proxy inverso, certificados SSL y protegida detrás de Cloudflare:

👉 **[https://ridebalance.com/api](https://ridebalance.com/api)**

---

## 🏗️ Arquitectura de la Aplicación

Los datos viajan de manera eficiente y segura a través de las siguientes capas:

```mermaid
graph LR
    A[React \n Frontend] -->|HTTPS| CF[Cloudflare \n CDN / Proxy]
    CF -->|HTTPS| N[Nginx \n Reverse Proxy]
    N -->|HTTP:3000| B(Express.js \n API / Backend)
    N -->|Proxy| V[Vercel \n Frontend Host]
    B -->|Prisma Client| C{Supabase \n PostgreSQL}
    B -.->|Logs| PR[Promtail]
    PR -.->|Push| L[Loki]
    P[Prometheus] -.->|Scrape| NE[Node Exporter]
    P -.->|Scrape| CA[cAdvisor]
    L -.-> G[Grafana \n Dashboards]
    P -.-> G
```

- **CDN / Proxy**: Cloudflare como proxy DNS, protección DDoS y capa de seguridad perimetral.
- **Frontend**: SPA construida en React, hosteada en Vercel y servida a través de Nginx como proxy inverso.
- **Proxy Inverso**: Nginx para manejar certificados SSL, compresión gzip, enrutar `/api/` al backend y `/` al frontend en Vercel. También expone `monitor.ridebalance.com` para Grafana.
- **Backend**: Servidor Express con validación Zod y autenticación JWT.
- **ORM**: Prisma para garantizar la seguridad de tipos entre TypeScript y la BD.
- **Base de Datos**: PostgreSQL alojada remotamente en Supabase.
- **Observabilidad**: Stack de monitoreo con Grafana (dashboards), Prometheus + Node Exporter + cAdvisor (métricas de sistema y contenedores) y Loki + Promtail (logs centralizados).

### 🗂️ Estructura de Carpetas

La API sigue una arquitectura modular:

```
src/
├── app.ts                    # Punto de entrada de la aplicación
├── server.ts                 # Arranque del servidor HTTP
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

deployments/
├── docker/
│   ├── docker-compose.yml          # Compose de producción (API + Nginx)
│   ├── docker-compose.dev.yml      # Compose de desarrollo (API + DB local)
│   ├── docker-compose.test.yml     # Compose de testing (DB efímera)
│   └── docker-compose.monitor.yml  # Compose de monitoreo (Grafana, Prometheus, Loki...)
├── nginx/
│   └── nginx.conf                  # Configuración de Nginx (reverse proxy)
├── terraform/
│   ├── providers.tf                # Proveedores AWS + Cloudflare y backend S3
│   ├── main.tf                     # Recursos: EC2, Security Groups, Cloudflare DNS
│   └── outputs.tf                  # Outputs (IP pública del servidor)
├── prometheus/
│   └── prometheus.yml              # Configuración de scrape targets
├── loki/
│   └── local-config.yml            # Configuración de Loki (almacenamiento, retención)
└── promtail/
    └── config.yml                  # Configuración de Promtail (recolección de logs)

tests/
├── unit/
│   ├── controllers/         # Tests unitarios de controladores
│   ├── models/              # Tests unitarios de modelos
│   └── services/            # Tests unitarios de servicios
└── integration/             # Tests de integración (API endpoints completos)
```

## 🚀 Características

- **Autenticación segura**: JWT mediante Authorization Bearer Header
- **Validación robusta**: Esquemas Zod para validación de datos
- **Base de datos**: PostgreSQL con Prisma ORM
- **TypeScript**: Tipado estático completo
- **Timezone awareness**: Soporte para zonas horarias en reportes
- **ES Modules**: Módulos ES modernos
- **Infrastructure as Code**: Infraestructura gestionada con Terraform (AWS + Cloudflare)
- **Seguridad perimetral**: Cloudflare como proxy DNS con protección DDoS
- **Testing automatizado**: Suite completa de tests unitarios e integración con Jest y Supertest
- **Observabilidad**: Monitoreo con Grafana, Prometheus (métricas de sistema/contenedores) y Loki + Promtail (logs centralizados)

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
| Jest 30 | Framework de testing |
| Supertest | Testing de endpoints HTTP |
| Grafana | Dashboards de monitoreo |
| Prometheus | Recolección de métricas |
| Loki + Promtail | Agregación de logs |

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
2. Clona el repositorio y crea tu archivo `.env` tomando como ejemplo `.env.example`.
3. Para iniciar el entorno de desarrollo local (Base de datos Postgres + API con live-reloading usando nodemon):

```bash
npm run docker:dev
```

O si prefieres usar el comando de Docker Compose en segundo plano (`-d`):
```bash
docker compose -f docker-compose.dev.yml up --build -d
```

¡Y listo! La API estará disponible localmente en el puerto definido en tu `.env` (generalmente `http://localhost:3000`).

## 🔄 Pipeline CI/CD (GitLab)

El proyecto cuenta con un flujo CI/CD completamente automatizado en GitLab con **6 etapas** que cubren infraestructura, testing, build y despliegue:

1. **Infra Validate**: Ejecuta `terraform validate` para verificar la sintaxis y consistencia de los archivos Terraform. Se activa en MRs hacia `main` o en pushes a `develop`/`main` cuando hay cambios en `deployments/terraform/`.
2. **Infra Plan**: Genera un plan de ejecución (`terraform plan`) y lo guarda como artefacto para revisión. Solo se ejecuta en la rama `main`.
3. **Infra Apply**: Aplica los cambios de infraestructura con `terraform apply` de forma **manual** (requiere aprobación). Exporta la IP del servidor como variable para las etapas siguientes.
4. **Test**: Ejecuta la suite completa de pruebas unitarias e integración usando Jest, Supertest y un servicio PostgreSQL efímero en el runner.
5. **Build**: Construye la imagen de Docker de producción (multi-stage) y la sube al Container Registry de GitLab. Genera imágenes separadas para `staging` y `production`.
6. **Deploy**: Despliega en la instancia EC2 mediante SSH. Transfiere certificados SSL, `docker-compose.yml`, `docker-compose.monitor.yml`, `nginx.conf` y las configuraciones del stack de monitoreo (Promtail, Prometheus, Loki) al servidor. Crea los directorios con permisos adecuados, descarga las imágenes, aplica migraciones con Prisma y reinicia los servicios (API + monitoreo). Requiere **aprobación manual** en producción.

*(Estado en tiempo real del Pipeline)*
[![pipeline status](https://gitlab.com/EmersonTejada/ride-balance/badges/main/pipeline.svg)](https://gitlab.com/EmersonTejada/ride-balance/-/commits/main)

## 📡 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor con hot-reload usando nodemon |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm run start` | Ejecuta la aplicación compilada |
| `npm run test` | Ejecuta la suite completa de pruebas (unit + integration) |
| `npm run test:unit` | Ejecuta solo las pruebas unitarias |
| `npm run test:integration` | Ejecuta solo las pruebas de integración |
| `npm run docker:dev` | Inicia el entorno Docker de desarrollo (API + DB local) |
| `npm run docker:stop`| Detiene los servicios de Docker local en desarrollo |
| `npm run docker:logs`| Muestra los logs en vivo de los contenedores Docker dev |
| `npm run docker:logs:api`| Muestra los logs en vivo solo del contenedor de la API |
| `npm run docker:logs:db`| Muestra los logs en vivo solo del contenedor de la BD |
| `npm run docker:test`| Levanta la base de datos de testing en Docker |
| `npm run docker:test:setup`| Aplica el schema Prisma a la BD de testing |
| `npm run docker:monitor`| Levanta el stack de monitoreo (Grafana, Prometheus, Loki...) |
| `npm run docker:monitor:stop`| Detiene el stack de monitoreo |
| `npm run docker:monitor:logs`| Muestra los logs en vivo del stack de monitoreo |

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

**Subcategorías disponibles**:
| Subcategoría | Descripción |
|--------------|-------------|
| `fuel_refill` | Recarga de combustible |
| `oil_change` | Cambio de aceite |
| `oil_refill` | Recarga de aceite |
| `repair` | Reparación general |
| `spare_part` | Repuestos |
| `tire` | Llantas |
| `brake` | Frenos |
| `battery` | Batería |
| `cleaning` | Limpieza del vehículo |
| `accessory` | Accesorios |
| `unknown` | Otros / sin especificar |

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
- **Cloudflare Proxy**: Todo el tráfico pasa por Cloudflare (protección DDoS, WAF, rate limiting)
- **Security Groups**: La instancia EC2 solo acepta tráfico HTTP/HTTPS desde IPs de Cloudflare (Prefix List dinámica gestionada por Terraform)
- **SSL/TLS**: Nginx configurado con TLSv1.2 y TLSv1.3, ciphers seguros y session cache
- **Default Server Block**: Nginx rechaza (444) conexiones directas por IP o dominios no autorizados

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

## 🧪 Testing

El proyecto cuenta con una suite de pruebas automatizadas organizada en dos niveles:

### Tests Unitarios

Utilizan **Jest** con mocks para aislar cada capa (controllers, models, services) sin dependencias externas:

```bash
npm run test:unit
```

**Cobertura de tests unitarios:**
| Capa | Módulos Testeados |
|------|-------------------|
| Controllers | Auth, Rides, Expenses, Reports, Dashboard |
| Models | Auth, Rides, Expenses |
| Services | Dashboard |

### Tests de Integración

Utilizan **Supertest** contra la app Express real con una base de datos PostgreSQL dedicada (Dockerizada) para validar flujos completos:

```bash
# 1. Levantar la BD de testing
npm run docker:test

# 2. Aplicar el schema
npm run docker:test:setup

# 3. Ejecutar tests de integración
npm run test:integration
```

**Módulos con tests de integración:** Health, Auth, Rides, Expenses, Reports, Dashboard.

### Ejecutar Suite Completa

```bash
npm test
```
> Ejecuta secuencialmente: tests unitarios → tests de integración.

---

## 🌐 Infraestructura como Código (Terraform)

Toda la infraestructura de producción está definida y gestionada con **Terraform**, permitiendo crear, modificar y versionar los recursos de forma declarativa.

### Proveedores

| Proveedor | Versión | Propósito |
|-----------|---------|-----------|
| `hashicorp/aws` | ~> 6.0 | Gestión de recursos AWS (EC2, Security Groups, AMI) |
| `cloudflare/cloudflare` | ~> 5 | Gestión de DNS y proxy de Cloudflare |

### Backend Remoto (S3)

El estado de Terraform se almacena de forma remota en un bucket **S3** con cifrado habilitado y lock nativo mediante archivos de bloqueo:

```hcl
backend "s3" {
  bucket       = "ridebalance-terraform-state-..."
  key          = "ride-balance/terraform.tfstate"
  region       = "us-east-2"
  encrypt      = true
  use_lockfile = true
}
```

Esto permite:
- **Colaboración segura**: Múltiples desarrolladores pueden trabajar con el estado compartido.
- **Prevención de conflictos**: El lockfile evita aplicaciones simultáneas.
- **Cifrado en reposo**: El archivo de estado se almacena cifrado.

### Recursos Gestionados

#### AWS EC2
- **Instancia**: `t3.small` con Ubuntu 22.04 (AMI más reciente).
- **User Data**: Script de inicialización que instala Docker y Docker Compose automáticamente al crear la instancia.
- **Key Pair**: Acceso SSH mediante par de claves (`ride-balance-key`).

#### AWS Security Group
- **Puerto 443 (HTTPS)**: Solo acepta tráfico desde IPs de Cloudflare (Prefix List dinámica).
- **Puerto 80 (HTTP)**: Solo acepta tráfico desde IPs de Cloudflare (para redirección a HTTPS).
- **Puerto 22 (SSH)**: Abierto para administración remota y despliegue CI/CD.
- **Egress**: Todo el tráfico saliente permitido.

#### AWS EC2 Managed Prefix List
- Lista dinámica que se sincroniza automáticamente con los rangos IPv4 de Cloudflare usando el data source `cloudflare_ip_ranges`.
- Garantiza que la instancia EC2 **solo sea accesible a través de Cloudflare**, bloqueando tráfico directo por IP.

#### Cloudflare DNS
- **Registro A (`@`)**: Apunta `ridebalance.com` a la IP pública de la instancia EC2, con proxy habilitado (CDN, DDoS, WAF).
- **Registro A (`deploy`)**: Apunta `deploy.ridebalance.com` a la IP de la instancia EC2, **sin proxy** (DNS-only), usado para conexiones SSH directas del pipeline CI/CD.
- **Registro A (`monitor`)**: Apunta `monitor.ridebalance.com` a la IP de la instancia EC2, con proxy habilitado, para acceder a los dashboards de Grafana.

### Comandos Terraform

```bash
cd terraform

# Inicializar (descarga proveedores y configura backend S3)
terraform init

# Validar la configuración
terraform validate

# Ver plan de cambios
terraform plan

# Aplicar cambios
terraform apply
```

> ⚠️ Los comandos `plan` y `apply` en producción se ejecutan a través del pipeline CI/CD, donde `apply` requiere **aprobación manual**.

---

## 🔀 Nginx (Reverse Proxy)

Nginx actúa como punto de entrada HTTP/HTTPS en la instancia EC2, corriendo como contenedor Docker junto a la API:

### Características de la configuración

- **Redirección HTTP → HTTPS**: Todo el tráfico en puerto 80 se redirige a 443.
- **SSL/TLS**: Configurado con TLSv1.2 y TLSv1.3, ciphers seguros y session cache de 10 minutos.
- **Gzip**: Compresión habilitada para `text/plain`, `text/css`, `application/json` y `application/javascript`.
- **Default Server Block**: Retorna 444 (cierra conexión) para cualquier petición que no sea dirigida a `ridebalance.com`, protegiendo contra escaneos por IP directa.
- **Proxy Pass API**: Las peticiones a `/api/` se reenvían al contenedor de la API (`ride-balance-api:3000`) con los headers `X-Real-IP`, `X-Forwarded-For` y `X-Forwarded-Proto`.
- **Proxy Pass Frontend**: Las peticiones a `/` se reenvían al frontend hosteado en Vercel (`ride-balance.vercel.app`) con SNI habilitado.
- **Health Check silencioso**: El endpoint `/api/health` no genera logs de acceso.
- **Server Block de Monitoreo**: `monitor.ridebalance.com` redirige al contenedor de Grafana (puerto 3000) con soporte para WebSockets (`/api/live/ws`) para dashboards en tiempo real.

---

## 📊 Observabilidad (Monitoreo y Logs)

El proyecto incluye un stack de observabilidad completo para monitorear la salud del servidor, los contenedores y centralizar los logs de la aplicación:

### Componentes

| Servicio | Imagen | Propósito |
|----------|--------|-----------|
| **Grafana** | `grafana/grafana:latest` | Dashboards de visualización (métricas + logs) |
| **Prometheus** | `prom/prometheus:latest` | Recolección y almacenamiento de métricas de series temporales |
| **Node Exporter** | `prom/node-exporter:latest` | Métricas del sistema operativo (CPU, memoria, disco, red) |
| **cAdvisor** | `gcr.io/cadvisor/cadvisor:latest` | Métricas de rendimiento de contenedores Docker |
| **Loki** | `grafana/loki:latest` | Agregación y almacenamiento de logs (retención: 72h) |
| **Promtail** | `grafana/promtail:latest` | Recolección de logs de contenedores Docker vía socket |

### Acceso

- **Grafana**: Accesible en `https://monitor.ridebalance.com` (protegido por Cloudflare).
- **Prometheus**: Scrape cada 1 minuto a Node Exporter (`:9100`) y cAdvisor (`:8080`).
- **Loki**: Retención de 72 horas con compactación automática cada 10 minutos.

### Uso Local

```bash
# Levantar el stack de monitoreo
npm run docker:monitor

# Ver logs del stack
npm run docker:monitor:logs

# Detener el stack
npm run docker:monitor:stop
```

> El stack de monitoreo se levanta con un Docker Compose independiente (`docker-compose.monitor.yml`) que se conecta a la red compartida `ride_net`.

---

## 🛠️ Desarrollo

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
