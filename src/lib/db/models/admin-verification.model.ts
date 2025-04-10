import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminVerification extends Document {
  userId: string;
  email: string;
  verificationToken: string;
  isApproved: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminVerificationSchema = new Schema<IAdminVerification>(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    verificationToken: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const AdminVerification = mongoose.models.AdminVerification || 
  mongoose.model<IAdminVerification>('AdminVerification', AdminVerificationSchema);

export default AdminVerification;
