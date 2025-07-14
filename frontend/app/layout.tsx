import type { Metadata } from "next";
import { Toaster } from "sonner";

import AppProviders from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { GOOGLE_ANALYTICS_ID, IS_PRODUCTION } from "@/config";
import { appConfig } from "@/config/app.config";
import { GoogleAnalytics } from "@next/third-parties/google";
import localFont from "next/font/local";
import "./globals.css";

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

// TODO: change metadataBase url to github link
export const metadata: Metadata = {
  metadataBase: new URL(appConfig.seo.url),
  alternates: {
    canonical: "/",
  },

  title: {
    default: appConfig.title,
    template: `%s - ${appConfig.title}`,
  },
  description: appConfig.description,
  keywords: appConfig.keywords,
  authors: { name: appConfig.authors.map(({ name }) => name).join(", ") },
  creator: appConfig.creator,

  openGraph: {
    locale: "en_US",
    type: "website",
    title: appConfig.title,
    description: appConfig.description,
    url: "https://promptcrafter.studio/",
    siteName: appConfig.name,
    images: `${appConfig.seo.url}/logo.png`,
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Prompt Chat Preview",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: appConfig.title,
    description: appConfig.description,
    images: `${appConfig.seo.url}/logo.png`,
    // images: ["https://yourdomain.com/twitter-card.png"],
    creator: `@${appConfig.name.replace(" ", "")}`,
  },

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
    icon: "/icon.ico",
    // shortcut: "/shortcut-icon.png",
    // apple: "/apple-touch-icon.png",
  },
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
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
