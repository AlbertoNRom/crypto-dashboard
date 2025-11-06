# CryptoDash

Panel de criptomonedas construido con Next.js, Tailwind y Lightweight Charts. Incluye gráfico OHLC de Bitcoin, listado de mercados en tiempo real y autenticación con Supabase.

## Características

- Gráfico de velas (OHLC) para BTC usando `lightweight-charts`.
- Listado de criptomonedas top con datos de CoinGecko.
- Tema oscuro/claro y UI moderna con Radix + Shadcn UI.
- Autenticación (Supabase) y ejemplo de OAuth.
- Botón de apoyo con Buy Me a Coffee (snippet embebible en el cliente).

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm, pnpm o yarn
- (Opcional) Cuenta de Supabase para auth
- (Opcional) Buy Me a Coffee (snippet cliente)
- (Opcional) Base de datos Postgres para Drizzle

## Instalación

```bash
npm install
# o
pnpm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las variables necesarias. Ejemplo:

```env
# Supabase (requerido si usas auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Buy Me a Coffee
# No requiere variables de entorno; añade tu snippet en el cliente

# CoinGecko (opcional, para Pro API en cliente)
NEXT_PUBLIC_CG_API_KEY=your_cg_pro_key

# Base de datos (opcional, para Drizzle)
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

Notas:
- Las rutas de API de CoinGecko incluidas usan la API pública y no requieren clave.
- Si falta alguna variable de Supabase y accedes a funcionalidades que la usan, el proyecto lanzará errores explicando qué falta.

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador. Si el puerto 3000 está ocupado, Next.js usará `http://localhost:3001` automáticamente.

## Endpoints API

- `GET /api/crypto/markets`
  - Parámetros: `limit` (por defecto `100`), `ids` (opcional, coma-separado)
  - Ejemplos:
    - `curl "http://localhost:3000/api/crypto/markets?limit=6"`
    - `curl "http://localhost:3000/api/crypto/markets?ids=bitcoin,ethereum&limit=2"`

- `GET /api/crypto/ohlc`
  - Parámetros: `coinId` (por defecto `bitcoin`), `vs_currency` (por defecto `usd`), `days` (por defecto `30`)
  - Ejemplo: `curl "http://localhost:3000/api/crypto/ohlc?coinId=bitcoin&vs_currency=usd&days=30"`

  

## Pruebas (Playwright)

Instala los navegadores de Playwright la primera vez:

```bash
npx playwright install
```

Ejecuta las pruebas:

```bash
npm run test        # modo CLI
npm run test:ui     # modo UI
npm run test:headed # con navegador visible
```

## Scripts útiles

- `npm run build` – compila la app para producción
- `npm run start` – arranca el servidor en producción
- `npm run lint` / `npm run format` – lint y formato con Biome
- `npm run db:generate` / `db:migrate` / `db:studio` – herramientas de Drizzle

## Solución de problemas

- Puerto ocupado: si `3000` está en uso, se arrancará en `3001`.
- Playwright: error de “Missing browser executable” → `npx playwright install`.
 
- Supabase: faltan variables → añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- CoinGecko: si la API pública limita o falla, el gráfico usa datos de respaldo.

## Créditos

- Datos de mercado y OHLC: [CoinGecko](https://www.coingecko.com)
- Gráficos: [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts)
