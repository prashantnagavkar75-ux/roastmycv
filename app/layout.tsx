import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoastMyCV - Get Your Resume Brutally Roasted by AI",
  description:
    "Upload your resume and get absolutely destroyed by our AI. Red flags exposed. Career crisis unlocked. Fix it before recruiters do.",
  keywords: ["resume", "cv", "roast", "ai", "career", "job", "review"],
  openGraph: {
    title: "RoastMyCV - Your Resume is Mid",
    description: "Get your resume roasted by AI. No mercy mode available.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              border: "2px solid #00ff88",
              color: "#fafafa",
            },
          }}
        />
      </body>
    </html>
  );
}
