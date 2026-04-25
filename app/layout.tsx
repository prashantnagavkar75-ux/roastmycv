import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoastMyCV - Get Your Resume Brutally Roasted by AI",
  description: "Upload your resume and get savage, brutally honest feedback. No cap, we will help you fix that mid resume fr fr.",
  keywords: ["resume", "cv", "roast", "ai", "career", "job", "feedback"],
  openGraph: {
    title: "RoastMyCV - Get Your Resume Brutally Roasted by AI",
    description: "Upload your resume and get savage, brutally honest feedback.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#facc15",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
