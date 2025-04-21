import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  sessionToken?: string;
  sessionExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isVerified: { type: Boolean, default: false, index: true },
    sessionToken: { type: String, index: true },
    sessionExpiry: { type: Date },
  },
  { timestamps: true }
);

// Use a safe pattern for model initialization that works in all environments
let User: Model<IUser>;

// Check if the model already exists to prevent model overwrite errors
if (mongoose.models && mongoose.models.User) {
  User = mongoose.models.User as Model<IUser>;
} else {
  // Create the model if it doesn't exist
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;
