import type { Metadata } from "next";
import { Toaster } from "sonner";

import AppProviders from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import localFont from "next/font/local";
import "./globals.css";
import { IS_PRODUCTION } from "@/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prompt App",
  description: "Powerful UI for promptings",
  keywords: [
    "AI",
    "prompting",
    "chat interface",
    "LLM UI",
    "prompt engineering",
  ],
  authors: [
    { name: "Hao Nhat", url: "https://www.facebook.com/haonhatht/" },
    { name: "Dang Khoa", url: "https://www.facebook.com/ng.khoa21" },
  ],
  creator: "Prompt Crafter",
  metadataBase: new URL("https://promptcrafter.studio"),

  // openGraph: {
  //   title: "Prompt Chat - Powerful UI for Promptings",
  //   description: "Explore advanced chat interfaces designed for prompt engineering.",
  //   url: "https://promptcrafter.studio/chat",
  //   siteName: "Prompt Chat",
  //   // images: [
  //   //   {
  //   //     url: "https://yourdomain.com/og-image.png",
  //   //     width: 1200,
  //   //     height: 630,
  //   //     alt: "Prompt Chat Preview",
  //   //   },
  //   // ],
  //   locale: "en_US",
  //   type: "website",
  // },
  //
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Prompt Chat",
  //   description: "Powerful UI for promptings",
  //   images: ["https://yourdomain.com/twitter-card.png"],
  //   creator: "@yourTwitterHandle",
  // },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    // shortcut: "/shortcut-icon.png",
    // apple: "/apple-touch-icon.png",
  },

  themeColor: "#0ea5e9", // Tailwind blue-500 or your brand color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AppProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-center" />
            {children}
            {!IS_PRODUCTION && <ReactQueryDevtools />}
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
