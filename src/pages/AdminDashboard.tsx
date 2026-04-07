import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    homeHeroTitle: '',
    homeHeroSubtitle: '',
    aboutContent: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sayfa açıldığında mevcut verileri çekiyoruz
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-data');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            homeHeroTitle: data.homeHeroTitle || '',
            homeHeroSubtitle: data.homeHeroSubtitle || '',
            aboutContent: data.aboutContent || '',
            skills: data.skills || '',
            githubUrl: data.githubUrl || '',
            linkedinUrl: data.linkedinUrl || ''
          });
        }
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ÖNEMLİ: URL tam olarak /api/site-data olmalı (Resmindeki profile hatasını bu çözer)
      const response = await fetch('/api/site-data', {
        method: 'POST', // Backend'deki app.post ile uyumlu
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage("✅ Başarıyla Firebase'e kaydedildi!");
      } else {
        const errorData = await response.json();
        setMessage("❌ Hata: " + (errorData.error || "Sunucu hatası"));
      }
    } catch (err) {
      console.error("Fetch Hatası:", err);
      setMessage("❌ Sunucuya ulaşılamadı. İnternetini veya Vercel'i kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-zinc-500">Profile Settings</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Home Hero Title</label>
            <input
              type="text"
              name="homeHeroTitle"
              value={formData.homeHeroTitle}
              onChange={handleChange}
              placeholder="Giriş başlığı..."
              className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Home Hero Subtitle</label>
            <input
              type="text"
              name="homeHeroSubtitle"
              value={formData.homeHeroSubtitle}
              onChange={handleChange}
              placeholder="Alt başlık..."
              className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">About Me Content</label>
          <textarea
            name="aboutContent"
            value={formData.aboutContent}
            onChange={handleChange}
            rows={5}
            placeholder="Hakkımda yazısı..."
            className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Skills (Virgülle ayır)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">GitHub URL</label>
            <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Kaydediliyor...' : 'Save Changes'}
        </button>

        {message && (
          <div className={`p-4 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 ${message.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
