import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await dbConnect();
    
    // Try to find by slug first, then by ID
    let event = await Event.findOne({ slug: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    
    if (!event) {
      return {
        title: 'Event Not Found | Skiboh',
        description: 'The event you are looking for could not be found.',
      };
    }
    
    const startDate = new Date(event.startDateTime);
    const formattedDate = startDate.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const location = `${event.address}, ${event.lga}, ${event.state}, Nigeria`;
    const description = `${event.description.substring(0, 155)}... Join us on ${formattedDate} at ${location}. ${event.isPaid ? `Tickets: ${event.price}` : 'Free Entry'}`;
    
    return {
      title: `${event.title} | ${event.lga}, ${event.state} | Skiboh`,
      description: description,
      keywords: [
        event.title,
        `${event.title} ${event.state}`,
        `events ${event.lga}`,
        `${event.lga} events`,
        `parties ${event.lga}`,
        `events ${event.state}`,
        `${event.state} events`,
        `${event.state} ${event.labels.join(' ')}`,
        'Nigeria events',
        `${event.state} nightlife`,
        event.host,
      ],
      openGraph: {
        title: `${event.title} | ${event.lga}, ${event.state}`,
        description: description,
        url: `/events/${event.slug}`,
        siteName: 'Skiboh',
        locale: 'en_NG',
        type: 'website',
        images: event.flyer ? [
          {
            url: event.flyer,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${event.title} | ${event.lga}, ${event.state}`,
        description: description,
        images: event.flyer ? [event.flyer] : [],
      },
      alternates: {
        canonical: `/events/${event.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Event | Skiboh',
      description: 'Find events and parties across Nigeria.',
    };
  }
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

