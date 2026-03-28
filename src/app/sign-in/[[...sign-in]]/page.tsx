import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e]">
      <SignIn fallbackRedirectUrl="/market" />
    </div>
  );
}
