"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — single source of truth
═══════════════════════════════════════════════════════════════ */
const C = {
  black:   "#000000",
  white:   "#FFFFFF",
  gray50:  "#F5F5F5",
  gray100: "#EEECEB",
  gray200: "#D9D7D4",
  gray400: "#A8A5A2",
  gray600: "#6E6C69",
  serif:   "'Georgia','Times New Roman',serif",
  sans:    "'Helvetica Neue',Helvetica,Arial,sans-serif",
  border:  "0.5px solid #D9D7D4",
};

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS RESET
═══════════════════════════════════════════════════════════════ */
const RESET = `
  *, *::before, *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }
  html { font-size: 16px; scroll-behavior: smooth; }
  body {
    font-family: ${C.sans};
    background: ${C.white}; color: ${C.black};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  button {
    font-family: ${C.sans};
    border-radius: 0 !important;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    -webkit-appearance: none;
  }
  select, input {
    border-radius: 0 !important;
    font-family: ${C.sans};
    -webkit-appearance: none;
  }
  img { display: block; max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  ::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }

  /* Responsive helpers */
  .mob { display: block; }
  .mob-flex { display: flex; }
  .desk { display: none !important; }

  @media (min-width: 1024px) {
    .mob { display: none !important; }
    .mob-flex { display: none !important; }
    .desk { display: block !important; }
    .desk-flex { display: flex !important; }
    .desk-grid { display: grid !important; }
  }

  /* Marquee animation */
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Accordion transition */
  .acc-body {
    overflow: hidden;
    transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Swipe image transition */
  .swipe-strip {
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .swipe-strip.dragging {
    transition: none;
  }

  /* Image hover zoom */
  .img-zoom { overflow: hidden; }
  .img-zoom img {
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .img-zoom:hover img { transform: scale(1.04); }
`;

/* ═══════════════════════════════════════════════════════════════
   IMAGE DATA — curated premium Unsplash URLs
═══════════════════════════════════════════════════════════════ */
const IMG = {
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
  },
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
  },
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — clean, no trailing numbers
═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:1, title:"Tas Tangan",     tag:"Musim Baru"      },
  { id:2, title:"Alas Kaki",      tag:null               },
  { id:3, title:"Jaket & Coat",   tag:"Terbatas"         },
  { id:4, title:"Aksesori",       tag:null               },
  { id:5, title:"Rajutan",        tag:"Eksklusif"        },
  { id:6, title:"Denim",          tag:null               },
  { id:7, title:"Pakaian Formal", tag:null               },
  { id:8, title:"Gaun Malam",     tag:"Pra-Peluncuran"  },
];

const PRODUCTS = [
  {
    id:1, name:"Atasan Rajut Lengan Panjang",
    price:"Rp 1.250.000", tag:"Eksklusif Pra-Peluncuran",
    colors:[{name:"Hitam",hex:"#1a1a1a"},{name:"Karamel",hex:"#8B7355"},{name:"Gading",hex:"#F0EFED"}],
    sizes:["XS","S","M","L","XL"],
    desc:"Rajutan waffle premium dengan siluet santai. Terbuat dari campuran katun pilihan.",
  },
  {
    id:2, name:"Tas Tote Kulit Terstruktur",
    price:"Rp 4.800.000", tag:"Edisi Terbatas",
    colors:[{name:"Hitam",hex:"#000"},{name:"Cokelat",hex:"#5C4033"}],
    sizes:["SATU UKURAN"],
    desc:"Tas tote dari kulit sapi asli dengan jahitan tangan pengrajin lokal terpilih.",
  },
  {
    id:3, name:"Celana Kargo Teknikal",
    price:"Rp 2.100.000", tag:null,
    colors:[{name:"Hitam",hex:"#1a1a1a"},{name:"Abu",hex:"#4A4A4A"}],
    sizes:["XS","S","M","L"],
    desc:"Celana kargo dengan bahan teknikal ringan. Cocok untuk gaya urban aktif.",
  },
  {
    id:4, name:"Turtleneck Kasmir Berribut",
    price:"Rp 3.400.000", tag:"Buatan Italia",
    colors:[{name:"Gading",hex:"#F0EFED"},{name:"Hitam",hex:"#1a1a1a"},{name:"Karamel",hex:"#8B7355"}],
    sizes:["S","M","L","XL"],
    desc:"100% kasmir merino dari pegunungan Italia. Sentuhan lembut yang tak tertandingi.",
  },
];

const NAV_LINKS  = ["Terbaru","Pakaian","Tas","Aksesori","Studio","Promo"];
const DRAWER_NAV = ["Baru Masuk","Pakaian","Tas","Wanita","Pria","Aksesori","Alas Kaki","Studio Techwear","Promo"];
const TICKER_TEXT = ["KOLEKSI BARU — SS26","GRATIS ONGKIR > RP 2.000.000","BUATAN INDONESIA","EKSKLUSIF PRA-PELUNCURAN","PENGIRIMAN KE SELURUH INDONESIA","MATERIAL PREMIUM PILIHAN"];

