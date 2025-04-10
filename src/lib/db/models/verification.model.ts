import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Verification = mongoose.models.Verification || 
  mongoose.model<IVerification>('Verification', VerificationSchema);

export default Verification;
