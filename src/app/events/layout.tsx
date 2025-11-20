import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events Across Nigeria | Find Parties & Nightlife | Skiboh',
  description: 'Browse all events, parties, and nightlife across Nigeria. Filter by state, city, date, and category. Find concerts, club nights, beach parties, and social gatherings in Lagos, Abuja, Port Harcourt, Kano, Ibadan, and all Nigerian cities.',
  keywords: [
    'events Nigeria',
    'Nigeria events',
    'parties Nigeria',
    'Nigeria nightlife',
    'events Lagos',
    'events Abuja',
    'events Port Harcourt',
    'events Kano',
    'events Ibadan',
    'events Benin City',
    'events Kaduna',
    'events Enugu',
    'events Calabar',
    'events Uyo',
    'events Owerri',
    'events Warri',
    'events Asaba',
    'events Jos',
    'events Akure',
    'events Abeokuta',
    'Nigeria concerts',
    'nightlife Nigeria',
    'party Nigeria',
    'social events Nigeria',
    'club events Nigeria',
    'beach party Nigeria',
    'music events Nigeria',
    'entertainment Nigeria',
    'find events Nigeria',
    'RSVP events Nigeria',
    'event tickets Nigeria',
    'Nigeria party scene',
    'social gatherings Nigeria',
    'lifestyle events Nigeria',
    'Nigeria party platform',
    'Nigerian events',
    'Naija events',
    'Naija parties',
    'events today Nigeria',
    'upcoming events Nigeria',
    'weekend events Nigeria'
  ],
  openGraph: {
    title: 'Events Across Nigeria | Find Parties & Nightlife | Skiboh',
    description: 'Browse all events, parties, and nightlife across Nigeria. Filter by state, city, date, and category.',
    url: '/events',
    siteName: 'Skiboh',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events Across Nigeria | Find Parties & Nightlife | Skiboh',
    description: 'Browse all events, parties, and nightlife across Nigeria.',
  },
  alternates: {
    canonical: '/events',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

