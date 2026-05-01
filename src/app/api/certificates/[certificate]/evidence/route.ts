import { NextResponse } from "next/server";
import { stableStringify } from "@/lib/certificates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ certificate: string }> }) {
  const { certificate } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("access_certificates")
    .select("*")
    .eq("certificate_number", certificate)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const evidence = {
    certificate_number: data.certificate_number,
    issued_at: data.issued_at,
    payload_sha256: data.payload_sha256,
    event_log_sha256: data.event_log_sha256,
    signature_base64: data.signature,
    public_key_spki_der_base64: data.public_key,
    canonical_payload_json: stableStringify(data.payload),
    payload: data.payload
  };

  return new NextResponse(JSON.stringify(evidence, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${data.certificate_number}-evidence.json"`
    }
  });
}
