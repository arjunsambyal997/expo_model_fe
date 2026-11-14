import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Background from "@/components/Background";

export const metadata: Metadata = {
  title: "Idea Board",
  description: "Share ideas, explain them and vote on what we build next.",
};
export const viewport: Viewport = { themeColor: "#070b1a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Background />
        <AuthProvider>
          <div className="relative z-10">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
