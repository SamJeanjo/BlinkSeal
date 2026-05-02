import { LegalPage } from "@/components/blinkseal/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Company"
      title="Terms & Conditions"
      intro="Effective March 1, 2026. Code10Rx LLC operates BlinkSeal as a secure document sharing and access proof service."
      sections={[
        {
          title: "Overview",
          body: ["BlinkSeal provides secure document sharing with access tracking and audit proof features. By using the service, you agree to these terms."]
        },
        {
          title: "Your account",
          body: ["You are responsible for maintaining account security, protecting login credentials, and all activity under your account. You must provide accurate account information."]
        },
        {
          title: "Acceptable use",
          body: ["BlinkSeal may suspend accounts that violate service rules."],
          bullets: ["Do not violate laws or regulations.", "Do not share illegal, harmful, or infringing content.", "Do not attempt to reverse engineer or disrupt the service.", "Do not upload malware or malicious files."]
        },
        {
          title: "Data and content",
          body: ["You retain ownership of documents you upload. BlinkSeal does not claim ownership of your content and processes data only to provide the service."]
        },
        {
          title: "Security and availability",
          body: ["BlinkSeal implements reasonable safeguards, but no system is guaranteed to be perfectly secure. Service may be temporarily unavailable for maintenance or technical issues."]
        },
        {
          title: "Payments",
          body: ["Paid plans are billed monthly, can be canceled anytime, and do not include partial-month refunds unless required by law."]
        },
        {
          title: "Limitation of liability",
          body: ["BlinkSeal is provided as is. To the maximum extent permitted by law, BlinkSeal is not liable for indirect damages, lost profits, business interruption, or data loss beyond our control."]
        },
        {
          title: "Contact",
          body: ["For questions, contact support@blinkseal.com."]
        }
      ]}
    />
  );
}
