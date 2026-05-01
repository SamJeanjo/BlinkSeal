import { SignIn } from "@clerk/nextjs";
import { BrandMark } from "@/components/blinkseal/logo";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] p-6">
      <div className="mb-8">
        <BrandMark />
      </div>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </main>
  );
}
