// ─── Product ─────────────────────────────────────────────────
export interface ProductColor {
  name: string;
  hex:  string;
}

export interface Product {
  id:     number;
  name:   string;
  price:  string;
  tag:    string | null;
  colors: ProductColor[];
  sizes:  string[];
  desc:   string;
}

export interface Category {
  id:    number;
  title: string;
  tag:   string | null;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItem extends Product {
  selectedColor?: string;
  selectedSize?:  string;
  quantity:       number;
}

// ─── Pages ───────────────────────────────────────────────────
export type Page = "home" | "plp" | "pdp" | "cart" | "account";

// ─── Supabase DB types ────────────────────────────────────────
export interface DbUser {
  id:               string;
  email:            string;
  full_name:        string | null;
  shipping_address: string | null;
  created_at:       string;
}

export interface DbProduct {
  id:          number;
  title:       string;
  description: string | null;
  price:       number;
  category:    string | null;
  images:      string[];
  tags:        string[];
  created_at:  string;
}

export interface DbProductVariant {
  id:         number;
  product_id: number;
  size:       string | null;
  color:      string | null;
  stock:      number;
  created_at: string;
}

export interface DbCartItem {
  id:         number;
  user_id:    string;
  product_id: number;
  variant_id: number | null;
  quantity:   number;
  created_at: string;
}
