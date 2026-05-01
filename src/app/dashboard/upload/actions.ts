"use server";

import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { DOCUMENT_BUCKET, getSupabaseAdmin } from "@/lib/supabase/admin";

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");
const maxUploadBytes = 25 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export async function uploadDocument(formData: FormData) {
  const appUser = await requireCurrentUser();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Files must be 25 MB or smaller.");
  }

  if (file.type && !allowedTypes.has(file.type)) {
    throw new Error("Upload a PDF, Word document, PNG, JPG, or WebP file.");
  }

  const supabase = getSupabaseAdmin();
  const storagePath = `${appUser.id}/${randomUUID()}-${safeName(file.name)}`;
  const bytes = await file.arrayBuffer();
  const fileSha256 = createHash("sha256").update(Buffer.from(bytes)).digest("hex");

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
      storage_path: storagePath,
      sha256: fileSha256
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/documents/${data.id}`);
}
