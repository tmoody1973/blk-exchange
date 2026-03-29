"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { SplashController } from "@/components/splash/splash-controller";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7F77DD",
          colorBackground: "#0e0e0e",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a0a0a0",
          fontFamily: "'Courier New', monospace",
          borderRadius: "0px",
        },
        elements: {
          card: {
            backgroundColor: "#0e0e0e",
            border: "2px solid #ffffff",
            boxShadow: "4px 4px 0px 0px #7F77DD",
          },
          formButtonPrimary: {
            backgroundColor: "#7F77DD",
            border: "2px solid #ffffff",
            boxShadow: "3px 3px 0px 0px #ffffff",
            fontFamily: "'Courier New', monospace",
            fontWeight: "900",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#1a1a1a",
            border: "2px solid #ffffff",
            color: "#ffffff",
            fontFamily: "'Courier New', monospace",
          },
          footerActionLink: {
            color: "#7F77DD",
          },
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuthForConvex}>
        <SplashController>
          {children}
          <PwaInstallPrompt />
        </SplashController>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
