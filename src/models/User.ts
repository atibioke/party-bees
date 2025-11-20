import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  businessName: string;
  email: string;
  whatsapp: string;
  password?: string; // Optional because we might exclude it in queries
  role: 'organizer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['organizer', 'admin'], default: 'organizer' },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
