import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <div className="flex items-center space-x-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>5 min read</span>
        </div>
      </div>

      <Link to={`/blog/${post._id}`} className="block">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 dark:text-white dark:group-hover:text-zinc-300">
          {post.title}
        </h3>
      </Link>

      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={`/blog/${post._id}`}
        className="inline-flex items-center space-x-1 pt-4 text-sm font-semibold text-zinc-900 dark:text-white"
      >
        <span>Read more</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
