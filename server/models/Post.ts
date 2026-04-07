import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
  },
  excerpt: { 
    type: String, 
    maxlength: [500, 'Excerpt cannot exceed 500 characters'] 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  published: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);
