import type { Metadata } from "next";
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

const siteUrl = 'https://paperly.app'

export const metadata: Metadata = {
  title: {
    default: 'Paperly — Free Invoice, Receipt & Quote Generator',
    template: '%s | Paperly',
  },
  description: 'Create professional invoices, receipts, and quotes in under 60 seconds. Download as PDF or share a link. No signup required.',
  keywords: ['invoice generator', 'receipt maker', 'quote generator', 'free invoice', 'PDF invoice', 'billing tool'],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Paperly',
    title: 'Paperly — Free Invoice, Receipt & Quote Generator',
    description: 'Create professional invoices, receipts, and quotes in under 60 seconds. No signup required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Paperly — Free Invoice, Receipt & Quote Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paperly — Free Invoice, Receipt & Quote Generator',
    description: 'Create professional invoices, receipts, and quotes in under 60 seconds. No signup required.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
