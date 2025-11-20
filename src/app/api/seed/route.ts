import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import bcrypt from 'bcryptjs';

// Lagos LGAs for realistic event locations
const LAGOS_LGAS = [
  'Ikeja',
  'Lagos Island',
  'Surulere Lagos State',
  'Eti Osa',
  'Ikorodu',
  'Kosofe',
  'Alimosho',
  'Mushin',
  'Oshodi-Isolo',
  'Agege',
  'Amuwo-Odofin',
  'Ibeju-Lekki',
  'Lagos Mainland',
  'Ifako-Ijaiye',
  'Ajeromi-Ifelodun',
  'Shomolu',
  'Ojo',
  'Apapa',
  'Badagry',
  'Epe'
];

// Realistic Lagos addresses by LGA
const ADDRESSES_BY_LGA: Record<string, string[]> = {
  'Ikeja': [
    'Allen Avenue, Ikeja',
    'Opebi Road, Ikeja',
    'Adeniyi Jones Avenue, Ikeja',
    'Oba Akran Avenue, Ikeja',
    'Awolowo Way, Ikeja'
  ],
  'Lagos Island': [
    'Victoria Island, Lagos',
    'Ikoyi, Lagos',
    'Tafawa Balewa Square, Lagos Island',
    'Broad Street, Lagos Island',
    'Marina, Lagos Island'
  ],
  'Surulere Lagos State': [
    'Adeniran Ogunsanya Street, Surulere',
    'Bode Thomas Street, Surulere',
    'Ogunlana Drive, Surulere',
    'Itire Road, Surulere',
    'Coker Road, Surulere'
  ],
  'Eti Osa': [
    'Lekki Phase 1, Lagos',
    'Lekki Phase 2, Lagos',
    'Admiralty Way, Lekki',
    'Ajah, Lagos',
    'Chevron Drive, Lekki'
  ],
  'Ikorodu': [
    'Ikorodu Road, Ikorodu',
    'Sagamu Road, Ikorodu',
    'Ita-Elewa, Ikorodu',
    'Ebute, Ikorodu'
  ],
  'Kosofe': [
    'Ketu, Lagos',
    'Ojota, Lagos',
    'Mile 12, Lagos',
    'Alapere, Lagos'
  ],
  'Alimosho': [
    'Egbeda, Lagos',
    'Ikotun, Lagos',
    'Igando, Lagos',
    'Iyana Ipaja, Lagos'
  ],
  'Mushin': [
    'Ladipo Market, Mushin',
    'Palm Avenue, Mushin',
    'Ogunlana Drive, Mushin'
  ],
  'Oshodi-Isolo': [
    'Oshodi, Lagos',
    'Isolo, Lagos',
    'Ajao Estate, Lagos'
  ],
  'Agege': [
    'Agege Motor Road, Agege',
    'Ojokoro, Lagos',
    'Iju, Lagos'
  ],
  'Amuwo-Odofin': [
    'Festac Town, Lagos',
    'Amuwo Odofin, Lagos',
    'Satellite Town, Lagos'
  ],
  'Ibeju-Lekki': [
    'Lekki Free Trade Zone',
    'Epe Expressway, Ibeju-Lekki',
    'Ajah, Ibeju-Lekki'
  ],
  'Lagos Mainland': [
    'Yaba, Lagos',
    'Ebute Metta, Lagos',
    'Iddo, Lagos'
  ],
  'Ifako-Ijaiye': [
    'Ifako, Lagos',
    'Ijaiye, Lagos',
    'Ojokoro, Lagos'
  ],
  'Ajeromi-Ifelodun': [
    'Ajegunle, Lagos',
    'Tolu, Lagos',
    'Olodi-Apapa, Lagos'
  ],
  'Shomolu': [
    'Bariga, Lagos',
    'Shomolu, Lagos',
    'Gbagada, Lagos'
  ],
  'Ojo': [
    'Ojo, Lagos',
    'Alaba International Market, Ojo',
    'Iba, Lagos'
  ],
  'Apapa': [
    'Apapa, Lagos',
    'Tin Can Island, Apapa',
    'Wharf Road, Apapa'
  ],
  'Badagry': [
    'Badagry, Lagos',
    'Seme Border, Badagry'
  ],
  'Epe': [
    'Epe, Lagos',
    'Lekki-Epe Expressway, Epe'
  ]
};

