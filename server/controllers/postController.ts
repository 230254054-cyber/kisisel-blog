import { Request, Response } from 'express';
import Post from '../models/Post.ts';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('author', 'username email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = new Post({
      ...req.body,
      author: (req as any).user.id
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      { ...req.body }, 
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
