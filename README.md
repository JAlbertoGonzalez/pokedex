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

- **Acumulación de resultados**: Solo al paginación, nunca al cambiar filtros.
- **Deshabilitar paginación**: Botón "Cargar más" deshabilitado y mensaje cuando no hay más resultados.
- **Actualización reactiva**: Cambios de filtros, paginación y scroll se reflejan automáticamente en la UI.

## Configuración y herramientas

- **Linting y formateo**: ESLint y Prettier configurados.
- **Tipado estricto**: TypeScript en todo el proyecto.
- **Next.js**: SSR/ISR listo para producción.
- **Prisma**: ORM para acceso a base de datos y migraciones.

# Despliegue automático (CI/CD) en servidor personal

Este proyecto incluye un workflow de GitHub Actions para desplegar automáticamente en tu servidor personal por SSH.

## Requisitos previos

1. **Servidor con acceso SSH** y Node.js/yarn instalado.
2. **Claves SSH**: Genera una clave privada sin passphrase para usar en GitHub Actions.
3. **Configura los secrets en GitHub**:
   - `SSH_HOST`: IP o dominio del servidor
   - `SSH_USER`: usuario SSH
   - `SSH_KEY`: clave privada (contenido del archivo, formato PEM)
   - `SSH_PORT`: puerto SSH (por defecto 22)
   - `SSH_TARGET`: ruta destino en el servidor (ejemplo: `/home/usuario/pokedex`)

## Pasos para configurar el deploy

### 1. Generar clave SSH
```sh
ssh-keygen -t ed25519 -C "github-actions-deploy"
# Guarda la clave privada (id_ed25519) y pública (id_ed25519.pub)
```
- Añade la clave pública (`id_ed25519.pub`) al archivo `~/.ssh/authorized_keys` del usuario en tu servidor.
- Copia el contenido de la clave privada (`id_ed25519`) y guárdalo como secret `SSH_KEY` en GitHub.

### 2. Añadir secrets en GitHub
- Ve a tu repositorio > Settings > Secrets and variables > Actions > New repository secret
- Añade los siguientes secrets:
  - `SSH_HOST`
  - `SSH_USER`
  - `SSH_KEY`
  - `SSH_PORT`
  - `SSH_TARGET`

### 3. ¿Qué hace el workflow?
- Instala dependencias con yarn
- Copia `.env.example` a `.env`
- Compila el proyecto
- Copia todos los archivos al servidor por SSH
- Ejecuta en el servidor:
  - `yarn install --production --frozen-lockfile`
  - `yarn start`

### 4. Personalización
- Puedes modificar el script de post-deploy en `.github/workflows/deploy.yml` para reiniciar servicios, limpiar archivos, etc.

### 5. Notas
- El workflow se ejecuta automáticamente al hacer push a la rama `main`.
- Asegúrate de que el usuario SSH tenga permisos de escritura en la carpeta destino.
- Si usas PM2 u otro gestor de procesos, puedes modificar el script para reiniciar el servicio tras el deploy.

## Explicación de variables (secrets) para el deploy

- **SSH_HOST**: IP o dominio de tu servidor personal donde se hará el deploy. Ejemplo: `192.168.1.100` o `mi-servidor.com`.
- **SSH_USER**: Usuario SSH con permisos para copiar archivos y ejecutar comandos en el servidor. Ejemplo: `ubuntu`, `deploy`, `root`.
- **SSH_KEY**: Clave privada SSH (contenido del archivo, formato PEM) que usará GitHub Actions para autenticarse en el servidor. Debe generarse sin passphrase. Nunca compartas esta clave fuera de GitHub Secrets y tu máquina local.
  - ¿Cómo funciona? GitHub Actions usa esta clave para conectarse por SSH al servidor y copiar archivos o ejecutar comandos, de forma segura y automatizada. La clave pública debe estar en `~/.ssh/authorized_keys` del usuario en el servidor.
- **SSH_PORT**: Puerto SSH de tu servidor. Por defecto es `22`, pero puede ser otro si lo cambiaste por seguridad.
- **SSH_TARGET**: Ruta absoluta en el servidor donde se copiarán los archivos del proyecto. Ejemplo: `/home/ubuntu/pokedex`.

### Ejemplo de generación y uso de la clave SSH

1. Genera el par de claves:
   ```sh
   ssh-keygen -t ed25519 -C "github-actions-deploy"
   # Guarda la clave privada (id_ed25519) y pública (id_ed25519.pub)
   ```
2. Añade la clave pública al servidor:
   ```sh
   cat id_ed25519.pub >> ~/.ssh/authorized_keys
   ```
3. Copia el contenido de la clave privada (`id_ed25519`) y guárdalo como valor del secret `SSH_KEY` en GitHub.

---

## Flujo actualizado del deploy automático

Ahora el workflow de GitHub Actions solo ejecuta comandos en tu servidor personal. El proceso es:

1. Se conecta por SSH al servidor usando la clave privada configurada en los secrets.
2. Se sitúa en el directorio definido por `SSH_TARGET`.
3. Sincroniza el repositorio con los últimos cambios de la rama `main` usando:
   - `git fetch --all`
   - `git reset --hard origin/main`
4. Instala dependencias con `yarn install --frozen-lockfile`.
5. Compila el proyecto con `yarn build`.
6. Reinicia la aplicación con `pm2 restart pokedex`.

Todo el proceso ocurre en el servidor personal, por lo que no se instalan dependencias ni se compila nada en la máquina virtual de GitHub.

---
