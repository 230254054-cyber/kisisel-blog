import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Post } from '../types';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const fetchedPost = await api.get(`/posts/${id}`);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="h-8 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Post not found</h2>
        <Link to="/blog" className="mt-4 inline-block text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to blog</span>
        </Link>

        <header className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Student Dev</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Computer Engineering Student</p>
              </div>
            </div>
            <button className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </motion.div>
    </article>
  );
}
