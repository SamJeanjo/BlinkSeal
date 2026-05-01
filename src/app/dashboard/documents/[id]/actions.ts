"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function makeToken() {
  return randomBytes(24).toString("base64url");
}

export async function createShareLink(documentId: string, formData: FormData) {
  const appUser = await requireCurrentUser();
  const expires = formData.get("expires_at")?.toString();
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
    expires_at: expires ? new Date(expires).toISOString() : null,
    revoked: false
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
    ip_address: "Owner test",
    user_agent: "BlinkSeal test event",
    referrer: "dashboard"
  });

  if (error) throw error;
  revalidatePath(`/dashboard/documents/${documentId}`);
  revalidatePath("/dashboard");
}
