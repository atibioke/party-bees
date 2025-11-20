import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  businessName: string;
  email: string;
  whatsapp: string;
  password?: string; // Optional for OAuth users
  role: 'organizer' | 'admin';
  banned: boolean;
  // OAuth support
  googleId?: string;
  provider: 'local' | 'google';
  name?: string; // Full name from OAuth
  profileCompleted: boolean; // For OAuth users who need to complete profile
  // Terms acceptance
  acceptedTerms: boolean;
  termsAcceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String },
    password: { type: String }, // Not required for OAuth users
    role: { type: String, enum: ['organizer', 'admin'], default: 'organizer' },
    banned: { type: Boolean, default: false },
    // OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    name: { type: String },
    profileCompleted: { type: Boolean, default: true }, // false for OAuth until completed
    // Terms acceptance
    acceptedTerms: { type: Boolean, default: false },
    termsAcceptedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
