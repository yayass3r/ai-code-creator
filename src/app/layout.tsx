import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Code Creator - منشئ التطبيقات بالذكاء الصناعي",
  description: "منصة متكاملة لإنشاء تطبيقات Full-Stack بضغطة زر واحدة باستخدام الذكاء الصناعي. Next.js, React, TypeScript, Tailwind CSS.",
  keywords: ["AI", "Code Generator", "Next.js", "React", "TypeScript", "Full-Stack", "Z.ai", "Northflank"],
  authors: [{ name: "AI Code Creator Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AI Code Creator",
    description: "Create Full-Stack applications with AI in seconds",
    url: "https://aicodecer.online",
    siteName: "AI Code Creator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Code Creator",
    description: "Create Full-Stack applications with AI in seconds",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
