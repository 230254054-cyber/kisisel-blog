export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string | { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  published: boolean;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
  order: number;
}

export interface Profile {
  _id: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  aboutContent: string;
  skills: string[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}
