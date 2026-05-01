import "server-only";

import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

export type DocumentRecord = {
  id: string;
  owner_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  storage_path: string;
  created_at: string;
};

export type ShareLinkRecord = {
  id: string;
  document_id: string;
  token: string;
  expires_at: string | null;
  revoked: boolean;
  created_at: string;
};

export type ViewEventRecord = {
  id: string;
  share_link_id: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
};

export async function getUserDocuments(ownerId: string) {
  if (!hasSupabaseAdminConfig()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("documents")
    .select("*, share_links(*, view_events(*))")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDocumentForOwner(documentId: string, ownerId: string) {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase is not configured yet.");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("documents")
    .select("*, share_links(*, view_events(*))")
    .eq("id", documentId)
    .eq("owner_id", ownerId)
    .single();

  if (error) throw error;
  return data;
}
