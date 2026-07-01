import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/cart
 * Returns cart items for the authenticated user.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

/**
 * POST /api/cart
 * Body: { product_id, variant_id?, quantity }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { product_id, variant_id = null, quantity = 1 } = body;

  if (!product_id) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      { user_id: user.id, product_id, variant_id, quantity },
      { onConflict: "user_id,product_id,variant_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}

/**
 * DELETE /api/cart
 * Body: { item_id }
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item_id } = await req.json();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", item_id)
    .eq("user_id", user.id); // safety: only delete own items

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
