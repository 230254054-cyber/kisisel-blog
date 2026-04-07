import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
  order: number;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  github: { type: String },
  tags: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