// Nigerian event organizers
const ORGANIZERS = [
  {
    businessName: 'Naija Vibes Events',
    email: 'info@naijavibes.com',
    whatsapp: '+2348012345678',
    password: 'password123'
  },
  {
    businessName: 'Lagos Nightlife Promotions',
    email: 'contact@lagosnightlife.com',
    whatsapp: '+2348023456789',
    password: 'password123'
  },
  {
    businessName: 'AfroBeats Experience',
    email: 'hello@afrobeatsxp.com',
    whatsapp: '+2348034567890',
    password: 'password123'
  },
  {
    businessName: 'Island Entertainment Group',
    email: 'events@islandent.com',
    whatsapp: '+2348045678901',
    password: 'password123'
  },
  {
    businessName: 'Surulere Events Hub',
    email: 'info@surulereevents.com',
    whatsapp: '+2348056789012',
    password: 'password123'
  },
  {
    businessName: 'Lekki Party Planners',
    email: 'contact@lekkiparties.com',
    whatsapp: '+2348067890123',
    password: 'password123'
  },
  {
    businessName: 'Ikeja Social Club',
    email: 'hello@ikejasocial.com',
    whatsapp: '+2348078901234',
    password: 'password123'
  },
  {
    businessName: 'Mega City Events',
    email: 'info@megacityevents.com',
    whatsapp: '+2348089012345',
    password: 'password123'
  }
];

