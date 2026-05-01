import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "BlinkSeal",
  description: "Secure document links with proof of access."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const body = <body>{children}</body>;

  return (
    clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
          {body}
        </html>
      </ClerkProvider>
    ) : (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        {body}
      </html>
    )
  );
}
