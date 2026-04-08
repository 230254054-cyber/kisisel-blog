import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [siteData, setSiteData] = useState<any>(null);

  useEffect(() => {
    // Verileri çek
    fetch('/api/site-data').then(res => res.json()).then(data => setSiteData(data));
    api.get('/posts').then(data => setPosts(data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section - Sadece Başlıklar */}
      <section className="pt-24 text-center">
        <motion.h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-7xl">
          {siteData?.homeHeroTitle || 'Hoş Geldiniz'}
        </motion.h1>
        <motion.p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          {siteData?.homeHeroSubtitle || 'Ben bir geliştiriciyim.'}
        </motion.p>
      </section>

      {/* Son Yazılar */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Son Yazılar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
