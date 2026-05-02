import { LegalPage } from "@/components/blinkseal/legal-page";

export default function SecurityCompliancePage() {
  return (
    <LegalPage
      eyebrow="Security"
      title="Security & Compliance"
      intro="BlinkSeal is designed for audit-ready document delivery using modern cloud infrastructure and security-first access controls."
      sections={[
        {
          title: "Encryption",
          bullets: ["Data is encrypted in transit with HTTPS/TLS.", "Documents are stored in private storage.", "Sensitive service credentials remain server-side."]
        },
        {
          title: "Access controls",
          bullets: ["Links can be revoked.", "Expiration settings limit access windows.", "Access rules validate server-side before files are shown.", "Watermarking is planned for Pro workflows."]
        },
        {
          title: "Access logging",
          body: ["Every valid document interaction is recorded for audit proof."],
          bullets: ["Timestamp", "IP address", "Device and browser information", "Action type such as open or download"]
        },
        {
          title: "Audit reports",
          body: ["Users can generate chronological event records and downloadable proof of access for legal, HR, and compliance workflows."]
        },
        {
          title: "Infrastructure",
          body: ["BlinkSeal is built on modern cloud infrastructure with private storage, server-side access checks, signed URLs, and production deployment practices."]
        }
      ]}
    />
  );
}