/* ═══════════════════════════════════════════════════════════════
   SVG ICONS — thin stroke, consistent 20×20
═══════════════════════════════════════════════════════════════ */
const Icon = ({ d, size=20, sw=1.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const Ic = {
  search:  <Icon d={<><circle cx="11" cy="11" r="7.5"/><path d="M20.5 20.5l-3.5-3.5"/></>}/>,
  user:    <Icon d={<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>,
  bag:     <Icon d={<><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>}/>,
  menu:    <Icon d={<><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
</>}/>,
  close:   <Icon d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>,
  left:    <Icon d={<polyline points="15 18 9 12 15 6"/>}/>,
  right:   <Icon d={<polyline points="9 18 15 12 9 6"/>} size={14}/>,
  chevD:   (open) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      style={{transition:"transform .28s ease", transform: open?"rotate(180deg)":"rotate(0)"}}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   ATOMIC COMPONENTS
═══════════════════════════════════════════════════════════════ */

/** Aspect-ratio image with lazy loading and subtle zoom on hover */
const FashionImg = ({ src, ratio="3/4", alt="", zoom=false, style={} }) => {
  const [w,h] = ratio.split("/").map(Number);
  const pb    = (h/w*100).toFixed(4)+"%";
  return (
    <div className={zoom?"img-zoom":""} style={{
      width:"100%", position:"relative", paddingBottom:pb,
      background:C.gray50, overflow:"hidden", flexShrink:0, ...style,
    }}>
      <img
        src={src} alt={alt} loading="lazy"
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center top",
          display:"block",
        }}
      />
    </div>
  );
};

/** Tag label — always reserves same height even when empty (for grid alignment) */
const TagPill = ({ text }) => (
  <span style={{
    display:"block",
    fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase",
    color:C.gray400, marginBottom:4,
    minHeight:13, lineHeight:"13px",
    visibility: text ? "visible" : "hidden",
  }}>
    {text || "·"}
  </span>
);

/** Divider line */
const Line = ({ style={} }) => (
  <div style={{ width:"100%", height:"0.5px", background:C.gray200, ...style }} />
);

/** Primary solid black button */
const BtnPrimary = ({ children, onClick, style={} }) => (
  <button onClick={onClick} style={{
    display:"block",
    background:C.black, color:C.white,
    border:"none",
    padding:"15px 28px",
    fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase",
    fontFamily:C.sans, fontWeight:400,
    width:"100%",
    ...style,
  }}>{children}</button>
);

/** Ghost outline button */
const BtnGhost = ({ children, onClick, style={} }) => (
  <button onClick={onClick} style={{
    display:"block",
    background:"rgba(255,255,255,0.92)", color:C.black,
    border:`0.5px solid ${C.black}`,
    padding:"13px 20px",
    fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase",
    fontFamily:C.sans, fontWeight:400,
    ...style,
  }}>{children}</button>
);

/* ═══════════════════════════════════════════════════════════════
   SWIPEABLE IMAGE CAROUSEL
   Used on: product cards (grid) + PDP mobile
═══════════════════════════════════════════════════════════════ */
const SwipeCarousel = ({ images, ratio="3/4", alt="", onTap, zoom=false }) => {
  const [idx,    setIdx]    = useState(0);
  const [startX, setStartX] = useState(null);
  const [dragX,  setDragX]  = useState(0);
  const [isDrag, setIsDrag] = useState(false);

  const total = images.length;
  const clamp = n => Math.max(0, Math.min(total-1, n));

  const handleStart = x => { setStartX(x); setDragX(0); setIsDrag(true); };
  const handleMove  = x => { if (startX === null) return; setDragX(x - startX); };
  const handleEnd   = () => {
    if (Math.abs(dragX) > 44) setIdx(clamp(idx + (dragX < 0 ? 1 : -1)));
    else if (Math.abs(dragX) < 6 && onTap) onTap();
    setStartX(null); setDragX(0); setIsDrag(false);
  };

  const [w,h] = ratio.split("/").map(Number);
  const pb    = (h/w*100).toFixed(4)+"%";

  return (
    <div
      style={{
        width:"100%", position:"relative", paddingBottom:pb,
        overflow:"hidden", background:C.gray50, flexShrink:0,
        userSelect:"none", cursor: isDrag ? "grabbing" : "pointer",
      }}
      onTouchStart={e=>handleStart(e.touches[0].clientX)}
      onTouchMove={e=>handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={e=>{handleStart(e.clientX); e.preventDefault();}}
      onMouseMove={e=>isDrag && handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Image strip */}
      <div
        className={isDrag ? "swipe-strip dragging" : "swipe-strip"}
        style={{
          position:"absolute", inset:0,
          display:"flex",
          transform:`translateX(calc(${-idx*100}% + ${dragX}px))`,
          willChange:"transform",
        }}
      >
        {images.map((src,i) => (
          <img key={i} src={src} alt={`${alt} ${i+1}`} draggable={false}
            style={{
              flexShrink:0, width:"100%", height:"100%",
              objectFit:"cover", objectPosition:"center top",
              pointerEvents:"none",
            }}
          />
        ))}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div style={{
          position:"absolute", bottom:10, right:12,
          display:"flex", gap:4, alignItems:"center",
        }}>
          {images.map((_,i) => (
            <div key={i} style={{
              height:3,
              width: i===idx ? 16 : 4,
              background: i===idx ? C.white : "rgba(255,255,255,0.45)",
              transition:"width 0.22s ease",
            }}/>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PRODUCT GRID
   Image row + Info row rendered as separate grid cells
   → browser enforces equal height per row = perfect alignment
═══════════════════════════════════════════════════════════════ */
const ProductGrid = ({ products, onSelect, cols=2 }) => {
  const colsFr = `repeat(${cols},1fr)`;

  return (
    <div style={{ display:"grid", gridTemplateColumns:colsFr, borderTop:C.border }}>
      {(() => {
        const cells = [];
        for (let r=0; r<products.length; r+=cols) {
          const row    = products.slice(r, r+cols);
          const isLast = r+cols >= products.length;

          /* Row A — images */
          cells.push(
            <React.Fragment key={`img-${r}`}>
              {row.map((p,c) => (
                <div key={p.id}
                  style={{borderRight: c<cols-1 ? C.border : "none"}}
                >
                  <SwipeCarousel
                    images={IMG.products[p.id]||[]}
                    ratio="3/4"
                    alt={p.name}
                    onTap={()=>onSelect(p)}
                    zoom
                  />
                </div>
              ))}
              {/* Empty slot filler */}
              {row.length < cols && (
                <div style={{borderLeft:C.border, background:C.gray50}}/>
              )}
            </React.Fragment>
          );

          /* Row B — info (same CSS row → browser forces equal height) */
          cells.push(
            <React.Fragment key={`info-${r}`}>
              {row.map((p,c) => (
                <button key={p.id} onClick={()=>onSelect(p)} style={{
                  display:"flex", flexDirection:"column", justifyContent:"flex-start",
                  padding:"10px 14px 20px",
                  background:"none", border:"none", cursor:"pointer", textAlign:"left",
                  borderRight:  c < cols-1 ? C.border : "none",
                  borderTop:    C.border,
                  borderBottom: !isLast ? C.border : "none",
                }}>
                  <TagPill text={p.tag}/>
                  <p style={{
                    fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase",
                    marginBottom:4, lineHeight:1.45, color:C.black,
                  }}>{p.name}</p>
                  <p style={{fontSize:12, color:C.gray600, letterSpacing:"0.03em"}}>{p.price}</p>
                </button>
              ))}
              {row.length < cols && (
                <div style={{
                  borderLeft:C.border, borderTop:C.border,
                  borderBottom: !isLast ? C.border : "none",
                }}/>
              )}
            </React.Fragment>
          );
        }
        return cells;
      })()}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HEADER — pixel-perfect replica of Gucci.com header

   Analisis dari gambar:
   • Logo "GUCCI" → serif klasik, SANGAT BESAR, tracking lebar
   • Di sebelah kanan logo ada ruang putih kosong yang luas
   • 4 ikon di ujung kanan: [Bag] [User] [Search] [≡ Menu]
   • Ikon sangat tipis stroke (≈1px), ukuran sedang ~22px
   • Header putih bersih, tidak ada shadow atau blur
   • Tinggi header ≈ 70–80px di mobile
   • Tidak ada nav links di mobile, hanya logo + ikon
═══════════════════════════════════════════════════════════════ */
function Header({ page, go, cartQty, openMenu, openSearch, openAccount }) {
  const showBack = page === "pdp" || page === "cart" || page === "account";

  /* ── Icon SVGs — stroke sangat tipis seperti Gucci ── */
  const GIcon = ({ d, size=22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );

  const GBag = () => <GIcon d={
    <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/></>
  }/>;
  const GUser = () => <GIcon d={
    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/></>
  }/>;
  const GSearch = () => <GIcon d={
    <><circle cx="11" cy="11" r="7.5"/>
      <path d="M20.5 20.5l-3.5-3.5"/></>
  }/>;
  const GMenu = () => (
    <svg width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.1" strokeLinecap="round">
      <line x1="2" y1="7"  x2="22" y2="7"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="17" x2="22" y2="17"/>
    </svg>
  );
  const GBack = () => (
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );

  /* ── Tap-target wrapper ── */
  const IconBtn = ({ onClick, children, label="" }) => (
    <button onClick={onClick} aria-label={label} style={{
      display:"flex", alignItems:"center", justifyContent:"center",
      width:44, height:"100%",
      color:"#000", background:"none", border:"none", cursor:"pointer",
      padding:0, flexShrink:0,
    }}>
      {children}
    </button>
  );

  /* ── Bag with qty dot ── */
  const BagIcon = () => (
    <IconBtn onClick={()=>go("cart")} label="Tas Belanja">
      <span style={{position:"relative", display:"flex", alignItems:"center"}}>
        <GBag/>
        {cartQty > 0 && (
          <span style={{
            position:"absolute", top:-3, right:-4,
            width:13, height:13,
            background:"#000", color:"#fff",
            fontSize:7, borderRadius:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"sans-serif",
          }}>{cartQty}</span>
        )}
      </span>
    </IconBtn>
  );

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <header style={{
      position:"sticky", top:0, zIndex:100,
      background:"#fff",
      borderBottom:"0.5px solid #E0DEDC",
    }}>
      <style>{RESET}</style>

      {/*
        ┌──────────────────────────────────────────────────────┐
        │  MOBILE  (layar ponsel, < 1024px)                    │
        │                                                      │
        │  [LUXE MAISON................] [🛍 👤 🔍 ≡]          │
        │                                                      │
        │  Logo: serif besar, tracking lebar, kiri             │
        │  Ikon: 4 buah, ujung kanan, tipis                    │
        └──────────────────────────────────────────────────────┘
      */}
      <div className="mob-flex" style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        height:76,
        padding:"0 20px",
      }}>

        {/* ── Kiri: back arrow (hanya di sub-halaman) + Logo ── */}
        <div style={{
          display:"flex", alignItems:"center",
          gap:0, flex:1, overflow:"hidden",
        }}>
          {showBack && (
            <button
              onClick={()=>go(page==="pdp"?"plp":"home")}
              style={{
                display:"flex", alignItems:"center",
                marginRight:8, color:"#000",
                background:"none", border:"none",
                cursor:"pointer", padding:0, flexShrink:0,
              }}
            >
              <GBack/>
            </button>
          )}

          {/* ── LOGO ── */}
          <button onClick={()=>go("home")} style={{
            fontFamily:"'Georgia','Times New Roman',serif",
            fontSize:32,
            letterSpacing:"0.18em",
            textTransform:"uppercase",
            fontWeight:400,
            color:"#000",
            whiteSpace:"nowrap",
            lineHeight:1,
            background:"none", border:"none",
            cursor:"pointer", padding:0,
          }}>
            LUX E
          </button>
        </div>

        {/* ── Kanan: [Bag] [User] [Search] [Menu] ── */}
        <div style={{
          display:"flex", alignItems:"center",
          flexShrink:0,
          height:"100%",
        }}>
          <BagIcon/>
          <IconBtn onClick={()=>openAccount()} label="Akun"><GUser/></IconBtn>
          <IconBtn onClick={()=>openSearch()} label="Cari"><GSearch/></IconBtn>
          <IconBtn onClick={openMenu} label="Menu"><GMenu/></IconBtn>
        </div>
      </div>

      {/*
        ┌──────────────────────────────────────────────────────┐
        │  DESKTOP  (≥ 1024px)                                 │
        │                                                      │
        │  [LUXE MAISON]  [nav nav nav nav nav]  [🛍 👤 🔍]   │
        └──────────────────────────────────────────────────────┘
      */}
      <div className="desk" style={{display:"none"}}>
        <div style={{
          maxWidth:1440, margin:"0 auto",
          display:"flex", alignItems:"center",
          height:88, padding:"0 52px",
        }}>
          {/* Logo desktop */}
          <button onClick={()=>go("home")} style={{
            fontFamily:"'Georgia','Times New Roman',serif",
            fontSize:38,
            letterSpacing:"0.18em",
            textTransform:"uppercase",
            fontWeight:400,
            color:"#000",
            whiteSpace:"nowrap",
            lineHeight:1,
            background:"none", border:"none",
            cursor:"pointer", padding:0,
            marginRight:64, flexShrink:0,
          }}>
            LUX E
          </button>

          {/* Nav links */}
          <nav style={{display:"flex", gap:36, flex:1}}>
            {NAV_LINKS.map(n => (
              <button key={n} onClick={()=>go("plp")} style={{
                fontSize:9, letterSpacing:"0.2em",
                textTransform:"uppercase", fontWeight:400,
                color:"#000", whiteSpace:"nowrap",
                background:"none", border:"none", cursor:"pointer",
                padding:0,
              }}>
                {n}
              </button>
            ))}
          </nav>

          {/* Desktop icons: Bag → User → Search (no hamburger) */}
          <div style={{
            display:"flex", alignItems:"center",
            height:"100%", flexShrink:0,
          }}>
            <BagIcon/>
            <IconBtn onClick={()=>openAccount()} label="Akun"><GUser/></IconBtn>
            <IconBtn onClick={()=>openSearch()} label="Cari"><GSearch/></IconBtn>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAV DRAWER (mobile fullscreen slide-in from right)
═══════════════════════════════════════════════════════════════ */
function NavDrawer({ open, close, go }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200,
      visibility: open ? "visible" : "hidden",
      transition:`visibility 0s linear ${open?"0s":".38s"}`,
    }}>
      {/* Backdrop */}
      <div onClick={close} style={{
        position:"absolute", inset:0,
        background:"rgba(0,0,0,0.26)",
        opacity: open?1:0,
        transition:"opacity .38s ease",
      }}/>

      {/* Panel */}
      <div style={{
        position:"absolute", top:0, right:0, bottom:0,
        width:"min(100%, 420px)",
        background:C.white,
        transform: open?"translateX(0)":"translateX(100%)",
        transition:"transform .38s cubic-bezier(.4,0,.2,1)",
        display:"flex", flexDirection:"column",
        overflowY:"auto",
      }}>
        {/* Header row — logo left, close right */}
        <div style={{
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          padding:"0 24px", height:56,
          borderBottom:C.border, flexShrink:0,
        }}>
          <span style={{
            fontFamily:C.serif, fontSize:12,
            letterSpacing:"0.22em", textTransform:"uppercase",
          }}>
            LUX E
          </span>
          <button onClick={close} style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            width:30, height:30, border:C.border, flexShrink:0, color:C.black,
          }}>
            {Ic.close}
          </button>
        </div>

        {/* Main nav items */}
        <div style={{flex:1}}>
          {DRAWER_NAV.map(item => (
            <button key={item} onClick={()=>{ go("plp"); close(); }} style={{
              width:"100%", display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"18px 24px",
              borderBottom:C.border,
              fontSize:15, fontWeight:400, letterSpacing:"0.015em",
              color:C.black, textAlign:"left",
            }}>
              {item}
              {Ic.right}
            </button>
          ))}
        </div>

        {/* Utility links */}
        <div style={{
          padding:"22px 24px 32px",
          borderTop:C.border, flexShrink:0,
        }}>
          {[
            {label:"Masuk", action:()=>{ go("account"); close(); }},
            {label:"Pesanan Saya", action:()=>{}},
            {label:"Hubungi Kami", action:()=>{}},
          ].map(l => (
            <button key={l.label} onClick={l.action} style={{
              display:"block", padding:"7px 0",
              fontSize:9, letterSpacing:"0.16em",
              textTransform:"uppercase", color:C.gray600,
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"inherit",
            }}>{l.label}</button>
          ))}
          <p style={{
            marginTop:16, fontSize:8,
            letterSpacing:"0.14em", color:C.gray400, textTransform:"uppercase",
          }}>
            Layanan Pelanggan: +62 800 000 0000
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TICKER / MARQUEE BAR
═══════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [...TICKER_TEXT, ...TICKER_TEXT, ...TICKER_TEXT, ...TICKER_TEXT];
  return (
    <div style={{
      borderTop:C.border, borderBottom:C.border,
      overflow:"hidden", padding:"13px 0",
      background:C.white,
    }}>
      <div style={{
        display:"flex", gap:64,
        width:"max-content",
        animation:"marquee 28s linear infinite",
      }}>
        {items.map((t,i) => (
          <span key={i} style={{
            fontSize:8, letterSpacing:"0.26em",
            textTransform:"uppercase", color:C.gray400,
            whiteSpace:"nowrap",
          }}>
            {t}&nbsp;&nbsp;&nbsp;·
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
function HomePage({ go, setProd }) {
  return (
    <main>

      {/* ── HERO ── */}
      <section style={{position:"relative"}}>
        {/* Mobile: portrait 3:4 */}
        <div className="mob">
          <FashionImg src={IMG.hero} ratio="3/4" alt="Koleksi Utama"/>
        </div>
        {/* Desktop: landscape 21:9 */}
        <div className="desk" style={{display:"none"}}>
          <FashionImg src={IMG.hero} ratio="21/9" alt="Koleksi Utama"/>
        </div>

        {/* CTA overlay */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          padding:"56px 20px 28px",
          background:"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}>
          <p style={{
            textAlign:"center", fontSize:9,
            letterSpacing:"0.28em", textTransform:"uppercase",
            color:C.white, marginBottom:14,
          }}>
            Temukan Koleksi Musim Panas
          </p>
          {/* Two equal buttons */}
          <div style={{display:"flex", gap:8, maxWidth:480, margin:"0 auto"}}>
            <BtnGhost onClick={()=>go("plp")} style={{flex:1, textAlign:"center"}}>Untuk Wanita</BtnGhost>
            <BtnGhost onClick={()=>go("plp")} style={{flex:1, textAlign:"center"}}>Untuk Pria</BtnGhost>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker/>

      {/* ── CATEGORY SHOWCASE GRID ── */}
      <section style={{maxWidth:1440, margin:"0 auto"}}>
        <div className="cat-grid-mob" style={{
          display:"grid",
          gridTemplateColumns:"repeat(2,1fr)",
        }}>
          {CATEGORIES.map((cat,i)=>{
            const isRight    = i%2===1;
            const totalRows  = Math.ceil(CATEGORIES.length/2);
            const rowIdx     = Math.floor(i/2);
            const notLastRow = rowIdx < totalRows-1;
            return (
              <button key={cat.id} onClick={()=>go("plp")} style={{
                display:"grid", gridTemplateRows:"1fr auto",
                background:"none", border:"none", cursor:"pointer", padding:0,
                textAlign:"center",
                borderRight:  !isRight    ? C.border : "none",
                borderBottom: notLastRow  ? C.border : "none",
              }}>
                <div className="img-zoom">
                  <FashionImg
                    src={IMG.cats[cat.title]}
                    ratio="4/5"
                    alt={cat.title}
                  />
                </div>
                <div style={{
                  padding:"11px 12px 18px",
                  minHeight:54,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                }}>
                  <TagPill text={cat.tag}/>
                  <p style={{
                    fontSize:10, letterSpacing:"0.17em",
                    textTransform:"uppercase", lineHeight:1.5,
                  }}>{cat.title}</p>
                </div>
              </button>
            );
          })}
        </div>
        <style>{`
          @media(min-width:768px){
            .cat-grid-mob { grid-template-columns: repeat(4,1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── CAMPAIGN BANNER ── */}
      <section style={{borderTop:C.border}}>
        <div style={{position:"relative"}}>
          <FashionImg src={IMG.campaign} ratio="16/7" alt="Kampanye"/>
          <div style={{
            position:"absolute", inset:0,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"flex-end",
            padding:"0 24px 40px",
            background:"linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 60%)",
          }}>
            <p style={{
              fontSize:8, letterSpacing:"0.28em",
              textTransform:"uppercase", color:C.white, marginBottom:16,
            }}>
              DIBUAT DENGAN PRESISI · BUATAN INDONESIA
            </p>
            <BtnPrimary onClick={()=>go("plp")} style={{
              width:"auto", padding:"13px 48px",
            }}>
              Temukan Koleksi
            </BtnPrimary>
          </div>
        </div>
      </section>

      {/* ── NEW IN PRODUCTS ── */}
      <section style={{borderTop:C.border, maxWidth:1440, margin:"0 auto"}}>
        <div style={{
          display:"flex", alignItems:"baseline",
          justifyContent:"space-between",
          padding:"26px 20px 0",
        }}>
          <h2 style={{
            fontFamily:C.serif, fontWeight:400,
            fontSize:21, letterSpacing:"0.05em",
          }}>
            Baru Masuk
          </h2>
          <button onClick={()=>go("plp")} style={{
            fontSize:9, letterSpacing:"0.18em",
            textTransform:"uppercase",
            textDecoration:"underline", color:C.gray600,
          }}>
            Lihat Semua
          </button>
        </div>
        <ProductGrid
          products={PRODUCTS}
          onSelect={p=>{ setProd(p); go("pdp"); }}
          cols={2}
        />
      </section>

      {/* ── EDITORIAL STRIP ── */}
      <section style={{borderTop:C.border}}>
        <div style={{
          maxWidth:1440, margin:"0 auto",
          padding:"44px 24px",
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:16,
        }}>
          <p style={{
            fontSize:8, letterSpacing:"0.28em",
            textTransform:"uppercase", color:C.gray400,
          }}>
            Filosofi Kami
          </p>
          <p style={{
            fontFamily:C.serif, fontWeight:400,
            fontSize:22, letterSpacing:"0.04em",
            textAlign:"center", maxWidth:560, lineHeight:1.6,
          }}>
            Setiap helai dibuat untuk bertahan melampaui musim.
          </p>
          <div style={{width:40, height:"0.5px", background:C.gray400, margin:"4px 0"}}/>
          <button onClick={()=>go("plp")} style={{
            fontSize:9, letterSpacing:"0.2em",
            textTransform:"uppercase",
            textDecoration:"underline", color:C.gray600,
          }}>
            Tentang Kami
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:C.border}}>
        <div style={{maxWidth:1440, margin:"0 auto", padding:"44px 24px 36px"}}>
          <div className="footer-grid" style={{
            display:"grid", gridTemplateColumns:"repeat(2,1fr)",
            gap:"32px 24px", marginBottom:40,
          }}>
            {[
              { h:"Jelajahi",   ls:["Koleksi Baru","Pakaian","Tas","Aksesori","Promo"] },
              { h:"Bantuan",    ls:["Panduan Ukuran","Pengiriman","Pengembalian","FAQ","Hubungi"] },
              { h:"Perusahaan", ls:["Tentang Kami","Keberlanjutan","Pers","Karier"] },
              { h:"Ikuti Kami", ls:["Instagram","Pinterest","TikTok","WeChat"] },
            ].map(col=>(
              <div key={col.h}>
                <p style={{
                  fontSize:8, letterSpacing:"0.2em",
                  textTransform:"uppercase", marginBottom:14,
                }}>{col.h}</p>
                {col.ls.map(l=>(
                  <p key={l} style={{
                    fontSize:12, color:C.gray600,
                    marginBottom:9, cursor:"pointer",
                    letterSpacing:"0.02em",
                  }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <Line/>
          <div style={{
            display:"flex", justifyContent:"space-between",
            alignItems:"center", marginTop:18,
            flexWrap:"wrap", gap:8,
          }}>
            <span style={{
              fontFamily:C.serif, fontSize:12,
              letterSpacing:"0.22em", textTransform:"uppercase",
            }}>
              LUX E
            </span>
            <span style={{fontSize:9, color:C.gray400, letterSpacing:"0.1em"}}>
              © 2026 Hak Cipta Dilindungi
            </span>
          </div>
        </div>
        <style>{`@media(min-width:768px){.footer-grid{grid-template-columns:repeat(4,1fr)!important;}}`}</style>
      </footer>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT LISTING PAGE (PLP)
═══════════════════════════════════════════════════════════════ */
function PLPPage({ go, setProd }) {
  const [filterOpen, setFilter] = useState(false);
  const [activeFilters, setAF]  = useState([]);
  const [sort, setSort]         = useState("Rekomendasi");

  // Duplicate to simulate more products
  const allProducts = [...PRODUCTS, ...PRODUCTS];

  const toggleFilter = v =>
    setAF(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev,v]);

  const FILTER_GROUPS = [
    { label:"Jenis",  opts:["Atasan","Bawahan","Jaket","Rajutan","Denim"] },
    { label:"Ukuran", opts:["XS","S","M","L","XL","XXL"] },
    { label:"Warna",  opts:["Hitam","Putih","Krem","Cokelat","Abu-abu"] },
    { label:"Bahan",  opts:["Katun","Kasmir","Wol","Kulit","Sintetis"] },
  ];

  return (
    <main>
      {/* Category banner */}
      <div style={{position:"relative"}}>
        <FashionImg src={IMG.campaign} ratio="21/8" alt="Pakaian"/>
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          padding:"0 20px 14px",
          background:"linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 60%)",
          display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        }}>
          <p style={{fontFamily:C.serif, fontSize:16, letterSpacing:"0.08em", color:C.white, fontWeight:400}}>
            Semua Produk
          </p>
          <span style={{fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.8)"}}>
            {allProducts.length} Produk
          </span>
        </div>
      </div>

      {/* Filter / Sort bar — sticky */}
      <div style={{
        position:"sticky", top:56, zIndex:50,
        background:"rgba(255,255,255,0.96)",
        backdropFilter:"blur(8px)",
        borderTop:C.border, borderBottom:C.border,
      }}>
        <div style={{
          maxWidth:1440, margin:"0 auto",
          padding:"0 20px",
          display:"flex", alignItems:"center",
          justifyContent:"space-between", height:44,
        }}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            background:"none", border:"none", outline:"none",
            fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase",
            fontFamily:C.sans, cursor:"pointer", color:C.black,
          }}>
            <option>Urutkan: Rekomendasi</option>
            <option>Urutkan: Harga ↑</option>
            <option>Urutkan: Harga ↓</option>
            <option>Urutkan: Terbaru</option>
          </select>
          <button onClick={()=>setFilter(true)} style={{
            border:C.border.replace("0.5px solid","0.5px solid"), padding:"6px 20px",
            fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:C.black,
            borderColor:C.black,
          }}>
            {activeFilters.length > 0 ? `Filter (${activeFilters.length})` : "Filter"}
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div style={{maxWidth:1440, margin:"0 auto"}}>
        <ProductGrid
          products={allProducts}
          onSelect={p=>{ setProd(p); go("pdp"); }}
          cols={2}
        />
      </div>

      {/* Filter drawer */}
      {filterOpen && (
        <div style={{position:"fixed", inset:0, zIndex:150}}>
          <div onClick={()=>setFilter(false)} style={{
            position:"absolute", inset:0, background:"rgba(0,0,0,0.26)",
          }}/>
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            background:C.white, maxHeight:"75vh",
            display:"flex", flexDirection:"column",
          }}>
            <div style={{
              display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"14px 20px", borderBottom:C.border, flexShrink:0,
            }}>
              <span style={{fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase"}}>
                Saring
              </span>
              <button onClick={()=>setFilter(false)} style={{display:"flex", color:C.black}}>
                {Ic.close}
              </button>
            </div>

            <div style={{overflowY:"auto", flex:1}}>
              {FILTER_GROUPS.map(fg=>(
                <div key={fg.label} style={{padding:"14px 20px", borderBottom:C.border}}>
                  <p style={{
                    fontSize:8, letterSpacing:"0.18em",
                    textTransform:"uppercase", marginBottom:12,
                  }}>{fg.label}</p>
                  <div style={{display:"flex", flexWrap:"wrap", gap:7}}>
                    {fg.opts.map(o=>{
                      const on = activeFilters.includes(o);
                      return (
                        <button key={o} onClick={()=>toggleFilter(o)} style={{
                          padding:"7px 14px",
                          fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase",
                          border:`0.5px solid ${on?C.black:"#ccc"}`,
                          background:on?C.black:C.white,
                          color:on?C.white:C.black,
                          fontFamily:C.sans,
                        }}>{o}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:"14px 20px", borderTop:C.border, flexShrink:0}}>
              <BtnPrimary onClick={()=>setFilter(false)}>
                {activeFilters.length > 0
                  ? `Terapkan ${activeFilters.length} Filter`
                  : "Terapkan Filter"}
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE (PDP)
   Mobile: carousel + sticky CTA
   Desktop: left scroll images | right sticky info
═══════════════════════════════════════════════════════════════ */
function PDPPage({ prod, addToCart }) {
  const p       = prod || PRODUCTS[0];
  const images  = IMG.products[p.id] || IMG.products[1];

  const [colorIdx, setColor] = useState(0);
  const [size,     setSize]  = useState(null);
  const [imgIdx,   setImgIdx]= useState(0);
  const [acc,      setAcc]   = useState({});
  const [sticky,   setSticky]= useState(false);
  const btnRef = useRef(null);

  useEffect(()=>{
    setColor(0); setSize(null); setImgIdx(0); setAcc({});
  }, [p.id]);

  useEffect(()=>{
    const el = btnRef.current; if(!el) return;
    const obs = new IntersectionObserver(([e])=>setSticky(!e.isIntersecting),{threshold:0});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  const toggleAcc = k => setAcc(prev=>({...prev,[k]:!prev[k]}));

  /* Shared info panel */
  const InfoPanel = () => (
    <div>
      {p.tag && (
        <p style={{fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:C.gray400, marginBottom:9}}>
          {p.tag}
        </p>
      )}
      <h1 style={{
        fontFamily:C.serif, fontWeight:400,
        fontSize:22, letterSpacing:"0.05em", marginBottom:8,
      }}>
        {p.name}
      </h1>
      <p style={{fontSize:16, letterSpacing:"0.04em", marginBottom:10}}>{p.price}</p>
      <p style={{fontSize:11, color:C.gray600, lineHeight:1.8, marginBottom:24, letterSpacing:"0.03em"}}>
        {p.desc}
      </p>
      <Line/>

      {/* Colours */}
      <div style={{margin:"20px 0"}}>
        <p style={{fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:12}}>
          Warna — <span style={{color:C.gray400}}>{p.colors[colorIdx]?.name}</span>
        </p>
        <div style={{display:"flex", gap:8}}>
          {p.colors.map((col,i)=>(
            <button key={i} onClick={()=>setColor(i)} style={{
              width:26, height:26, background:col.hex,
              border: colorIdx===i ? `2px solid ${C.black}` : `0.5px solid #ccc`,
              outline: colorIdx===i ? `2px solid ${C.white}` : "none",
              outlineOffset:"1px",
            }}/>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
          <p style={{fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase"}}>Ukuran</p>
          <button style={{
            fontSize:8, letterSpacing:"0.14em",
            textTransform:"uppercase", textDecoration:"underline", color:C.gray400,
          }}>Panduan Ukuran</button>
        </div>
        <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
          {p.sizes.map(s=>(
            <button key={s} onClick={()=>setSize(s)} style={{
              minWidth:44, height:44, padding:"0 10px",
              fontSize:10, letterSpacing:"0.08em",
              border:`0.5px solid ${size===s?C.black:"#ccc"}`,
              background:size===s?C.black:C.white,
              color:size===s?C.white:C.black,
              fontFamily:C.sans,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div ref={btnRef} style={{marginBottom:10}}>
        <BtnPrimary onClick={()=>addToCart(p)}>Tambah ke Tas</BtnPrimary>
      </div>
      <button style={{
        width:"100%", padding:"13px",
        border:C.border, background:C.white,
        fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase",
        fontFamily:C.sans, marginBottom:30, borderColor:"#ccc",
      }}>
        Simpan ke Wishlist
      </button>

      {/* Accordions */}
      {[
        { id:"info", label:"Informasi Produk", lines:[
          "Gaya: "+p.name, "Potongan: Regular",
          "Panjang: Di bawah pinggul", "Leher: Bulat", "Lengan: Panjang",
        ]},
        { id:"care", label:"Bahan & Perawatan", lines:[
          "70% Katun · 20% Polyester · 10% Elastane",
          "Cuci mesin 30°C", "Jangan diperas dengan mesin pengering",
          "Setrika suhu rendah · Jangan diputihkan",
        ]},
        { id:"ship", label:"Pengiriman & Pengembalian", lines:[
          "Gratis ongkir di atas Rp 2.000.000",
          "Pengiriman reguler 3–5 hari kerja",
          "Pengiriman ekspres 1–2 hari kerja",
          "Pengembalian gratis dalam 30 hari",
        ]},
      ].map(({ id, label, lines })=>(
        <div key={id} style={{borderTop:C.border}}>
          <button onClick={()=>toggleAcc(id)} style={{
            width:"100%", display:"flex",
            justifyContent:"space-between", alignItems:"center",
            padding:"15px 0", color:C.black,
          }}>
            <span style={{fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase"}}>
              {label}
            </span>
            {Ic.chevD(!!acc[id])}
          </button>
          <div className="acc-body" style={{maxHeight: acc[id]?400:0}}>
            <div style={{paddingBottom:18}}>
              {lines.map((l,i)=>(
                <p key={i} style={{
                  fontSize:11, color:C.gray600,
                  lineHeight:2, letterSpacing:"0.03em",
                }}>{l}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Line/>
    </div>
  );

  return (
    <main>

      {/* ── MOBILE LAYOUT ── */}
      <div className="mob">
        {/* Image carousel with counter */}
        <div style={{position:"relative"}}>
          <div
            style={{display:"flex", overflowX:"scroll", scrollSnapType:"x mandatory"}}
            onScroll={e=>{
              const i = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
              setImgIdx(i);
            }}
          >
            {images.map((src,i)=>(
              <div key={i} style={{flexShrink:0, width:"100%", scrollSnapAlign:"start"}}>
                <FashionImg src={src} ratio="3/4" alt={`${p.name} ${i+1}`}/>
              </div>
            ))}
          </div>
          {/* Counter badge */}
          <div style={{
            position:"absolute", bottom:10, right:12,
            background:"rgba(255,255,255,0.9)",
            padding:"3px 9px",
            fontSize:9, letterSpacing:"0.1em",
          }}>
            {imgIdx+1} / {images.length}
          </div>
        </div>

        {/* Info below carousel */}
        <div style={{padding:"24px 20px 110px"}}>
          <InfoPanel/>
        </div>

        {/* Sticky bottom CTA */}
        {sticky && (
          <div style={{
            position:"fixed", bottom:0, left:0, right:0, zIndex:80,
            background:C.white, borderTop:C.border,
            padding:"12px 20px 20px",
          }}>
            <BtnPrimary onClick={()=>addToCart(p)}>
              Tambah ke Tas — {p.price}
            </BtnPrimary>
          </div>
        )}
      </div>

      {/* ── DESKTOP SPLIT-SCREEN LAYOUT ── */}
      <div className="desk" style={{display:"none", maxWidth:1440, margin:"0 auto"}}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 480px",
          alignItems:"start",
        }}>
          {/* Left: vertical image stack (scrollable) */}
          <div style={{borderRight:C.border}}>
            {images.map((src,i)=>(
              <div key={i} style={{
                borderBottom: i<images.length-1 ? `0.5px solid ${C.gray100}` : "none",
              }}>
                <FashionImg src={src} ratio="4/5" alt={`${p.name} ${i+1}`} zoom/>
              </div>
            ))}
          </div>

          {/* Right: sticky info panel */}
          <div style={{
            position:"sticky", top:88,
            maxHeight:"calc(100vh - 88px)",
            overflowY:"auto",
            padding:"44px 48px",
          }}>
            <InfoPanel/>
          </div>
        </div>
      </div>

    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CART PAGE
═══════════════════════════════════════════════════════════════ */
function CartPage({ cart, setCart, go }) {
  const remove = i => setCart(c => c.filter((_,idx)=>idx!==i));
  const total  = cart.reduce((s,p) => {
    const n = parseInt(p.price.replace(/\D/g,""), 10);
    return s + (isNaN(n)?0:n);
  }, 0);

  if (!cart.length) return (
    <div style={{textAlign:"center", padding:"88px 24px"}}>
      <p style={{
        fontFamily:C.serif, fontSize:22,
        letterSpacing:"0.05em", marginBottom:10,
      }}>
        Tas belanja kamu kosong
      </p>
      <p style={{
        fontSize:9, color:C.gray400,
        letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:36,
      }}>
        Tambahkan produk untuk melanjutkan
      </p>
      <BtnPrimary onClick={()=>go("plp")} style={{
        width:"auto", display:"inline-block", padding:"13px 48px",
      }}>
        Lanjut Belanja
      </BtnPrimary>
    </div>
  );

  return (
    <div style={{maxWidth:1100, margin:"0 auto", padding:"32px 20px 88px"}}>
      <div style={{
        display:"flex", alignItems:"baseline",
        justifyContent:"space-between", marginBottom:22,
      }}>
        <h1 style={{fontFamily:C.serif, fontWeight:400, fontSize:22, letterSpacing:"0.05em"}}>
          Tas Belanja
        </h1>
        <span style={{
          fontSize:8, letterSpacing:"0.16em",
          textTransform:"uppercase", color:C.gray400,
        }}>
          {cart.length} Produk
        </span>
      </div>
      <Line/>

      {cart.map((item,i)=>(
        <div key={i} style={{
          display:"flex", gap:18,
          padding:"20px 0", borderBottom:C.border,
        }}>
          <div style={{width:92, flexShrink:0}}>
            <FashionImg
              src={IMG.products[item.id]?.[0]}
              ratio="3/4" alt={item.name}
            />
          </div>
          <div style={{
            flex:1, display:"flex",
            flexDirection:"column", justifyContent:"space-between",
          }}>
            <div>
              <p style={{
                fontSize:11, letterSpacing:"0.06em",
                textTransform:"uppercase", marginBottom:5,
              }}>{item.name}</p>
              <p style={{fontSize:12, color:C.gray600, marginBottom:4}}>{item.price}</p>
              <p style={{fontSize:9, color:C.gray400, letterSpacing:"0.08em"}}>
                Ukuran: M · Warna: Hitam
              </p>
            </div>
            <button onClick={()=>remove(i)} style={{
              alignSelf:"flex-start", marginTop:12,
              fontSize:8, letterSpacing:"0.16em",
              textTransform:"uppercase",
              textDecoration:"underline", color:C.gray600,
            }}>
              Hapus
            </button>
          </div>
        </div>
      ))}

      {/* Order summary */}
      <div style={{maxWidth:400, marginTop:32}}>
        {[
          { label:"Subtotal",       val:`Rp ${total.toLocaleString("id-ID")}` },
          { label:"Ongkos Kirim",   val:"Dihitung saat checkout" },
        ].map(row=>(
          <div key={row.label} style={{
            display:"flex", justifyContent:"space-between",
            marginBottom:10,
          }}>
            <span style={{fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:C.gray600}}>
              {row.label}
            </span>
            <span style={{fontSize:11}}>{row.val}</span>
          </div>
        ))}

        <Line style={{margin:"18px 0"}}/>

        <div style={{
          display:"flex", justifyContent:"space-between",
          marginBottom:20,
        }}>
          <span style={{fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase"}}>Total</span>
          <span style={{fontSize:15, fontWeight:500}}>
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <BtnPrimary style={{marginBottom:10}}>Lanjut ke Pembayaran</BtnPrimary>
        <button onClick={()=>go("plp")} style={{
          width:"100%", padding:"13px",
          border:C.border, background:C.white,
          fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase",
          fontFamily:C.sans, borderColor:"#ccc",
        }}>
          Lanjut Belanja
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH OVERLAY
   Fullscreen overlay dengan input real-time + hasil filter produk
═══════════════════════════════════════════════════════════════ */
function SearchOverlay({ open, close, go, setProd }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Auto-focus saat dibuka
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
    if (!open) setQuery("");
  }, [open]);

  // Tutup dengan Escape
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const allProducts = [...PRODUCTS, ...PRODUCTS];
  const results = query.trim().length > 0
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const POPULAR = ["Rajutan", "Tas Tote", "Denim", "Jaket", "Aksesori"];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:300,
      visibility: open ? "visible" : "hidden",
      transition:`visibility 0s linear ${open?"0s":".3s"}`,
    }}>
      {/* Backdrop */}
      <div onClick={close} style={{
        position:"absolute", inset:0,
        background:"rgba(0,0,0,0.18)",
        opacity: open ? 1 : 0,
        transition:"opacity .3s ease",
      }}/>

      {/* Panel — slide dari atas */}
      <div style={{
        position:"absolute", top:0, left:0, right:0,
        background:"#fff",
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition:"transform .32s cubic-bezier(.4,0,.2,1)",
        boxShadow:"0 4px 32px rgba(0,0,0,0.08)",
        maxHeight:"90vh", overflowY:"auto",
        display:"flex", flexDirection:"column",
      }}>
        {/* Input row */}
        <div style={{
          display:"flex", alignItems:"center",
          padding:"0 20px", height:68,
          borderBottom:"0.5px solid #E0DEDC",
          gap:12, flexShrink:0,
        }}>
          {/* Search icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#999" strokeWidth="1.3" strokeLinecap="round">
            <circle cx="11" cy="11" r="7.5"/>
            <path d="M20.5 20.5l-3.5-3.5"/>
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari produk..."
            style={{
              flex:1, border:"none", outline:"none",
              fontSize:15, color:"#000", background:"none",
              fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",
              letterSpacing:"0.02em",
            }}
          />

          {/* Clear */}
          {query.length > 0 && (
            <button onClick={()=>setQuery("")} style={{
              display:"flex", color:"#999", flexShrink:0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          {/* Close */}
          <button onClick={close} style={{
            fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase",
            color:"#666", flexShrink:0,
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"inherit",
          }}>
            Tutup
          </button>
        </div>

        {/* Body */}
        <div style={{padding:"20px 20px 32px"}}>

          {/* Tidak ada query → tampilkan pencarian populer */}
          {query.trim() === "" && (
            <div>
              <p style={{
                fontSize:8, letterSpacing:"0.2em",
                textTransform:"uppercase", color:"#aaa", marginBottom:14,
              }}>
                Pencarian Populer
              </p>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {POPULAR.map(t => (
                  <button key={t} onClick={()=>setQuery(t)} style={{
                    padding:"7px 16px",
                    border:"0.5px solid #D9D7D4",
                    background:"#fff", color:"#000",
                    fontSize:10, letterSpacing:"0.1em",
                    textTransform:"uppercase",
                    fontFamily:"inherit", cursor:"pointer",
                  }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Kategori cepat */}
              <p style={{
                fontSize:8, letterSpacing:"0.2em",
                textTransform:"uppercase", color:"#aaa",
                marginTop:28, marginBottom:14,
              }}>
                Kategori
              </p>
              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1fr",
                gap:"0",
                border:"0.5px solid #E0DEDC",
              }}>
                {CATEGORIES.slice(0,6).map((cat,i) => (
                  <button key={cat.id} onClick={()=>{ go("plp"); close(); }} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"14px 16px",
                    borderRight: i%2===0 ? "0.5px solid #E0DEDC" : "none",
                    borderBottom: i<4 ? "0.5px solid #E0DEDC" : "none",
                    background:"none", border_:"none", cursor:"pointer",
                    textAlign:"left",
                    borderTop:"none",
                  }}>
                    <div style={{
                      width:40, height:40, flexShrink:0,
                      overflow:"hidden", background:"#F5F5F5",
                    }}>
                      <img src={IMG.cats[cat.title]} alt={cat.title}
                        style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    </div>
                    <span style={{
                      fontSize:10, letterSpacing:"0.12em",
                      textTransform:"uppercase", color:"#000",
                    }}>{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ada query → tampilkan hasil */}
          {query.trim() !== "" && (
            <div>
              <p style={{
                fontSize:8, letterSpacing:"0.2em",
                textTransform:"uppercase", color:"#aaa", marginBottom:16,
              }}>
                {results.length > 0
                  ? `${results.length} Hasil untuk "${query}"`
                  : `Tidak ada hasil untuk "${query}"`}
              </p>

              {results.length === 0 && (
                <div style={{textAlign:"center", padding:"32px 0"}}>
                  <p style={{fontSize:13, color:"#aaa", marginBottom:8}}>
                    Produk tidak ditemukan
                  </p>
                  <p style={{fontSize:10, color:"#ccc", letterSpacing:"0.08em"}}>
                    Coba kata kunci lain
                  </p>
                </div>
              )}

              {/* Result grid */}
              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:0,
                borderTop:"0.5px solid #E0DEDC",
              }}>
                {results.map((p,i) => {
                  const isRight = i%2===1;
                  const isLast  = i >= results.length-2;
                  return (
                    <button key={`${p.id}-${i}`} onClick={()=>{
                      setProd(p); go("pdp"); close();
                    }} style={{
                      display:"flex", alignItems:"center", gap:12,
                      padding:"12px 14px",
                      background:"none", border:"none", cursor:"pointer",
                      textAlign:"left",
                      borderRight: !isRight ? "0.5px solid #E0DEDC" : "none",
                      borderBottom: !isLast ? "0.5px solid #E0DEDC" : "none",
                    }}>
                      <div style={{
                        width:52, height:52, flexShrink:0,
                        overflow:"hidden", background:"#F5F5F5",
                      }}>
                        <img
                          src={IMG.products[p.id]?.[0]}
                          alt={p.name}
                          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}
                        />
                      </div>
                      <div>
                        <p style={{
                          fontSize:10, letterSpacing:"0.06em",
                          textTransform:"uppercase", marginBottom:3,
                          lineHeight:1.4, color:"#000",
                        }}>{p.name}</p>
                        <p style={{fontSize:11, color:"#6E6C69"}}>{p.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {results.length > 0 && (
                <button onClick={()=>{ go("plp"); close(); }} style={{
                  width:"100%", marginTop:20,
                  padding:"13px",
                  background:"#000", color:"#fff",
                  border:"none", cursor:"pointer",
                  fontSize:9, letterSpacing:"0.22em",
                  textTransform:"uppercase",
                  fontFamily:"inherit",
                }}>
                  Lihat Semua Hasil
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCOUNT PAGE
   Halaman profil / login
═══════════════════════════════════════════════════════════════ */
function AccountPage({ go }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [email,   setEmail]     = useState("");
  const [pass,    setPass]      = useState("");
  const [name,    setName]      = useState("");
  const [success, setSuccess]   = useState(false);

  const inputStyle = {
    width:"100%", padding:"13px 14px",
    border:"0.5px solid #D9D7D4",
    background:"#fff", outline:"none",
    fontSize:12, color:"#000",
    fontFamily:"inherit",
    marginBottom:10,
    letterSpacing:"0.03em",
  };

  const handleSubmit = () => {
    if (!email || !pass) return;
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{
        maxWidth:440, margin:"0 auto",
        padding:"80px 24px",
        textAlign:"center",
      }}>
        <div style={{
          width:56, height:56, borderRadius:"50%",
          background:"#000", margin:"0 auto 24px",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style={{
          fontFamily:"'Georgia',serif", fontWeight:400,
          fontSize:22, letterSpacing:"0.05em", marginBottom:10,
        }}>
          {isLogin ? "Selamat Datang Kembali" : "Akun Dibuat"}
        </h2>
        <p style={{fontSize:11, color:"#6E6C69", marginBottom:32, lineHeight:1.8}}>
          {isLogin
            ? "Kamu berhasil masuk ke akun LUX E."
            : "Akun kamu berhasil dibuat. Selamat berbelanja!"}
        </p>
        <button onClick={()=>go("home")} style={{
          background:"#000", color:"#fff", border:"none",
          padding:"13px 48px", cursor:"pointer",
          fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase",
          fontFamily:"inherit",
        }}>
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <div style={{maxWidth:440, margin:"0 auto", padding:"48px 24px 80px"}}>
      {/* Tab switcher */}
      <div style={{
        display:"flex", borderBottom:"0.5px solid #D9D7D4",
        marginBottom:32,
      }}>
        {["Masuk","Daftar"].map((tab,i) => (
          <button key={tab} onClick={()=>{ setIsLogin(i===0); setSuccess(false); }} style={{
            flex:1, padding:"12px 0",
            fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase",
            color: (isLogin&&i===0)||(!isLogin&&i===1) ? "#000" : "#aaa",
            borderBottom: (isLogin&&i===0)||(!isLogin&&i===1)
              ? "1.5px solid #000" : "none",
            marginBottom:-1,
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"inherit",
          }}>
            {tab}
          </button>
        ))}
      </div>

      <h1 style={{
        fontFamily:"'Georgia',serif", fontWeight:400,
        fontSize:24, letterSpacing:"0.05em", marginBottom:6,
      }}>
        {isLogin ? "Masuk ke Akun" : "Buat Akun Baru"}
      </h1>
      <p style={{
        fontSize:11, color:"#6E6C69", marginBottom:28,
        lineHeight:1.7, letterSpacing:"0.02em",
      }}>
        {isLogin
          ? "Masuk untuk melihat pesanan dan wishlist kamu."
          : "Bergabunglah untuk pengalaman belanja yang personal."}
      </p>

      {/* Form */}
      {!isLogin && (
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Nama Lengkap"
          style={inputStyle}
        />
      )}
      <input
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="Alamat Email"
        type="email"
        style={inputStyle}
      />
      <input
        value={pass}
        onChange={e=>setPass(e.target.value)}
        placeholder="Kata Sandi"
        type="password"
        style={inputStyle}
      />

      {isLogin && (
        <button style={{
          fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase",
          textDecoration:"underline", color:"#6E6C69",
          background:"none", border:"none", cursor:"pointer",
          fontFamily:"inherit", marginBottom:24, display:"block",
        }}>
          Lupa kata sandi?
        </button>
      )}

      <button onClick={handleSubmit} style={{
        width:"100%", padding:"14px",
        background:"#000", color:"#fff", border:"none",
        fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase",
        fontFamily:"inherit", cursor:"pointer", marginTop:8,
      }}>
        {isLogin ? "Masuk" : "Buat Akun"}
      </button>

      <div style={{
        margin:"28px 0",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div style={{flex:1, height:"0.5px", background:"#E0DEDC"}}/>
        <span style={{fontSize:9, color:"#aaa", letterSpacing:"0.1em"}}>ATAU</span>
        <div style={{flex:1, height:"0.5px", background:"#E0DEDC"}}/>
      </div>

      {/* Social login */}
      {[
        { label:"Lanjutkan dengan Google", icon:"G" },
        { label:"Lanjutkan dengan Apple",  icon:"" },
      ].map(s => (
        <button key={s.label} style={{
          width:"100%", padding:"13px",
          border:"0.5px solid #D9D7D4", background:"#fff",
          fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase",
          fontFamily:"inherit", cursor:"pointer", marginBottom:10,
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          <span style={{fontWeight:600, fontSize:13}}>{s.icon}</span>
          {s.label}
        </button>
      ))}

      <p style={{
        fontSize:9, color:"#aaa", textAlign:"center",
        marginTop:24, lineHeight:1.8, letterSpacing:"0.04em",
      }}>
        Dengan masuk, kamu menyetujui{" "}
        <span style={{textDecoration:"underline", cursor:"pointer"}}>Syarat & Ketentuan</span>
        {" "}dan{" "}
        <span style={{textDecoration:"underline", cursor:"pointer"}}>Kebijakan Privasi</span> kami.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUPABASE SCHEMA (reference — not executed in this file)
   Copy this SQL into your Supabase SQL editor.
═══════════════════════════════════════════════════════════════

-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  shipping_address text,
  created_at timestamptz default now()
);

-- products
create table products (
  id bigserial primary key,
  title text not null,
  description text,
  price numeric(12,2) not null,
  category text,
  images text[],
  tags text[],
  created_at timestamptz default now()
);

-- product_variants
create table product_variants (
  id bigserial primary key,
  product_id bigint references products(id) on delete cascade,
  size text,
  color text,
  stock integer default 0,
  created_at timestamptz default now()
);

-- cart_items
create table cart_items (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  product_id bigint references products(id) on delete cascade,
  variant_id bigint references product_variants(id),
  quantity integer default 1,
  created_at timestamptz default now()
);

create index on cart_items(user_id);
create index on cart_items(product_id);

═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   ROOT APPLICATION
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page,       setPage]    = useState("home");
  const [drawer,     setDrawer]  = useState(false);
  const [searchOpen, setSearch]  = useState(false);
  const [cart,       setCart]    = useState([]);
  const [prod,       setProd]    = useState(null);

  const go      = useCallback(p => { setPage(p); window.scrollTo(0,0); }, []);
  const addCart = useCallback(item => setCart(c => [...c, item]), []);

  return (
    <div style={{
      fontFamily:C.sans,
      background:C.white, color:C.black,
      minHeight:"100vh",
    }}>
      <Header
        page={page}
        go={go}
        cartQty={cart.length}
        openMenu={()=>setDrawer(true)}
        openSearch={()=>setSearch(true)}
        openAccount={()=>go("account")}
      />

      <NavDrawer open={drawer} close={()=>setDrawer(false)} go={go}/>

      <SearchOverlay
        open={searchOpen}
        close={()=>setSearch(false)}
        go={go}
        setProd={setProd}
      />

      {page==="home"    && <HomePage    go={go} setProd={setProd}/>}
      {page==="plp"     && <PLPPage     go={go} setProd={setProd}/>}
      {page==="pdp"     && <PDPPage     prod={prod} addToCart={addCart}/>}
      {page==="cart"    && <CartPage    cart={cart} setCart={setCart} go={go}/>}
      {page==="account" && <AccountPage go={go}/>}
    </div>
  );
}
