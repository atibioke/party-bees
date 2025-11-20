import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendee extends Document {
  name: string;
  phone: string;
  email?: string;
  eventId: mongoose.Schema.Types.ObjectId; // Reference to Event
  acceptedTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AttendeeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    acceptedTerms: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
AttendeeSchema.index({ eventId: 1, createdAt: -1 });
AttendeeSchema.index({ phone: 1 });

// Prevent recompilation of model in development
const Attendee: Model<IAttendee> = mongoose.models.Attendee || mongoose.model<IAttendee>('Attendee', AttendeeSchema);

export default Attendee;
