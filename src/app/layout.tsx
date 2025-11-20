import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

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
    default: "Skiboh - Find Events & Parties Across Nigeria | Party Platform",
    template: "%s | Skiboh"
  },
  description: "Discover the best parties, events, and nightlife across Nigeria. Find concerts, club nights, beach parties, and social gatherings in Lagos, Abuja, Port Harcourt, Kano, Ibadan, and all Nigerian cities. RSVP to free events or buy tickets for paid events. The #1 party platform for Nigeria.",
  keywords: [
    "events Nigeria",
    "Nigeria events",
    "parties Nigeria",
    "Nigeria nightlife",
    "events Lagos",
    "events Abuja",
    "events Port Harcourt",
    "events Kano",
    "events Ibadan",
    "events Benin City",
    "events Kaduna",
    "events Enugu",
    "events Calabar",
    "events Uyo",
    "events Owerri",
    "events Warri",
    "events Asaba",
    "events Jos",
    "events Akure",
    "events Abeokuta",
    "Nigeria concerts",
    "nightlife Nigeria",
    "party Nigeria",
    "social events Nigeria",
    "club events Nigeria",
    "beach party Nigeria",
    "music events Nigeria",
    "entertainment Nigeria",
    "find events Nigeria",
    "RSVP events Nigeria",
    "event tickets Nigeria",
    "Nigeria party scene",
    "social gatherings Nigeria",
    "lifestyle events Nigeria",
    "Nigeria party platform",
    "Nigerian events",
    "Naija events",
    "Naija parties"
  ],
  authors: [{ name: "Skiboh" }],
  creator: "Skiboh",
  publisher: "Skiboh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skiboh.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://skiboh.com',
    siteName: 'Skiboh',
    title: 'Skiboh - Find Events & Parties Across Nigeria',
    description: 'Discover the best parties, events, and nightlife across Nigeria. Find concerts, club nights, beach parties, and social gatherings in all Nigerian cities.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Skiboh - Lagos Party Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skiboh - Find Events & Parties Across Nigeria',
    description: 'Discover the best parties, events, and nightlife across Nigeria.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
