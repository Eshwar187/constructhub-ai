import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminActivity extends Document {
  adminId: string;
  adminEmail: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AdminActivitySchema = new Schema<IAdminActivity>(
  {
    adminId: { type: String, required: true, index: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

const AdminActivity = mongoose.models.AdminActivity || 
  mongoose.model<IAdminActivity>('AdminActivity', AdminActivitySchema);

export default AdminActivity;
