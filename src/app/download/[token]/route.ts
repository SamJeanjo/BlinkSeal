import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { DOCUMENT_BUCKET, getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const requestHeaders = await headers();
  const supabase = getSupabaseAdmin();

  const { data: shareLink } = await supabase
    .from("share_links")
    .select("*, documents(*), view_events(id)")
    .eq("token", token)
    .maybeSingle();

  if (
    !shareLink ||
    shareLink.revoked ||
    !shareLink.allow_download ||
    (shareLink.expires_at && new Date(shareLink.expires_at).getTime() < Date.now())
  ) {
    return NextResponse.redirect(new URL(`/view/${token}`, _request.url));
  }

  const priorViewCount = shareLink.view_events?.length ?? 0;
  const viewLimit = shareLink.one_time_access ? 1 : shareLink.view_limit;
  if (viewLimit && priorViewCount >= viewLimit) {
    return NextResponse.redirect(new URL(`/view/${token}`, _request.url));
  }

  const { data: signed, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(shareLink.documents.storage_path, 60 * 5, {
      download: shareLink.documents.file_name
    });

  if (error || !signed?.signedUrl) {
    return NextResponse.redirect(new URL(`/view/${token}`, _request.url));
  }

  await supabase.from("view_events").insert({
    share_link_id: shareLink.id,
    event_type: "download",
    ip_address:
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      requestHeaders.get("x-real-ip") ??
      null,
    user_agent: requestHeaders.get("user-agent"),
    referrer: requestHeaders.get("referer"),
    details: { file_name: shareLink.documents.file_name }
  });

  return NextResponse.redirect(signed.signedUrl);
}
