# 🚀 DEMO [aquí](https://pokedex.sinapsy.es/)
---

# Local Development

1. **Clone the repository:**
   ```sh
   git clone https://github.com/JAlbertoGonzalez/pokedex.git
   cd pokedex
   ```

2. **Install dependencies:**
   ```sh
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and adjust variables if needed.
   - By default, the database is SQLite (`DATABASE_URL="file:./db.sqlite"`).

4. **Start the development server:**
   ```sh
   yarn dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

5. **Start in production:**
   ```sh
   yarn build
   PORT=4000 yarn start
   # Or with pm2:
   PORT=4000 pm2 start yarn --name pokedex -- start
   ```
---

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# Pokédex T3 - Resumen de funcionalidades

Este proyecto implementa una Pokédex moderna usando Next.js, tRPC, Prisma y React Context, con paginación infinita, cache, rate limiting y UX avanzada.

## Backend/API

- **tRPC**: Endpoints para obtener Pokémon por filtros y por slug, con tipado estricto usando Zod.
- **Cache en disco**: Resultados de búsqueda y detalles individuales cacheados usando claves md5.
- **Rate Limiting**: Protección contra abuso con `next-rate-limit`.
- **Schemas Zod**: Validación y tipado de todos los datos de entrada/salida.

## Frontend/React

- **Contexto global de filtros**: `FilterContext` y `FilterProvider` gestionan filtros, resultados, paginación, scroll y estado de carga/error.
- **Paginación infinita**: Método `loadMore` para cargar más resultados y controlar `hasMoreResults`.
- **Scroll persistente**: Guarda y restaura la posición de scroll al navegar o cambiar filtros.
- **Reset de filtros**: Limpia resultados, paginación y scroll.
- **Componentes reutilizables**: Filtros por generación, tipo, idioma, búsqueda por texto, lista y detalles de Pokémon.

## Integración y UX

- **Acumulación de resultados**: Solo al paginar, nunca al cambiar filtros.
- **Deshabilitar paginación**: Botón "Cargar más" deshabilitado y mensaje cuando no hay más resultados.
- **Actualización reactiva**: Cambios de filtros, paginación y scroll se reflejan automáticamente en la UI.

## Configuración y herramientas

- **Linting y formateo**: ESLint y Prettier configurados.
- **Tipado estricto**: TypeScript en todo el proyecto.
- **Next.js**: SSR/ISR listo para producción.
- **Prisma**: ORM para acceso a base de datos y migraciones.
