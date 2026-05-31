import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { linkId } = (await request.json()) as { linkId?: string };
    if (!linkId || typeof linkId !== "string") {
      return NextResponse.json({ error: "linkId requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc("increment_link_clicks", {
      link_id: linkId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
