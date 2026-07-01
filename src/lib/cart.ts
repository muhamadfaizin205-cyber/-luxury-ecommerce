import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

/**
 * Add an item to cart_items in Supabase.
 * Falls back gracefully if user is not authenticated.
 */
export async function addToCartDb(
  product: Product,
  selectedSize:  string,
  selectedColor: string,
  quantity = 1
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Silakan masuk terlebih dahulu." };

  // Find matching variant
  const { data: variant } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", product.id)
    .eq("size", selectedSize)
    .eq("color", selectedColor)
    .maybeSingle();

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id:    user.id,
      product_id: product.id,
      variant_id: variant?.id ?? null,
      quantity,
    },
    { onConflict: "user_id,product_id,variant_id" }
  );

  return { error: error?.message ?? null };
}

/**
 * Fetch all cart items for the current user.
 */
export async function getCartItems() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cart_items")
    .select(`
      id, quantity,
      product_id,
      variant_id,
      products ( id, title, price, images ),
      product_variants ( size, color )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

/**
 * Remove one cart item by id.
 */
export async function removeCartItem(itemId: number) {
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("id", itemId);
}
