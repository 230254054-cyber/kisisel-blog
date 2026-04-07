import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  aboutContent: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

const ProfileSchema: Schema = new Schema({
  homeHeroTitle: { type: String, default: 'Computer Engineering Student' },
  homeHeroSubtitle: { type: String, default: 'Passionate about building modern web applications and solving complex problems.' },
  aboutContent: { type: String, default: 'I am a computer engineering student focused on full-stack development.' },
  skills: [{ type: String }],
  githubUrl: { type: String, default: 'https://github.com' },
  linkedinUrl: { type: String, default: 'https://linkedin.com' }
}, { timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
