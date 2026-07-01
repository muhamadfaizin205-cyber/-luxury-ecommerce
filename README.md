# LUX E — Luxury Fashion E-Commerce

Platform e-commerce fashion premium buatan Indonesia. Dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Supabase.

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS + CSS-in-JS|
| Database   | Supabase (PostgreSQL)   |
| Auth       | Supabase Auth           |
| Deployment | Vercel                  |

---

## Fitur

- ✅ Header Gucci-style — logo serif kiri, 4 ikon kanan
- ✅ Swipeable product cards — touch & mouse drag
- ✅ Search overlay real-time
- ✅ Account / Login page
- ✅ Cart dengan persistent state
- ✅ PDP split-screen (desktop) + carousel (mobile)
- ✅ Responsive 2-col mobile → 4-col desktop
- ✅ Marquee ticker bar
- ✅ Accordion product details
- ✅ Supabase auth + cart sync
- ✅ Row Level Security (RLS)

---

## Setup Lokal

### 1. Clone & Install

```bash
git clone https://github.com/USERNAME/luxe-ecommerce.git
cd luxe-ecommerce
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan kredensial Supabase kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Database Supabase

1. Buka [supabase.com](https://supabase.com) → buat project baru
2. Masuk ke **SQL Editor**
3. Copy-paste isi file `supabase/schema.sql`
4. Klik **Run** — semua tabel, RLS, dan seed data akan dibuat otomatis

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Deploy ke Vercel

### Cara Cepat

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/USERNAME/luxe-ecommerce)

### Manual

```bash
npm install -g vercel
vercel login
vercel --prod
```

Tambahkan environment variables di Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (URL Vercel kamu)

---

## Struktur Project

```
luxe-ecommerce/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + metadata
│   │   ├── page.tsx            # Entry point
│   │   ├── globals.css         # Global styles + reset
│   │   └── api/
│   │       ├── products/
│   │       │   └── route.ts    # GET /api/products
│   │       └── cart/
│   │           └── route.ts    # GET/POST/DELETE /api/cart
│   ├── components/
│   │   └── LuxeApp.tsx         # Main SPA component
│   ├── hooks/
│   │   └── useCart.ts          # Cart state hook
│   ├── lib/
│   │   ├── data.ts             # Mock data + image URLs
│   │   ├── cart.ts             # Supabase cart actions
│   │   └── supabase/
│   │       ├── client.ts       # Browser client
│   │       └── server.ts       # Server client
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── supabase/
│   └── schema.sql              # DB schema + RLS + seed
├── public/                     # Static assets
├── .env.local.example          # Environment template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Database Schema

```sql
users           -- profil pengguna (extends auth.users)
products        -- katalog produk
product_variants -- ukuran & warna per produk
cart_items      -- keranjang belanja per user
```

Semua tabel dilindungi **Row Level Security (RLS)** — user hanya bisa akses data miliknya sendiri.

---

## Lisensi

MIT © 2026 LUX E
