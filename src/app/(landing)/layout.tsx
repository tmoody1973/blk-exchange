import { MarketingNav } from "@/components/layout/marketing-nav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white" style={{ fontFamily: "Courier New, monospace" }}>
      <MarketingNav />
      <main>{children}</main>
      <footer className="border-t-2 border-white bg-[#0e0e0e] px-4 py-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-lg tracking-widest">BLK EXCHANGE</span>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="https://buymeacoffee.com/tarikmoody"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FDE047] hover:text-white transition-colors font-bold"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              Support This Project
            </a>
            <a href="/privacy" className="text-xs text-[#a0a0a0] hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-[#a0a0a0] hover:text-white transition-colors">
              Terms of Service
            </a>
            <span className="text-sm text-[#a0a0a0]">
              &copy; {new Date().getFullYear()} BLK Exchange. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
