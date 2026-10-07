# Workouts K4R

Generador privado de los artes de rutinas de Kinder for Runners (Maternal, Pre Kinder y Kinder).
Pegas la rutina tal como llega, eliges plantilla y estilo, y descargas o compartes los 3 posts (1080 × 1350).

Es privado sin pedir contraseña: cada persona entra con su **enlace de acceso personal**
(`https://k4r-workouts.netlify.app/k/<su-token>`). Se abre una vez y el dispositivo queda reconocido; la sesión
se renueva en cada uso y la app instalada en el celular abre con ese mismo enlace. Sin enlace ni sesión, y las tipografías con licencia (Gotham, Avenir Next Condensed)
viajan incrustadas solo en la página que se entrega a usuarios con sesión. No hay ningún archivo de fuente público.

En el repo las tipografías están **cifradas** (`generator/fonts/*.woff2.enc`, AES-256-GCM). Netlify las descifra
al compilar con la variable `FONTS_KEY`; sin esa clave son ilegibles, aunque alguien vea el repo.

## Publicar en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige `KinderForRunners`.
   Netlify detecta Next.js solo; el archivo `netlify.toml` ya trae la configuración de build.
2. Antes de desplegar, en **Site configuration → Environment variables** agrega:
   - `FONTS_KEY`: la clave para descifrar las tipografías (64 caracteres; guárdala en un lugar seguro).
   - `AUTH_SECRET`: un texto largo y aleatorio (mínimo 16 caracteres).
   - `APP_USERS`: un token por persona, `nombre:token` separados por coma. El token es su enlace (`/k/<token>`)
     y también sirve como clave escrita. Ej.: `julio:<token-largo>,mandri:<otro-token>`
3. **Deploy site**. Si cambias las variables después, ve a **Deploys → Trigger deploy** para que tomen efecto.
4. Opcional: en **Domain management** cambia el nombre del sitio (ej. `k4r-workouts.netlify.app`) o conecta un dominio propio.

Para quitarle el acceso a alguien, borra su par `nombre:token` de `APP_USERS` y vuelve a desplegar.
Cambiar `AUTH_SECRET` cierra la sesión en todos los dispositivos.

## Instalar en el celular

Abre tu enlace de acceso en el celular y:
- **iPhone (Safari):** Compartir → *Agregar a pantalla de inicio*.
- **Android (Chrome):** menú ⋮ → *Instalar app*.

Se abre a pantalla completa, funciona sin internet una vez abierta, y el botón **Compartir** manda los 3 PNG
directo a Instagram o WhatsApp.

## Estructura

- `generator/template.html`: el generador (plantillas, temas, decoración, lectura de rutinas).
- `generator/fonts/*.woff2.enc`: tipografías cifradas; `scripts/encrypt-fonts.mjs` las vuelve a cifrar si cambias alguna.
- `generator/logo.json`: trazos del logo K4R.
- `scripts/build-generator.mjs`: arma `lib/generator-html.ts` antes de cada build.
- `lib/auth.ts`: tokens de acceso y sesión firmada (400 días, se renueva en cada uso).
- `app/route.ts`: entrega el generador en `/`, solo con sesión iniciada.
- `app/k/[token]`: enlace de acceso personal.
- `app/manifest.webmanifest`: manifest de la app; la app instalada abre con el enlace de quien la instaló.
- `app/login`, `app/api/login`, `app/api/logout`: entrada con clave (respaldo) y salida.
- `public/`: íconos y service worker de la app instalable.

## Desarrollo local

```bash
cp .env.example .env.local   # y pon tus valores (incluida FONTS_KEY)
npm install
export $(grep -v '^#' .env.local | xargs) && npm run dev
```
