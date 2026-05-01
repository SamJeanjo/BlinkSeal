import { SignUp } from "@clerk/nextjs";
import { BrandMark } from "@/components/blinkseal/logo";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] p-6">
      <div className="mb-8">
        <BrandMark />
      </div>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </main>
  );
}
