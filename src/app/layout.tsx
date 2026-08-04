import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Layout/Navbar";
import { TranscriptProvider } from "@/hooks/useTranscripts";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Customer Health Dashboard`,
  description: APP_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TranscriptProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </TranscriptProvider>
      </body>
    </html>
  );
}
