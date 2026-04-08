import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [siteData, setSiteData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-data').then(res => res.json()).then(data => setSiteData(data));
    api.get('/posts').then(data => setPosts(data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section - Sadece Başlık ve Alt Başlık */}
      <section className="relative pt-24 pb-12 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl"
          >
            {siteData?.homeHeroTitle || 'Giriş Başlığı'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
          >
            {siteData?.homeHeroSubtitle || 'Giriş Alt Başlığı'}
          </motion.p>
        </div>
      </section>

      {/* BURADAN HAKKIMDA (ABOUT) KISMINI SİLDİK */}

      {/* Son Blog Yazıları */}
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-12">Latest Posts</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {posts.map((post: any, index: number) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}