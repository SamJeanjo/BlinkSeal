import { SignIn } from "@clerk/nextjs";
import { BrandMark } from "@/components/blinkseal/logo";
import { getClerkPublishableKey } from "@/lib/clerk-config";

export default function SignInPage() {
  const hasClerk = Boolean(getClerkPublishableKey());

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] p-6">
      <div className="mb-8">
        <BrandMark />
      </div>
      {hasClerk ? (
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      ) : (
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <h1 className="text-xl font-semibold text-slate-900">Authentication not configured</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add the Clerk environment variables in Vercel to enable sign in.
          </p>
        </div>
      )}
    </main>
  );
}
