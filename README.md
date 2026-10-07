# Workouts K4R

Generador privado de los artes de rutinas de Kinder for Runners (Maternal, Pre Kinder y Kinder).
Pegas la rutina tal como llega, eliges plantilla y estilo, y descargas o compartes los 3 posts (1080 × 1350).

Abre directo, sin contraseña ni pantalla de entrada. No aparece en buscadores (`noindex`).

En el repo las tipografías están **cifradas** (`generator/fonts/*.woff2.enc`, AES-256-GCM). Netlify las descifra
al compilar con la variable `FONTS_KEY`; sin esa clave son ilegibles, aunque alguien vea el repo.

## Publicar en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige `KinderForRunners`.
   Netlify detecta Next.js solo; el archivo `netlify.toml` ya trae la configuración de build.
2. Antes de desplegar, en **Site configuration → Environment variables** agrega:
   - `FONTS_KEY`: la clave para descifrar las tipografías (64 caracteres; guárdala en un lugar seguro).
3. **Deploy site**. Si cambias las variables después, ve a **Deploys → Trigger deploy** para que tomen efecto.
4. Opcional: en **Domain management** cambia el nombre del sitio (ej. `k4r-workouts.netlify.app`) o conecta un dominio propio.

## Instalar en el celular

Abre la URL en el celular y:
- **iPhone (Safari):** Compartir → *Agregar a pantalla de inicio*.
- **Android (Chrome):** menú ⋮ → *Instalar app*.

Se abre a pantalla completa, funciona sin internet una vez abierta, y el botón **Compartir** manda los 3 PNG
directo a Instagram o WhatsApp.

## Estructura

- `generator/template.html`: el generador (plantillas, temas, decoración, lectura de rutinas).
- `generator/fonts/*.woff2.enc`: tipografías cifradas; `scripts/encrypt-fonts.mjs` las vuelve a cifrar si cambias alguna.
- `generator/logo.json`: trazos del logo K4R.
- `scripts/build-generator.mjs`: arma `lib/generator-html.ts` antes de cada build.
- `app/route.ts`: entrega el generador en `/`.
- `public/`: manifest, íconos y service worker de la app instalable.

## Desarrollo local

```bash
cp .env.example .env.local   # y pon FONTS_KEY
npm install
export $(grep -v '^#' .env.local | xargs) && npm run dev
```
