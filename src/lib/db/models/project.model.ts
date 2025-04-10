import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  userId: string;
  landArea: number;
  landUnit: string;
  budget: number;
  currency: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  floorPlan?: string;
  floorPlanDescription?: string;
  suggestions?: {
    materials: Array<{
      name: string;
      cost: number;
      description: string;
    }>;
    professionals: Array<{
      name: string;
      profession: string;
      contact: string;
      rating: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    landArea: { type: Number, required: true },
    landUnit: { type: String, required: true },
    budget: { type: Number, required: true },
    currency: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    floorPlan: { type: String },
    floorPlanDescription: { type: String },
    suggestions: {
      materials: [
        {
          name: { type: String },
          cost: { type: Number },
          description: { type: String },
        },
      ],
      professionals: [
        {
          name: { type: String },
          profession: { type: String },
          contact: { type: String },
          rating: { type: Number },
        },
      ],
    },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project as Model<IProject> || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
