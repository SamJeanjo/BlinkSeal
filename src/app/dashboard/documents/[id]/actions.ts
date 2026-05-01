"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { issueCertificateForLink } from "@/lib/certificates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function makeToken() {
  return randomBytes(24).toString("base64url");
}

export async function createShareLink(documentId: string, formData: FormData) {
  const appUser = await requireCurrentUser();
  const title = formData.get("title")?.toString().trim() || null;
  const expirationEnabled = formData.get("expiration_enabled") === "on";
  const expires = formData.get("expires_at")?.toString();
  const viewLimitEnabled = formData.get("view_limit_enabled") === "on";
  const viewLimitValue = Number(formData.get("view_limit")?.toString() || "");
  const oneTimeAccess = formData.get("one_time_access") === "on";
  const allowDownload = formData.get("allow_download") === "on";
  const supabase = getSupabaseAdmin();

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("owner_id", appUser.id)
    .single();

  if (docError || !document) {
    throw new Error("Document not found.");
  }

  const { error } = await supabase.from("share_links").insert({
    document_id: documentId,
    token: makeToken(),
    title,
    expires_at: expirationEnabled && expires ? new Date(expires).toISOString() : null,
    revoked: false,
    view_limit: oneTimeAccess ? 1 : viewLimitEnabled && Number.isFinite(viewLimitValue) && viewLimitValue > 0 ? viewLimitValue : null,
    one_time_access: oneTimeAccess,
    allow_download: allowDownload
  });

  if (error) throw error;
  revalidatePath(`/dashboard/documents/${documentId}`);
  revalidatePath("/dashboard");
}

export async function revokeShareLink(documentId: string, shareLinkId: string) {
  const appUser = await requireCurrentUser();
  const supabase = getSupabaseAdmin();

  const { data: ownedDocument, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("owner_id", appUser.id)
    .single();

  if (docError || !ownedDocument) {
    throw new Error("Document not found.");
  }

  const { error } = await supabase
    .from("share_links")
    .update({ revoked: true })
    .eq("id", shareLinkId)
    .eq("document_id", documentId);

  if (error) throw error;
  revalidatePath(`/dashboard/documents/${documentId}`);
  revalidatePath("/dashboard");
}

export async function recordTestView(documentId: string, shareLinkId: string) {
  const appUser = await requireCurrentUser();
  const supabase = getSupabaseAdmin();

  const { data: ownedLink, error: linkError } = await supabase
    .from("share_links")
    .select("id, documents!inner(id, owner_id)")
    .eq("id", shareLinkId)
    .eq("document_id", documentId)
    .eq("documents.owner_id", appUser.id)
    .single();

  if (linkError || !ownedLink) {
    throw new Error("Secure link not found.");
  }

  const { error } = await supabase.from("view_events").insert({
    share_link_id: shareLinkId,
    event_type: "open",
    ip_address: "Owner test",
    user_agent: "BlinkSeal test event",
    referrer: "dashboard",
    details: { source: "owner_test" }
  });

  if (error) throw error;
  revalidatePath(`/dashboard/documents/${documentId}`);
  revalidatePath("/dashboard");
}

export async function issueAccessCertificate(documentId: string, shareLinkId: string) {
  const appUser = await requireCurrentUser();
  const certificateNumber = await issueCertificateForLink(documentId, shareLinkId, appUser.id);
  revalidatePath(`/dashboard/documents/${documentId}`);
  redirect(`/verify/${certificateNumber}`);
}
