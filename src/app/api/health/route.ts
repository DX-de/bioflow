import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "BioFlow",
    supabase: isSupabaseConfigured() ? "configured" : "missing",
    timestamp: new Date().toISOString(),
  });
}