// Lagos-centric events with realistic descriptions
const EVENT_TEMPLATES = [
  {
    title: 'AfroBeats Night: Burna Boy Tribute',
    description: 'Join us for an electrifying night of AfroBeats music as we celebrate the sounds of Burna Boy, Wizkid, Davido, and more. Experience the best of Nigerian music with live DJ sets, amazing vibes, and an unforgettable atmosphere. Dress to impress and come ready to dance the night away!',
    isPaid: false,
    price: undefined,
    labels: ['Live Music 🎵', 'Free Drinks 🍹'],
    imageSearch: 'afrobeats concert nigeria'
  },
  {
    title: 'Ladies Night at The Rooftop',
    description: 'Ladies, this one is for you! Enjoy free drinks, amazing music, and a vibrant atmosphere at our exclusive ladies night. DJ spinning the latest AfroBeats, Amapiano, and Afropop hits. Free entry for ladies before 11 PM. Come with your squad and let\'s turn up!',
    isPaid: false,
    price: undefined,
    labels: ['Ladies Night 💃', 'Free Drinks 🍹'],
    imageSearch: 'rooftop party nigeria lagos'
  },
  {
    title: 'Pool Party: Summer Vibes Lagos',
    description: 'Dive into summer with our epic pool party! Cool off in the pool while enjoying the hottest AfroBeats and Amapiano tracks. Shisha available, great food, and an amazing crowd. Bring your swimwear and get ready for the ultimate summer experience in Lagos!',
    isPaid: true,
    price: '₦5,000',
    paymentDetails: 'Pay at the gate or via bank transfer to 0123456789',
    labels: ['Pool Party 🏊', 'Shisha Available 💨'],
    imageSearch: 'pool party lagos nigeria'
  },
  {
    title: 'Amapiano Night: South African Vibes',
    description: 'Experience the hottest Amapiano sounds straight from South Africa! Our resident DJ will be spinning the latest tracks that have taken Lagos by storm. Expect an energetic crowd, great drinks, and non-stop dancing. This is where the real party is at!',
    isPaid: false,
    price: undefined,
    labels: ['Live Music 🎵'],
    imageSearch: 'amapiano party nigeria'
  },
  {
    title: 'AfroHouse Experience: Deep & Soulful',
    description: 'For the lovers of deep, soulful AfroHouse music. Join us for an intimate night of quality music, great conversations, and premium vibes. Our carefully curated playlist will take you on a musical journey. Strictly 21+ only.',
    isPaid: true,
    price: '₦3,500',
    paymentDetails: 'Early bird tickets available online',
    labels: ['21+ Only 🔞', 'Live Music 🎵'],
    imageSearch: 'afrohouse music event'
  },
  {
    title: 'Sunday Brunch & Live Band',
    description: 'Start your Sunday right with our exclusive brunch experience featuring a live band playing classic Nigerian highlife, jazz, and contemporary AfroBeats. Enjoy delicious local and continental dishes, bottomless mimosas, and great company. Perfect for families and friends!',
    isPaid: true,
    price: '₦8,500',
    paymentDetails: 'Reservations recommended',
    labels: ['Live Music 🎵'],
    imageSearch: 'sunday brunch lagos restaurant'
  },
  {
    title: 'Halloween Costume Party: Lagos Edition',
    description: 'Get ready for the spookiest night in Lagos! Dress up in your best costume and join us for a night of thrills, chills, and amazing music. Best costume wins a prize! DJ spinning Halloween-themed AfroBeats remixes. Costume required for entry.',
    isPaid: true,
    price: '₦4,000',
    paymentDetails: 'Costume required for entry',
    labels: ['Costume Required 🎭', 'Live Music 🎵'],
    imageSearch: 'halloween party nigeria costume'
  },
  {
    title: 'Old School Naija Night',
    description: 'Take a trip down memory lane with classic Nigerian hits from the 90s and 2000s. Relive the golden era of Nigerian music with tracks from Fela, 2Face, D\'banj, P-Square, and more. Come dressed in your best retro outfit and let\'s celebrate the legends!',
    isPaid: false,
    price: undefined,
    labels: ['Live Music 🎵'],
    imageSearch: 'old school nigerian music party'
  },
  {
    title: 'Karaoke Night: Sing Your Heart Out',
    description: 'Show off your singing skills at our weekly karaoke night! Sing your favorite AfroBeats, Afropop, and international hits. Prizes for the best performances. Great food, drinks, and an encouraging crowd. No experience needed, just come and have fun!',
    isPaid: false,
    price: undefined,
    labels: ['Live Music 🎵'],
    imageSearch: 'karaoke night lagos'
  },
  {
    title: 'Comedy Night: Stand Up Lagos',
    description: 'Laugh your heart out with Lagos\' funniest comedians! Featuring top Nigerian comedians delivering side-splitting jokes about life in Lagos and Nigeria. Great food, drinks, and an evening full of laughter. Book your table early!',
    isPaid: true,
    price: '₦6,000',
    paymentDetails: 'VIP tables available',
    labels: [],
    imageSearch: 'comedy show lagos nigeria'
  },
  {
    title: 'Wine & Dine: Fine Dining Experience',
    description: 'Indulge in an exquisite fine dining experience featuring a curated selection of wines and gourmet Nigerian and continental dishes. Live acoustic music sets the perfect ambiance. Perfect for date nights, business dinners, or celebrating special occasions.',
    isPaid: true,
    price: '₦15,000',
    paymentDetails: 'Reservations required 24 hours in advance',
    labels: ['Live Music 🎵'],
    imageSearch: 'fine dining restaurant lagos'
  },
  {
    title: 'Street Food Festival: Taste of Lagos',
    description: 'Experience the best of Lagos street food in one place! From suya to jollof rice, puff puff to akara, and everything in between. Live music, great vibes, and authentic Nigerian flavors. Bring your appetite and discover why Lagos is the food capital of Nigeria!',
    isPaid: false,
    price: undefined,
    labels: [],
    imageSearch: 'street food festival lagos nigeria'
  },
  {
    title: 'Art Exhibition & Live Music',
    description: 'Celebrate Nigerian art and culture at our exclusive exhibition featuring works from emerging Lagos artists. Enjoy live acoustic performances, networking opportunities, and refreshments. Support local artists while enjoying great music and conversations.',
    isPaid: false,
    price: undefined,
    labels: ['Live Music 🎵'],
    imageSearch: 'art exhibition lagos nigeria'
  },
  {
    title: 'Beach Party: Tarkwa Bay Vibes',
    description: 'Escape the city and join us for an epic beach party at one of Lagos\' most beautiful beaches! Music, dancing, beach games, and amazing food. Transportation available. Come ready to party by the ocean!',
    isPaid: true,
    price: '₦7,000',
    paymentDetails: 'Includes transportation from pickup point',
    labels: ['Pool Party 🏊'],
    imageSearch: 'beach party lagos nigeria'
  },
  {
    title: 'Fashion Show: Lagos Fashion Week',
    description: 'Experience the latest in Nigerian fashion at our exclusive runway show featuring designs from top Lagos designers. Live music, cocktails, and networking opportunities. See what\'s next in African fashion!',
    isPaid: true,
    price: '₦10,000',
    paymentDetails: 'VIP front row seats available',
    labels: [],
    imageSearch: 'fashion show lagos nigeria'
  },
  {
    title: 'Game Night: FIFA & Pool Tournament',
    description: 'Calling all gamers and sports enthusiasts! Join us for a night of competitive gaming with FIFA tournaments, pool competitions, and board games. Prizes for winners, great food, and drinks. Whether you\'re a pro or just want to have fun, everyone is welcome!',
    isPaid: false,
    price: undefined,
    labels: [],
    imageSearch: 'game night lagos sports bar'
  }
];

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate unique slug (adds number if duplicate)
async function generateUniqueSlug(title: string, existingSlugs: Set<string>): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // Check both in-memory set and database
  while (existingSlugs.has(slug) || await Event.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}

