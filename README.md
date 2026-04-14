# 🚗 Ride Balance API

API REST para conductores de plataformas de transporte (Yummy, Ridery, Particular) que permite registrar viajes, gastos, y obtener reportes financieros detallados.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Directorios](#estructura-de-directorios)
- [Base de Datos](#base-de-datos)
- [API Reference](#api-reference)
- [Infraestructura (Terraform + AWS + Cloudflare)](#infraestructura-terraform--aws--cloudflare)
- [Nginx (Reverse Proxy + SSL)](#nginx-reverse-proxy--ssl)
- [CI/CD Pipeline (GitLab)](#cicd-pipeline-gitlab)
- [Testing](#testing)
- [Docker](#docker)
- [Variables de Entorno](#variables-de-entorno)
- [Desarrollo Local](#desarrollo-local)

---

## Descripción

**Ride Balance** es una API diseñada para ayudar a conductores independientes a llevar un control financiero de su actividad. Permite registrar ingresos (viajes) y egresos (gastos) segmentados por plataforma y categoría, con soporte para reportes semanales y mensuales.

---

## Tecnologías

### Backend

| Tecnología | Uso |
|---|---|
| **Node.js 20** | Runtime |
| **Express 5** | Framework HTTP |
| **TypeScript 5** | Tipado estático |
| **Prisma 7** | ORM + migraciones |
| **PostgreSQL 15** | Base de datos relacional |
| **JWT (jsonwebtoken)** | Autenticación stateless |
| **bcrypt** | Hash de contraseñas |
| **Zod 4** | Validación de esquemas |
| **date-fns / date-fns-tz** | Manejo de fechas con timezone |
| **pg** | Adapter nativo de PostgreSQL |

### Infraestructura & DevOps

| Tecnología | Uso |
|---|---|
| **Docker + Docker Compose** | Contenedores (dev, test, prod) |
| **Terraform** | IaC — provisión de infraestructura en AWS |
| **AWS EC2 (t3.micro)** | Servidor de producción |
| **AWS S3** | Backend remoto del estado de Terraform |
| **Cloudflare** | DNS, proxy, protección DDoS |
| **Nginx (alpine)** | Reverse proxy + SSL termination |
| **GitLab CI/CD** | Pipeline automatizado |

### Testing

| Tecnología | Uso |
|---|---|
| **Jest 30** | Test runner |
| **ts-jest** | Soporte TypeScript en Jest |
| **Supertest** | Tests de integración HTTP |
| **jest-mock-extended** | Mocking tipado |

---

## Arquitectura del Proyecto

```
Internet
   │
   ▼
Cloudflare (DNS Proxy + DDoS Protection)
   │
   ▼ HTTPS (443) / HTTP redirect (80)
AWS EC2 — Ubuntu 22.04 (t3.micro)
   │
   ▼
Nginx (Reverse Proxy + SSL/TLS)
   │
   ▼ http://ride-balance-api:3000
Express API (Docker container)
   │
   ▼
PostgreSQL (Database)
```

**Seguridad de red:** El Security Group de EC2 acepta tráfico HTTP/HTTPS **únicamente** desde los rangos IP de Cloudflare (Managed Prefix List). El acceso SSH es el único puerto abierto al mundo.

---

## Estructura de Directorios

```
ride-balance/
├── src/
│   ├── app.ts                  # Configuración de Express + rutas
│   ├── server.ts               # Entry point
│   ├── controllers/            # Lógica de request/response
│   │   ├── auth.controller.ts
│   │   ├── rides.controller.ts
│   │   ├── expenses.controller.ts
│   │   ├── report.controller.ts
│   │   └── dashboard.controller.ts
│   ├── routes/                 # Definición de endpoints + middlewares
│   │   ├── auth.route.ts
│   │   ├── rides.route.ts
│   │   ├── expenses.route.ts
│   │   ├── reports.route.ts
│   │   └── dashboard.route.ts
│   ├── services/               # Lógica de negocio
│   ├── models/                 # Queries a la base de datos (Prisma)
│   ├── schemas/                # Validación con Zod
│   ├── middlewares/
│   │   ├── auth.ts             # JWT authenticate
│   │   ├── validate.ts         # Body/params/query validators
│   │   └── errorHandler.ts     # Global error handler
│   ├── errors/
│   │   └── AppError.ts         # Clase de error personalizada
│   ├── types/                  # Tipos TypeScript globales
│   ├── utils/                  # Utilidades (fechas, helpers)
│   └── generated/              # Cliente Prisma generado (auto)
├── prisma/
│   ├── schema.prisma           # Esquema de la base de datos
│   └── migrations/             # Historial de migraciones
├── tests/
│   ├── unit/                   # Tests unitarios (controllers, services, models)
│   │   ├── controllers/
│   │   ├── services/
│   │   └── models/
│   └── integration/            # Tests de integración E2E (Supertest)
│       ├── auth.test.ts
│       ├── rides.test.ts
│       ├── expenses.test.ts
│       ├── reports.test.ts
│       ├── dashboard.test.ts
│       └── health.test.ts
├── terraform/
│   ├── providers.tf            # Providers AWS + Cloudflare + backend S3
│   ├── main.tf                 # EC2, Security Group, DNS, Prefix List
│   └── outputs.tf              # Output: IP pública del servidor
├── Dockerfile                  # Build multi-stage para producción
├── Dockerfile.dev              # Build para desarrollo con hot-reload
├── docker-compose.yml          # Stack de producción (API + Nginx)
├── docker-compose.dev.yml      # Stack de desarrollo (API + PostgreSQL)
├── docker-compose.test.yml     # Stack para tests de integración (PostgreSQL aislado)
├── nginx.conf                  # Configuración de Nginx (reverse proxy + SSL)
├── .gitlab-ci.yml              # Pipeline CI/CD completo
├── jest.config.js              # Configuración de Jest (ESM + ts-jest)
└── .env.example                # Plantilla de variables de entorno
```

---

## Base de Datos

Esquema gestionado con **Prisma** y **PostgreSQL 15**.

### Modelos

#### `User`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Clave primaria |
| `email` | String (unique) | Email del usuario |
| `password` | String | Hash bcrypt |
| `name` | String | Nombre del conductor |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de actualización |

#### `Ride` (Viaje / Ingreso)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Clave primaria |
| `amount` | Decimal(10,2) | Monto del viaje |
| `platform` | Enum | `yummy`, `ridery`, `particular` |
| `date` | DateTime | Fecha del viaje |
| `userId` | UUID | Relación con User |

#### `Expense` (Gasto / Egreso)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Clave primaria |
| `amount` | Decimal(10,2) | Monto del gasto |
| `description` | String? | Descripción opcional |
| `date` | DateTime | Fecha del gasto |
| `category` | Enum | Categoría principal |
| `subcategory` | Enum? | Subcategoría opcional |
| `userId` | UUID | Relación con User |

#### Categorías de gastos (`ExpenseCategory`)
`fuel`, `maintenance`, `food`, `insurance`, `parking`, `phone`, `tolls`, `other`

#### Subcategorías de gastos (`ExpenseSubcategory`)
`fuel_refill`, `oil_change`, `oil_refill`, `repair`, `spare_part`, `tire`, `brake`, `battery`, `cleaning`, `accessory`, `unknown`

---

## API Reference

Base URL: `https://ridebalance.com/api`

### Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

### Health

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | ❌ | Estado de la API |

### Auth (`/api/auth`)

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registro de usuario |
| `POST` | `/auth/login` | ❌ | Inicio de sesión (retorna JWT) |
| `POST` | `/auth/logout` | ✅ | Cierre de sesión |
| `GET` | `/auth/me` | ✅ | Perfil del usuario autenticado |
| `PATCH` | `/auth/me` | ✅ | Actualizar perfil |
| `DELETE` | `/auth/me` | ✅ | Eliminar cuenta |

### Rides / Viajes (`/api/rides`)

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/rides` | ✅ | Registrar un viaje |
| `GET` | `/rides` | ✅ | Listar todos los viajes del usuario |
| `GET` | `/rides/:id` | ✅ | Obtener un viaje por ID |
| `PATCH` | `/rides/:id` | ✅ | Actualizar un viaje |
| `DELETE` | `/rides/:id` | ✅ | Eliminar un viaje |

### Expenses / Gastos (`/api/expenses`)

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/expenses` | ✅ | Registrar un gasto |
| `GET` | `/expenses` | ✅ | Listar todos los gastos del usuario |
| `GET` | `/expenses/:id` | ✅ | Obtener un gasto por ID |
| `PATCH` | `/expenses/:id` | ✅ | Actualizar un gasto |
| `DELETE` | `/expenses/:id` | ✅ | Eliminar un gasto |

### Reports / Reportes (`/api/reports`)

Aceptan query params: `?from=YYYY-MM-DD&to=YYYY-MM-DD`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/reports/summary` | ✅ | Resumen financiero (ingresos - gastos) |
| `GET` | `/reports/rides` | ✅ | Reporte detallado de viajes por período |
| `GET` | `/reports/expenses` | ✅ | Reporte detallado de gastos por período |

### Dashboard (`/api/dashboard`)

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/dashboard/weekly` | ✅ | Resumen financiero de la semana actual |

---

## Infraestructura (Terraform + AWS + Cloudflare)

La infraestructura está completamente definida como código en el directorio `terraform/`.

### Backend Remoto (S3)

El estado de Terraform se almacena de forma remota y segura en un bucket de S3:

```hcl
# terraform/providers.tf
backend "s3" {
  bucket       = "ridebalance-terraform-state-890606434054-us-east-2-an"
  key          = "ride-balance/terraform.tfstate"
  region       = "us-east-2"
  encrypt      = true
  use_lockfile = true  # Locking nativo de S3 (sin necesidad de DynamoDB)
}
```

### Providers

- **AWS** `~> 6.0` — región `us-east-2`
- **Cloudflare** `~> 5`

### Recursos provisionados (`main.tf`)

#### 1. Cloudflare Managed Prefix List
Obtiene dinámicamente los rangos IPv4 de Cloudflare para usarlos en las reglas del Security Group:

```hcl
data "cloudflare_ip_ranges" "cloudflare" {}

resource "aws_ec2_managed_prefix_list" "cloudflare_list" {
  name           = "Cloudflare-Dynamics-IPs"
  address_family = "IPv4"
  max_entries    = length(data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs)
  # ...
}
```

#### 2. Cloudflare DNS (A Record)
Crea un registro `A` en el dominio `ridebalance.com` apuntando a la IP pública de EC2, con el **proxy de Cloudflare activado** (modo naranja):

```hcl
resource "cloudflare_dns_record" "api_dns" {
  zone_id = data.cloudflare_zone.my_zone.id
  name    = "@"
  content = aws_instance.ride_balance_server.public_ip
  type    = "A"
  proxied = true
}
```

#### 3. AWS Security Group
Reglas de firewall estrictas:

| Puerto | Protocolo | Origen | Descripción |
|---|---|---|---|
| `80` | TCP | Cloudflare IPs únicamente | HTTP |
| `443` | TCP | Cloudflare IPs únicamente | HTTPS |
| `22` | TCP | `0.0.0.0/0` | SSH |
| `0` | ALL | `0.0.0.0/0` | Egress |

> **Importante:** El tráfico HTTP/HTTPS solo es aceptado desde los rangos de Cloudflare. Intentar acceder directamente a la IP pública del servidor devolverá conexión rechazada.

#### 4. AWS EC2 (t3.micro)
- **AMI:** Ubuntu 22.04 LTS (Jammy, HVM, SSD) — última versión
- **Tipo:** `t3.micro`
- **Key Pair:** `ride-balance-key`
- **User Data:** Script de arranque que instala Docker CE y Docker Compose automáticamente

```hcl
resource "aws_instance" "ride_balance_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = "ride-balance-key"
  # ...
}
```

### Outputs

| Output | Descripción |
|---|---|
| `server_public_ip` | IP pública del servidor EC2 de producción |

### Uso de Terraform

```bash
cd terraform

# Inicializar providers y backend S3
terraform init

# Validar sintaxis
terraform validate

# Ver plan de cambios
terraform plan -out=tfplan

# Aplicar cambios
terraform apply tfplan
```

---

## Nginx (Reverse Proxy + SSL)

Nginx corre como contenedor Docker (`nginx:alpine`) y actúa como punto de entrada a la aplicación.

### Comportamiento

| Petición | Comportamiento |
|---|---|
| `http://ridebalance.com` | Redirección 301 → HTTPS |
| `https://ridebalance.com/api/*` | Proxy inverso → API en puerto 3000 |
| `https://ridebalance.com/` | Redirección a `/api/health` |
| Cualquier otro `HOST` (acceso directo por IP) | Cierre de conexión (444) |

### SSL/TLS
- Protocolos: `TLSv1.2`, `TLSv1.3`
- Certificados: montados en `/etc/nginx/ssl/cert.pem` y `/etc/nginx/ssl/key.pem`
- Compresión `gzip` habilitada para `JSON` y `JavaScript`

### Headers de proxy
```nginx
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

---

## CI/CD Pipeline (GitLab)

El pipeline está definido en `.gitlab-ci.yml` con **6 etapas** que cubren desde la validación de infraestructura hasta el despliegue en producción.

### Etapas

```
infra_validate → infra_plan → infra_apply → test → build → deploy
```

| Etapa | Job | Branch(es) | Manual |
|---|---|---|---|
| `infra_validate` | `tf_validate` | MRs a `main`, `develop`, `main` (cambios en `terraform/`) | ❌ |
| `infra_plan` | `tf_plan` | `main` (cambios en `terraform/`) | ❌ |
| `infra_apply` | `tf_apply` | `main` (cambios en `terraform/`) | ✅ |
| `test` | `test_api` | MRs, `develop`, `main` | ❌ |
| `build` | `build_staging` | `develop` | ❌ |
| `build` | `build_production` | `main` | ❌ |
| `deploy` | `deploy_staging` | `develop` | ❌ |
| `deploy` | `deploy_production` | `main` | ✅ |

### Etapas de Terraform (CI)

- **`tf_validate`:** Ejecuta `terraform validate` para verificar sintaxis.
- **`tf_plan`:** Genera el plan y lo guarda como artefacto de GitLab para la siguiente etapa.
- **`tf_apply`:** Aplica el plan (manual). Exporta la IP del servidor como variable `dotenv` para que sea consumida por el job de deploy.

### Etapa de Tests (CI)

Usa `node:20-slim` con un servicio `postgres:15-alpine` integrado. Ejecuta la suite completa:
```bash
npm ci
npx prisma generate
npx prisma db push --accept-data-loss
npm test
```

### Etapas de Build

Construye y publica imágenes Docker en el **GitLab Container Registry**:
- `staging` → tag `:staging`
- `production` → tag `:latest`

### Deploy a Producción

El job `deploy_production` (manual, solo en `main`):
1. Copia los certificados SSL al servidor vía `scp`.
2. Copia `docker-compose.yml` y `nginx.conf` al servidor.
3. Hace SSH al servidor y ejecuta:
   - `docker login` al GitLab Registry
   - `docker compose pull` (imagen nueva)
   - `docker compose run --rm ... npx prisma migrate deploy` (migraciones)
   - `docker compose up -d` (reinicio sin downtime)
   - `docker image prune -f` (limpieza)

### Variables de CI/CD requeridas en GitLab

| Variable | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Credencial AWS para Terraform |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS para Terraform |
| `AWS_DEFAULT_REGION` | Región AWS (`us-east-2`) |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare para Terraform |
| `SSH_PRIVATE_KEY` | Clave privada SSH para acceder al servidor EC2 |
| `SERVER_USER` | Usuario SSH (e.g. `ubuntu`) |
| `SSL_CERT` | Contenido del certificado SSL (cert.pem) |
| `SSL_KEY` | Contenido de la clave privada SSL (key.pem) |
| `PRODUCTION_DATABASE_URL` | URL de conexión a la BD de producción |
| `PRODUCTION_JWT_SECRET` | Secret para firmar tokens JWT en producción |
| `PORT` | Puerto de la API (e.g. `3000`) |

---

## Testing

### Estrategia

| Tipo | Tecnología | Alcance |
|---|---|---|
| **Unit** | Jest + jest-mock-extended | Controllers, services, models (con mocks) |
| **Integration** | Jest + Supertest | Endpoints HTTP completos contra BD real |

### Tests de integración cubiertos

- `health.test.ts` — Health check del servidor
- `auth.test.ts` — Registro, login, perfil, actualización, eliminación
- `rides.test.ts` — CRUD completo de viajes
- `expenses.test.ts` — CRUD completo de gastos
- `reports.test.ts` — Resumen, reporte de viajes, reporte de gastos
- `dashboard.test.ts` — Dashboard semanal

### Comandos

```bash
# Ejecutar todos los tests (unit + integration)
npm test

# Solo tests unitarios
npm run test:unit

# Solo tests de integración (requiere BD activa)
npm run test:integration

# Levantar BD de test en Docker
npm run docker:test

# Aplicar esquema en BD de test
npm run docker:test:setup
```

### Tests en CI

El pipeline de GitLab levanta automáticamente un servicio de PostgreSQL efímero para los tests de integración. No se requiere configuración adicional.

### Configuración de Jest

- Preset: `ts-jest/presets/default-esm` (soporte ESM + TypeScript)
- Entorno: `node`
- Los tests de integración corren con `--runInBand` para ejecución secuencial y evitar conflictos de BD.

---

## Docker

### Imágenes disponibles

| Archivo | Entorno | Descripción |
|---|---|---|
| `Dockerfile` | Producción | Multi-stage build: builder → runner mínimo |
| `Dockerfile.dev` | Desarrollo | Con hot-reload via Nodemon |

### Docker Compose

| Archivo | Entorno | Servicios |
|---|---|---|
| `docker-compose.dev.yml` | Desarrollo | API (hot-reload) + PostgreSQL |
| `docker-compose.yml` | Producción | API (imagen registry) + Nginx |
| `docker-compose.test.yml` | Testing | PostgreSQL aislado para tests locales |

### Dockerfile de producción (multi-stage)

```
Stage 1 (builder):
  node:20-slim → npm ci → prisma generate → tsc build → npm prune --production

Stage 2 (runner):
  node:20-slim → copia solo dist/, node_modules, prisma
  CMD: npx prisma migrate deploy && node dist/server.js
```

### Comandos Docker útiles

```bash
# Desarrollo local con hot-reload
npm run docker:dev

# Ver logs de todos los servicios
npm run docker:logs

# Ver logs solo de la API
npm run docker:logs:api

# Ver logs solo de la DB
npm run docker:logs:db

# Detener servicios de desarrollo
npm run docker:stop
```

---

## Variables de Entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

### `.env` (desarrollo local)

```env
# Puerto de la API
PORT=3000

# Conexión a la base de datos
DATABASE_URL=postgresql://USUARIO:PASSWORD@HOST_DE_TU_BD:5432/TU_DATABASE

# Secret para JWT
JWT_SECRET=TU_JWT_SECRET_AQUI

# Credenciales para el contenedor local de Postgres (docker-compose.dev.yml)
DB_USER=tu_usuario_local
DB_PASSWORD=tu_password_local
DB_NAME=nombre_db_local
DB_PORT=5432
```

### `.env.test` (tests de integración locales)

```env
DATABASE_URL=postgresql://testuser:testpassword@localhost:5434/ridebalance_test
JWT_SECRET=test-secret
DB_USER=testuser
DB_PASSWORD=testpassword
DB_NAME=ridebalance_test
DB_PORT=5434
```

---

## Desarrollo Local

### Prerrequisitos

- Node.js 20+
- Docker + Docker Compose
- (Opcional) PostgreSQL local

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd ride-balance

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Levantar la API + DB con Docker
npm run docker:dev

# 5. (Primera vez) Aplicar esquema de BD
npx prisma db push

# La API está disponible en http://localhost:3000
```

### Flujo de desarrollo recomendado

```
feature/* → develop → main
```

- Los PRs/MRs a `main` y `develop` ejecutan automáticamente los tests.
- Los merges a `develop` construyen la imagen `:staging`.
- Los merges a `main` construyen la imagen `:latest` y permiten desplegar a producción manualmente.
