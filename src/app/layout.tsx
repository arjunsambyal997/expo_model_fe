import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Background from "@/components/Background";

export const metadata: Metadata = {
  title: "Expo AI Summit",
  description: "Dubai Expo AI Summit: agenda, speakers and your personal schedule.",
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
