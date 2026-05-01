import { UserButton } from "@clerk/nextjs";
import { Plus, Shield } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/blinkseal/logo";
import { Button } from "@/components/blinkseal/button";
import { getClerkPublishableKey } from "@/lib/clerk-config";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hasClerk = Boolean(getClerkPublishableKey());

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <Link href="/dashboard" className="flex-shrink-0">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-3">
            <Button href="/security" variant="outline" className="hidden sm:inline-flex">
              <Shield className="h-4 w-4" />
              Security
            </Button>
            <Button href="/dashboard/upload" className="font-medium">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create link</span>
            </Button>
            {hasClerk && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-[1440px] px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
