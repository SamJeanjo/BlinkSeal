import { LegalPage } from "@/components/blinkseal/legal-page";

export default function SecurityPage() {
  return (
    <LegalPage
      eyebrow="Security overview"
      title="Secure document sharing with built-in proof."
      intro="BlinkSeal is built for confidential legal, HR, and compliance workflows where teams need controlled delivery, reliable access tracking, and audit-ready proof."
      sections={[
        {
          title: "Private storage by default",
          body: ["Documents remain in private storage and are never served from public object URLs. Public viewers access files only after the viewer route validates the secure token server-side."]
        },
        {
          title: "Signed URL access",
          body: ["After validation, BlinkSeal issues a short-lived signed URL. Revoked, expired, invalid, or blocked links show a clean unavailable state instead of exposing file details."]
        },
        {
          title: "Access proof",
          body: ["Every document can include a live Access Proof page showing who opened it, when, from where, and on what device."],
          bullets: ["File status", "Opens and downloads", "IP and device", "Local and UTC timestamps", "Immutable audit timeline"]
        },
        {
          title: "Audit exports",
          body: ["BlinkSeal generates verifiable proof records with document hashes, event history, and certificate-ready evidence bundles for legal and IT review."]
        }
      ]}
    />
  );
}
