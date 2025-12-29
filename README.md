# Ride Balance API

API para la aplicación Ride Balance, diseñada para ayudar a los conductores a llevar un control de sus ganancias de plataformas de ride-sharing como Uber, Yummy, Ridery y Particular.

## Descripción

Ride Balance es una herramienta que permite a los conductores registrar y gestionar sus viajes, incluyendo montos, fechas y plataformas utilizadas. Esta API proporciona endpoints para crear, leer, actualizar y eliminar registros de viajes, facilitando el seguimiento financiero y el balance de ingresos.

## Características

- **Gestión completa de viajes (CRUD)**: Crear, obtener, actualizar y eliminar viajes.
- **Soporte para múltiples plataformas**: Yummy, Ridery, Particular.
- **Tipos TypeScript**: Interfaces definidas para asegurar consistencia en los datos.
- **Express con ESM**: Configurado para módulos ES modernos.
- **Hot-reload en desarrollo**: Usando nodemon para recarga automática.

## Requisitos

- Node.js 18+ (recomendado para soporte nativo de ESM)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd ride-balance-api
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz con las variables de entorno necesarias:
   ```
   PORT=3000
   ```

4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```

## Scripts disponibles

- `npm run dev`: Ejecuta nodemon para desarrollo con hot-reload.
- `npm run build`: Compila TypeScript a JavaScript en `dist/`.
- `npm run start`: Ejecuta la aplicación compilada.

## Endpoints de la API

La API está disponible bajo el prefijo `/api/rides`.

### Crear un viaje
- **POST** `/api/rides`
- **Body** (JSON):
  ```json
  {
    "amount": 25.50,
    "platform": "Yummy"
  }
  ```
- **Respuesta**: El viaje creado con ID generado.

### Obtener todos los viajes
- **GET** `/api/rides`
- **Respuesta**: Lista de todos los viajes.

### Obtener un viaje por ID
- **GET** `/api/rides/:id`
- **Respuesta**: Detalles del viaje específico.

### Actualizar un viaje
- **PATCH** `/api/rides/:id`
- **Body** (JSON): Campos a actualizar (ej. `amount`, `platform`).
- **Respuesta**: El viaje actualizado.

### Eliminar un viaje
- **DELETE** `/api/rides/:id`
- **Respuesta**: Confirmación de eliminación.

## Estructura del proyecto

```
src/
  app.ts              # Archivo principal de la aplicación
  controllers/         # Controladores (ej. rides.controller.ts)
  models/              # Modelos de datos (ej. rides.model.ts)
  routes/              # Rutas (ej. rides.route.ts)
  types/               # Definiciones de tipos TypeScript (ej. rides.ts)
dist/                  # Salida compilada
```

## Tecnologías utilizadas

- **Express.js**: Framework web para Node.js.
- **TypeScript**: Para tipado estático.
- **ESM**: Módulos ES modernos.
- **CORS**: Para manejo de solicitudes cross-origin.
- **Dotenv**: Para variables de entorno.

## Contribuciones

Si deseas contribuir, abre un issue o un pull request con tus mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
