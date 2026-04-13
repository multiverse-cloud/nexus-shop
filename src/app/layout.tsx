import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NexusShop",
    template: "%s | NexusShop",
  },
  description: "NexusShop is a premium SaaS and ecommerce platform for modern storefronts, subscriptions, and customer management.",
  keywords: ["NexusShop", "ecommerce", "SaaS platform", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "NexusShop Team" }],
  applicationName: "NexusShop",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "NexusShop",
    description: "A premium SaaS and ecommerce experience for selling products, managing subscriptions, and growing online revenue.",
    siteName: "NexusShop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusShop",
    description: "A premium SaaS and ecommerce experience for selling products, managing subscriptions, and growing online revenue.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
