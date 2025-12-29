
# Express + TypeScript + ESM Template

Plantilla mínima para arrancar rápidamente una aplicación con Express, TypeScript y módulos ESM. Incluye configuración para hot-reload con `nodemon`, manejo de variables de entorno con `dotenv`, `cors`, y una estructura básica lista para expandir con controladores y modelos.

## Características

- Express 5 (ESM)
- TypeScript configurado para compilar a `./dist`
- `nodemon` para hot-reload (compila y arranca al guardar)
- `dotenv` para variables de entorno
- `cors` preconfigurado
- Tipos de desarrollo (`@types/*`) incluidos

## Requisitos

- Node.js 18+ (recomendado) que soporte ESM de forma nativa
- npm o yarn

La plantilla está configurada como módulo ESM (`"type": "module"` en `package.json`).

## Estructura del proyecto

```
src/
	app.ts           # archivo principal de arranque
	controllers/     # lugar sugerido para controladores
	models/          # lugar sugerido para modelos
dist/              # salida compilada (generada por tsc)
nodemon.json
tsconfig.json
package.json
```

## Scripts disponibles

Los scripts definidos en `package.json` son:

- `npm run dev` - Ejecuta `nodemon` (observa `src`, compila y arranca automáticamente).
- `npm run build` - Ejecuta `tsc` y genera los archivos en `dist/`.
- `npm run start` - Ejecuta `node ./dist/app.js` (arranca la app compilada).

Ejemplos rápidos:

```bash
# Instalar dependencias
npm install

# Modo desarrollo (hot-reload con nodemon -> compila y arranca)
npm run dev

# Compilar a JavaScript
npm run build

# Ejecutar la versión compilada
npm run start
```

Nota sobre `nodemon`: la configuración en `nodemon.json` ejecuta `npm run build && npm run start` cuando detecta cambios en `src` con extensión `.ts`. Esto permite ver cambios rápidamente sin tener que ejecutar manualmente la compilación.

## Variables de entorno

La aplicación usa `dotenv` (en `src/app.ts` se importa `dotenv/config`). Crea un archivo `.env` en la raíz del proyecto con al menos la variable `PORT`.

Ejemplo `.env`:

```
PORT=3000
# Otras variables que quieras usar
```

Importante: `src/app.ts` usa `process.env.PORT` directamente; asegúrate de definirla o modificar `app.ts` para usar un valor por defecto (por ejemplo `process.env.PORT || 3000`).

## Notas sobre TypeScript y ESM

- `tsconfig.json` está configurado con `module: "ESNext"` y `outDir: "./dist"`. Al compilar, los archivos `.ts` se transforman a `.js` en `dist/` manteniendo el sistema de módulos ESM.
- `package.json` tiene `"type": "module"`, por lo que Node trata los `.js` como módulos ES.
- Si necesitas interoperar con paquetes CommonJS, `esModuleInterop` y `allowSyntheticDefaultImports` están habilitados.

## Buenas prácticas / Tips

- Añade un valor por defecto para `PORT` si quieres evitar errores cuando no existan variables de entorno.
- Para desarrollo más rápido sin compilar en cada cambio puedes usar `ts-node`/`ts-node-dev` (no incluido en el flujo actual), pero la configuración actual fuerza compilación completa antes de ejecutar la versión JS resultante.
- Añade rutas dentro de `src/controllers` y móntalas en `src/app.ts`.

Ejemplo mínimo para añadir una ruta (src/controllers/hello.ts):

```ts
import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => res.json({ message: 'hola' }));
export default router;
```

Y en `src/app.ts`:

```ts
import helloRouter from './controllers/hello.js';
app.use('/hello', helloRouter);
```

Nota: al importar archivos locales en ESM, incluye la extensión `.js` en los imports de los archivos compilados, o utiliza resoluciones que lo manejen en tiempo de desarrollo.

## Dependencias incluidas

Dependencias principales (según `package.json`):

- `express` ^5.1.0
- `cors` ^2.8.5
- `dotenv` ^17.2.3

Dependencias de desarrollo:

- `typescript`, `ts-node`, `nodemon` y tipos para Node, Express y Cors.

## Despliegue / Producción

1. Construir: `npm run build`
2. Establecer variables de entorno apropiadas (ej. `PORT`)
3. Ejecutar: `npm run start`

Para entornos como Docker u otras plataformas, asegúrate de usar Node 18+ y establecer `NODE_ENV=production` si corresponde.

## Problemas comunes

- Si `PORT` es `undefined` al arrancar, la app puede fallar. Añade un valor por defecto en `app.ts` o configura tu `.env`.
- Si ves errores de importación en tiempo de ejecución, confirma que `package.json` contiene `"type": "module"` y que los imports relativos en los archivos compilados apuntan a `.js` cuando corresponda.

## ¿Qué puedes añadir a la plantilla?

- Middleware de logging (morgan/pino).
- Sistema de validación (zod/joi) y manejo de errores centralizado.
- Integración con bases de datos (Prisma/TypeORM/knex).
- Tests (Jest/Vitest) y CI/CD.

## Contribuciones

Si quieres mejorar esta plantilla, abre un PR con cambios y una breve descripción de lo que agregas.


