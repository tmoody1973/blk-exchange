"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { SplashController } from "@/components/splash/splash-controller";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// useAuth from @clerk/nextjs v5 has a slightly different type shape than what
// convex/react-clerk expects. Both are functionally compatible at runtime —
// this cast bridges the type mismatch between the two libraries.
type ConvexUseAuth = () => {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  getToken: (options: {
    template?: "convex";
    skipCache?: boolean;
  }) => Promise<string | null>;
  orgId: string | undefined | null;
  orgRole: string | undefined | null;
  sessionClaims: Record<string, unknown> | undefined | null;
};

const useAuthForConvex = useAuth as unknown as ConvexUseAuth;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuthForConvex}>
        <SplashController>{children}</SplashController>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
