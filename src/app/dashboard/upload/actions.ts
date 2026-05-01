"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { DOCUMENT_BUCKET, getSupabaseAdmin } from "@/lib/supabase/admin";

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

export async function uploadDocument(formData: FormData) {
  const appUser = await requireCurrentUser();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  const supabase = getSupabaseAdmin();
  const storagePath = `${appUser.id}/${randomUUID()}-${safeName(file.name)}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      owner_id: appUser.id,
      file_name: file.name,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      storage_path: storagePath
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/documents/${data.id}`);
}
