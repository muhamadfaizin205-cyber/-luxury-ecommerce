import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/products
 * Returns all products from Supabase.
 * Falls back to empty array if Supabase is not configured.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API/products] Supabase error:", error.message);
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (err) {
    console.error("[API/products] Unexpected error:", err);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
