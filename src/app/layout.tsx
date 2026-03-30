import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { MSWProvider } from "./msw-provider";

export const metadata: Metadata = {
  title: "Agent Analytics Dashboard",
  description: "Organizational analytics dashboard for cloud AI agent usage",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <MSWProvider>
          <Providers>
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </Providers>
        </MSWProvider>
      </body>
    </html>
  );
}