// Generate working image URL
// Using Picsum Photos with seed for reliable, consistent images
// This ensures images load properly and are consistent for the same event type
function getUnsplashImage(searchTerm: string, width: number = 800, height: number = 600): string {
  // Create a seed from the search term for consistent images
  let seed = 0;
  for (let i = 0; i < searchTerm.length; i++) {
    seed = ((seed << 5) - seed) + searchTerm.charCodeAt(i);
    seed = seed & seed; // Convert to 32-bit integer
  }
  seed = Math.abs(seed);
  
  // Use Picsum Photos with seed for consistent, working images
  // This service is reliable and always returns valid images
  // Format: https://picsum.photos/seed/{seed}/{width}/{height}
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

// Generate random future date
function getRandomFutureDate(daysFromNow: number = 7, maxDays: number = 60): Date {
  const days = Math.floor(Math.random() * maxDays) + daysFromNow;
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(Math.floor(Math.random() * 12) + 18, Math.floor(Math.random() * 60), 0, 0);
  return date;
}

// Generate end date (3-6 hours after start)
function getEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 4) + 3);
  return endDate;
}

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('Starting seed...');

    // Create users
    const users = [];
    for (const organizer of ORGANIZERS) {
      const hashedPassword = await bcrypt.hash(organizer.password, 10);
      const user = await User.create({
        businessName: organizer.businessName,
        email: organizer.email,
        whatsapp: organizer.whatsapp,
        password: hashedPassword,
        role: 'organizer'
      });
      users.push(user);
      console.log(`Created user: ${organizer.businessName}`);
    }

    // Create events
    const events = [];
    const existingSlugs = new Set<string>();
    
    for (let i = 0; i < EVENT_TEMPLATES.length; i++) {
      const template = EVENT_TEMPLATES[i];
      const user = users[i % users.length]; // Distribute events among users
      
      // Select random LGA and address
      const lga = LAGOS_LGAS[Math.floor(Math.random() * LAGOS_LGAS.length)];
      const addresses = ADDRESSES_BY_LGA[lga] || [lga];
      const address = addresses[Math.floor(Math.random() * addresses.length)];

      const startDateTime = getRandomFutureDate();
      const endDateTime = getEndDate(startDateTime);
      const slug = await generateUniqueSlug(template.title, existingSlugs);

      try {
        const event = await Event.create({
          title: template.title,
          slug,
          description: template.description,
          startDateTime,
          endDateTime,
          state: 'Lagos',
          lga,
          address,
          host: user.businessName,
          hostId: user._id,
          organizerPhone: user.whatsapp,
          organizerEmail: user.email,
          flyer: getUnsplashImage(template.imageSearch),
          isPaid: template.isPaid,
          price: template.price,
          paymentDetails: template.paymentDetails,
          labels: template.labels
        });

        events.push(event);
        // Verify slug was saved by querying the database
        const verifyEvent = await Event.findById(event._id);
        if (!verifyEvent?.slug) {
          console.error(`ERROR: Event ${template.title} was created but slug is missing! Expected: ${slug}`);
          // Try to update with slug
          await Event.findByIdAndUpdate(event._id, { slug }, { runValidators: false });
        } else {
          console.log(`✓ Created event: ${template.title} (${verifyEvent.slug}) in ${lga}`);
        }
      } catch (error) {
        console.error(`Failed to create event: ${template.title}`, error);
        throw error;
      }
    }

    // Create additional events with more variety
    const additionalEvents = 10;
    for (let i = 0; i < additionalEvents; i++) {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      const lga = LAGOS_LGAS[Math.floor(Math.random() * LAGOS_LGAS.length)];
      const addresses = ADDRESSES_BY_LGA[lga] || [lga];
      const address = addresses[Math.floor(Math.random() * addresses.length)];

      const startDateTime = getRandomFutureDate();
      const endDateTime = getEndDate(startDateTime);
      const slug = await generateUniqueSlug(template.title, existingSlugs);

      try {
        const event = await Event.create({
          title: template.title,
          slug,
          description: template.description,
          startDateTime,
          endDateTime,
          state: 'Lagos',
          lga,
          address,
          host: user.businessName,
          hostId: user._id,
          organizerPhone: user.whatsapp,
          organizerEmail: user.email,
          flyer: getUnsplashImage(template.imageSearch),
          isPaid: template.isPaid,
          price: template.price,
          paymentDetails: template.paymentDetails,
          labels: template.labels
        });
        
        // Verify slug was saved
        if (!event.slug) {
          console.error(`WARNING: Additional event ${template.title} was created without slug!`);
        }
      } catch (error) {
        console.error(`Failed to create additional event: ${template.title}`, error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        usersCreated: users.length,
        eventsCreated: events.length + additionalEvents
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: errorMessage
    }, { status: 500 });
  }
}

