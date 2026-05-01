import "server-only";

import { createHash, createPrivateKey, createPublicKey, randomUUID, sign, verify } from "node:crypto";
import { DOCUMENT_BUCKET, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAppUrl } from "@/lib/format";

type CertificateEvent = {
  id: string;
  event_type: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  details: Record<string, unknown> | null;
};

type CertificateDocument = {
  id: string;
  owner_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  storage_path: string;
  sha256: string | null;
  created_at: string;
};

type CertificateLink = {
  id: string;
  document_id: string;
  token: string;
  title: string | null;
  expires_at: string | null;
  revoked: boolean;
  view_limit: number | null;
  one_time_access: boolean;
  allow_download: boolean;
  created_at: string;
  documents: CertificateDocument;
  view_events: CertificateEvent[];
};

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

export function sha256Hex(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function signingPrivateKey() {
  return createPrivateKey({
    key: Buffer.from(requiredEnv("BLINKSEAL_CERT_PRIVATE_KEY_B64"), "base64"),
    format: "der",
    type: "pkcs8"
  });
}

function signingPublicKey(publicKeyB64 = requiredEnv("BLINKSEAL_CERT_PUBLIC_KEY_B64")) {
  return createPublicKey({
    key: Buffer.from(publicKeyB64, "base64"),
    format: "der",
    type: "spki"
  });
}

export function publicKeyFingerprint(publicKeyB64 = requiredEnv("BLINKSEAL_CERT_PUBLIC_KEY_B64")) {
  return sha256Hex(Buffer.from(publicKeyB64, "base64")).slice(0, 32);
}

export function signPayload(payloadSha256: string) {
  return sign(null, Buffer.from(payloadSha256, "hex"), signingPrivateKey()).toString("base64");
}

export function verifyPayloadSignature(payloadSha256: string, signatureB64: string, publicKeyB64?: string) {
  return verify(
    null,
    Buffer.from(payloadSha256, "hex"),
    signingPublicKey(publicKeyB64),
    Buffer.from(signatureB64, "base64")
  );
}

export async function ensureDocumentHash(document: CertificateDocument) {
  if (document.sha256) return document.sha256;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).download(document.storage_path);
  if (error || !data) throw error ?? new Error("Unable to download document for hashing.");

  const bytes = Buffer.from(await data.arrayBuffer());
  const hash = sha256Hex(bytes);

  const { error: updateError } = await supabase
    .from("documents")
    .update({ sha256: hash })
    .eq("id", document.id);

  if (updateError) throw updateError;
  return hash;
}

function certificateNumber() {
  const year = new Date().getUTCFullYear();
  const random = createHash("sha256")
    .update(`${randomUUID()}-${Date.now()}`)
    .digest("hex")
    .slice(0, 10)
    .toUpperCase();
  return `BSC-${year}-${random}`;
}

export async function issueCertificateForLink(documentId: string, shareLinkId: string, ownerId: string) {
  const supabase = getSupabaseAdmin();
  const { data: link, error } = await supabase
    .from("share_links")
    .select("*, documents!inner(*), view_events(*)")
    .eq("id", shareLinkId)
    .eq("document_id", documentId)
    .eq("documents.owner_id", ownerId)
    .single<CertificateLink>();

  if (error || !link) throw error ?? new Error("Secure link not found.");

  const documentHash = await ensureDocumentHash(link.documents);
  const issuedAt = new Date().toISOString();
  const sortedEvents = [...(link.view_events ?? [])].sort(
    (a, b) => new Date(a.viewed_at).getTime() - new Date(b.viewed_at).getTime()
  );
  const eventPayload = sortedEvents.map((event) => ({
    id: event.id,
    type: event.event_type || "open",
    occurred_at_utc: event.viewed_at,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
    referrer: event.referrer,
    details: event.details ?? {}
  }));
  const eventLogSha256 = sha256Hex(stableStringify(eventPayload));
  const publicKey = requiredEnv("BLINKSEAL_CERT_PUBLIC_KEY_B64");
  const number = certificateNumber();

  const payload = {
    schema: "blinkseal.access_certificate.v1",
    certificate: {
      id: number,
      issued_at_utc: issuedAt,
      verification_url: `${getAppUrl()}/verify/${number}`
    },
    document: {
      id: link.documents.id,
      file_name: link.documents.file_name,
      file_type: link.documents.file_type,
      file_size: link.documents.file_size,
      sha256: documentHash,
      uploaded_at_utc: link.documents.created_at
    },
    share_link: {
      id: link.id,
      token_sha256: sha256Hex(link.token),
      title: link.title,
      created_at_utc: link.created_at,
      expires_at_utc: link.expires_at,
      revoked: link.revoked,
      view_limit: link.view_limit,
      one_time_access: link.one_time_access,
      allow_download: link.allow_download
    },
    events: eventPayload,
    hashes: {
      event_log_sha256: eventLogSha256
    },
    public_key: {
      algorithm: "Ed25519",
      spki_der_base64: publicKey,
      fingerprint_sha256_128: publicKeyFingerprint(publicKey)
    },
    claims: {
      proves: [
        "The recorded document hash matches the file BlinkSeal stored for this link.",
        "The listed access events were in BlinkSeal's event log when the certificate was issued.",
        "The certificate payload was signed by the BlinkSeal certificate signing key."
      ],
      does_not_prove: [
        "That a recipient personally read or understood the document.",
        "That legal service was completed without independent legal analysis."
      ]
    }
  };

  const payloadSha256 = sha256Hex(stableStringify(payload));
  const signature = signPayload(payloadSha256);

  const { data: certificate, error: insertError } = await supabase
    .from("access_certificates")
    .insert({
      certificate_number: number,
      document_id: documentId,
      share_link_id: shareLinkId,
      payload,
      payload_sha256: payloadSha256,
      event_log_sha256: eventLogSha256,
      signature,
      public_key: publicKey
    })
    .select("certificate_number")
    .single();

  if (insertError) throw insertError;
  return certificate.certificate_number as string;
}
