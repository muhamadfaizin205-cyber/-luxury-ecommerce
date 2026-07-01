import type { Category, Product } from "@/types";

// ─── Image URLs ───────────────────────────────────────────────
export const IMG = {
  hero:     "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  campaign: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",

  cats: {
    "Tas Tangan":      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    "Alas Kaki":       "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
    "Jaket & Coat":    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    "Aksesori":        "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop",
    "Rajutan":         "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
    "Denim":           "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    "Pakaian Formal":  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    "Gaun Malam":      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop",
  } as Record<string, string>,

  products: {
    1: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    ],
    2: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop",
    ],
    3: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
    ],
    4: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    ],
  } as Record<number, string[]>,
} as const;

// ─── Categories ───────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id:1, title:"Tas Tangan",     tag:"Musim Baru"      },
  { id:2, title:"Alas Kaki",      tag:null               },
  { id:3, title:"Jaket & Coat",   tag:"Terbatas"         },
  { id:4, title:"Aksesori",       tag:null               },
  { id:5, title:"Rajutan",        tag:"Eksklusif"        },
  { id:6, title:"Denim",          tag:null               },
  { id:7, title:"Pakaian Formal", tag:null               },
  { id:8, title:"Gaun Malam",     tag:"Pra-Peluncuran"  },
];

// ─── Products ─────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id:    1,
    name:  "Atasan Rajut Lengan Panjang",
    price: "Rp 1.250.000",
    tag:   "Eksklusif Pra-Peluncuran",
    colors:[
      { name:"Hitam",   hex:"#1a1a1a" },
      { name:"Karamel", hex:"#8B7355" },
      { name:"Gading",  hex:"#F0EFED" },
    ],
    sizes: ["XS","S","M","L","XL"],
    desc:  "Rajutan waffle premium dengan siluet santai. Terbuat dari campuran katun pilihan.",
  },
  {
    id:    2,
    name:  "Tas Tote Kulit Terstruktur",
    price: "Rp 4.800.000",
    tag:   "Edisi Terbatas",
    colors:[
      { name:"Hitam",   hex:"#000"    },
      { name:"Cokelat", hex:"#5C4033" },
    ],
    sizes: ["SATU UKURAN"],
    desc:  "Tas tote dari kulit sapi asli dengan jahitan tangan pengrajin lokal terpilih.",
  },
  {
    id:    3,
    name:  "Celana Kargo Teknikal",
    price: "Rp 2.100.000",
    tag:   null,
    colors:[
      { name:"Hitam", hex:"#1a1a1a" },
      { name:"Abu",   hex:"#4A4A4A" },
    ],
    sizes: ["XS","S","M","L"],
    desc:  "Celana kargo dengan bahan teknikal ringan. Cocok untuk gaya urban aktif.",
  },
  {
    id:    4,
    name:  "Turtleneck Kasmir Berribut",
    price: "Rp 3.400.000",
    tag:   "Buatan Italia",
    colors:[
      { name:"Gading",  hex:"#F0EFED" },
      { name:"Hitam",   hex:"#1a1a1a" },
      { name:"Karamel", hex:"#8B7355" },
    ],
    sizes: ["S","M","L","XL"],
    desc:  "100% kasmir merino dari pegunungan Italia. Sentuhan lembut yang tak tertandingi.",
  },
];

// ─── Navigation ───────────────────────────────────────────────
export const NAV_LINKS  = ["Terbaru","Pakaian","Tas","Aksesori","Studio","Promo"] as const;
export const DRAWER_NAV = [
  "Baru Masuk","Pakaian","Tas","Wanita","Pria",
  "Aksesori","Alas Kaki","Studio Techwear","Promo",
] as const;
export const TICKER_TEXT = [
  "KOLEKSI BARU — SS26",
  "GRATIS ONGKIR > RP 2.000.000",
  "BUATAN INDONESIA",
  "EKSKLUSIF PRA-PELUNCURAN",
  "PENGIRIMAN KE SELURUH INDONESIA",
  "MATERIAL PREMIUM PILIHAN",
] as const;
