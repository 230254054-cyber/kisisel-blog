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

  // 1. Verileri Çek (Sayfa yüklendiğinde mevcut hali gör)
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
        console.error("Veri çekilemedi:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Kaydetme İşlemi (Hata buradaydı, düzeltildi)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      // Önce cevabın tipini kontrol et
      const contentType = response.headers.get("content-type");
      
      if (response.ok && contentType && contentType.includes("application/json")) {
        const result = await response.json();
        setMessage("✅ Veriler Firebase'e uçtu!");
      } else {
        const errorText = await response.text(); // JSON değilse hatayı metin olarak oku
        console.error("Sunucu Hatası:", errorText);
        setMessage("❌ Sunucu hatası oluştu. Konsola (F12) bak.");
      }
    } catch (err) {
      console.error("Fetch hatası:", err);
      setMessage("❌ Bağlantı hatası!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-zinc-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Home Hero Title</label>
            <input
              type="text"
              name="homeHeroTitle"
              value={formData.homeHeroTitle}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Home Hero Subtitle</label>
            <input
              type="text"
              name="homeHeroSubtitle"
              value={formData.homeHeroSubtitle}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">About Content</label>
          <textarea
            name="aboutContent"
            value={formData.aboutContent}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Uygula'}
        </button>

        {message && (
          <div className={`p-4 rounded-xl text-center font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
