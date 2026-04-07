import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await api.get('/posts');
        const published = fetchedPosts
          .filter((p: Post) => p.published)
          .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(published);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            The Blog
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Thoughts on software engineering, design, and student life.
          </p>
        </header>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
            />
          </div>
          <button className="flex items-center space-x-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No posts found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
