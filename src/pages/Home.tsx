import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { motion } from 'motion/react';
import { ArrowRight, Code, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedPosts, fetchedProfile] = await Promise.all([
          api.get('/posts'),
          api.get('/profile')
        ]);
        setPosts(fetchedPosts.slice(0, 3));
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl"
            >
              {profile?.homeHeroTitle || 'Building the Future of Web.'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            >
              {profile?.homeHeroSubtitle || "Hi, I'm a Computer Engineering student passionate about full-stack development, AI, and clean design."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/projects"
                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View Projects
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
              <Code className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Frontend</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              React, TypeScript, Tailwind CSS, and modern UI/UX principles.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
              <Cpu className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Backend</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Node.js, Express, Firebase, and RESTful API design.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
              <Globe className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">DevOps</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Cloud Run, CI/CD, and serverless architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Latest Posts</h2>
          <Link
            to="/blog"
            className="flex items-center space-x-1 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
            ))
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No posts found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
