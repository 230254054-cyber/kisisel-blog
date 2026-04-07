import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

// Senin Dashboard'daki isimlerinle birebir aynı yaptık
interface SiteData {
  homeHeroTitle?: string;
  homeHeroSubtitle?: string;
  aboutContent?: string;
  skills?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Backend'den verileri çekiyoruz
        const [fetchedPosts, fetchedData] = await Promise.all([
          api.get('/posts'),
          api.get('/site-data') 
        ]);
        
        setPosts(fetchedPosts.slice(0, 3));
        setSiteData(fetchedData);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
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
              {/* Burayı güncelledik: homeHeroTitle */}
              {siteData?.homeHeroTitle || 'Building the Future of Web.'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            >
              {/* Burayı güncelledik: homeHeroSubtitle */}
              {siteData?.homeHeroSubtitle || "Hi, I'm a Computer Engineering student passionate about full-stack development."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/projects"
                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                View Projects
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section - Eğer skills verisini de burada listelemek istersen kullanabiliriz */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         {/* ... Mevcut Skills Tasarımın ... */}
         <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <Code className="h-6 w-6" />
                <h3 className="text-lg font-bold">Skills</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {siteData?.skills || "React, Node.js, Firebase"}
                </p>
            </div>
            {/* Diğer statik kutuların burada durabilir */}
         </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Latest Posts</h2>
          <Link to="/blog" className="flex items-center space-x-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center">Loading...</div>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500">No posts found.</div>
          )}
        </div>
      </section>
    </div>
  );
}