import { LegalPage } from "@/components/blinkseal/legal-page";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Company"
      title="Privacy Policy"
      intro="Effective March 1, 2026. BlinkSeal respects privacy and uses data to provide secure document tracking, audit records, and account services."
      sections={[
        {
          title: "Information we collect",
          bullets: ["Account information such as email and name.", "Usage data including document access logs, timestamps, and IP address.", "Billing information handled through a secure payment processor."]
        },
        {
          title: "How we use information",
          bullets: ["Provide document tracking services.", "Generate audit reports and proof records.", "Improve security and reliability.", "Process payments for paid plans."]
        },
        {
          title: "Data storage and security",
          body: ["BlinkSeal uses secure infrastructure and encryption. Access logs and audit data are stored securely, and safeguards are implemented to protect user information."]
        },
        {
          title: "Data sharing",
          body: ["BlinkSeal does not sell or rent user data."],
          bullets: ["Data may be shared with payment providers for billing.", "Infrastructure providers may process data for hosting and service operation.", "Data may be disclosed if required by law."]
        },
        {
          title: "Data retention",
          body: ["BlinkSeal retains data while an account is active and as required for legal or compliance purposes. Users may request account deletion where permitted."]
        },
        {
          title: "Your rights",
          body: ["You may request access, correction, or deletion of your data where permitted. Contact support@blinkseal.com."]
        }
      ]}
    />
  );
}
