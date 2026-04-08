import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        setSiteData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white"
      >
        Hakkımda
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-zinc dark:prose-invert lg:prose-xl"
      >
        {/* Dashboard'daki About Content buraya geliyor */}
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
          {siteData?.aboutContent || "Henüz bir içerik girilmemiş."}
        </p>

        {siteData?.skills && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Yetenekler</h2>
            <div className="flex flex-wrap gap-2">
              {siteData.skills.split(',').map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
