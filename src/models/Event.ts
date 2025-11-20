import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  startDateTime: Date;
  endDateTime: Date;
  state: string;
  lga: string;
  address: string;
  host: string;
  hostId: mongoose.Schema.Types.ObjectId; // Reference to User
  organizerPhone: string;
  organizerEmail: string;
  flyer: string; // Legacy - kept for backward compatibility
  media: {
    url: string;
    type: 'image' | 'video';
    order: number;
  }[];
  description: string;
  isPaid: boolean;
  price?: string;
  paymentDetails?: string;
  labels: string[];
  category: string;
  isRecurring: boolean;
  recurringPattern?: string; // e.g., "weekly", "monthly", "daily"
  recurrenceInterval?: number; // e.g., every 2 weeks (default: 1)
  recurrenceEndType?: 'never' | 'after' | 'on'; // How recurrence ends
  recurrenceEndDate?: Date; // When the recurring series ends (if endType is 'on')
  recurrenceCount?: number; // Number of occurrences (if endType is 'after')
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    host: { type: String, required: true },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerPhone: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    flyer: { type: String }, // Legacy - kept for backward compatibility
    media: {
      type: [
        {
          url: { type: String, required: true },
          type: { type: String, enum: ['image', 'video'], required: true },
          order: { type: Number, required: true },
        },
      ],
      default: [],
      validate: {
        validator: function (v: Array<{ url: string; type: string; order: number }>) {
          const images = v.filter((m) => m.type === 'image');
          const videos = v.filter((m) => m.type === 'video');
          return images.length <= 5 && videos.length <= 1;
        },
        message: 'Maximum 5 images and 1 video allowed',
      },
    },
    description: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    price: { type: String },
    paymentDetails: { type: String },
    labels: { type: [String], default: [] },
    category: { 
      type: String, 
      enum: ['Nightlife', 'Music', 'Luxury', 'Food & Drink', 'Networking', 'Arts & Culture', 'Sports', 'Other'],
      required: true,
      default: 'Other'
    },
    isRecurring: { type: Boolean, default: false },
    recurringPattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'weekly' },
    recurrenceInterval: { type: Number, default: 1 }, // Every X days/weeks/months/years
    recurrenceEndType: { type: String, enum: ['never', 'after', 'on'], default: 'never' },
    recurrenceEndDate: { type: Date }, // End date (if endType is 'on')
    recurrenceCount: { type: Number }, // Number of occurrences (if endType is 'after')
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model in development
// Delete existing model if it exists to ensure schema updates are applied
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);

export default Event;
