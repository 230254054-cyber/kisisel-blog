import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Postları çek
        const fetchedPosts = await api.get('/posts');
        setPosts(fetchedPosts.slice(0, 3));

        // 2. Site verilerini çek
        // Not: Eğer api.get hata veriyorsa direkt fetch kullanıyoruz (daha garanti)
        const response = await fetch('/api/site-data');
        const data = await response.json();
        
        console.log("Firebase'den gelen ham veri:", data); // F12 Console'da bunu görmelisin
        setSiteData(data);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl"
            >
              {/* Buradaki isimleri Firebase'dekiyle birebir eşledik */}
              {siteData?.homeHeroTitle || 'Building the Future of Web.'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            >
              {siteData?.homeHeroSubtitle || "Hi, I'm a Computer Engineering student."}
            </motion.p>

            <motion.div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/projects" className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                View Projects
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hakkımda Kısa Bilgi (Eğer Dashboard'da doldurduysan) */}
      {siteData?.aboutContent && (
        <section className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{siteData.aboutContent}</p>
        </section>
      )}

      {/* Latest Posts Bölümü */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Latest Posts</h2>
          <Link to="/blog" className="flex items-center space-x-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}