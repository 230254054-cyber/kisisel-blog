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

  // 1. Mevcut verileri Firebase'den çek
  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData({
            homeHeroTitle: data.homeHeroTitle || '',
            homeHeroSubtitle: data.homeHeroSubtitle || '',
            aboutContent: data.aboutContent || '',
            skills: data.skills || '',
            githubUrl: data.githubUrl || '',
            linkedinUrl: data.linkedinUrl || ''
          });
        }
      })
      .catch(err => console.error("Veri çekme hatası:", err));
  }, []);

  // 2. Input değişimlerini yakala
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Kaydetme Fonksiyonu (KRİTİK NOKTA)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Başarıyla kaydedildi!");
      } else {
        setMessage("❌ Hata: " + result.error);
      }
    } catch (err) {
      setMessage("❌ Sunucuya bağlanılamadı!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">Home Hero Title</label>
          <input
            type="text"
            name="homeHeroTitle"
            value={formData.homeHeroTitle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
            placeholder="Örn: Building the Future of Web"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Home Hero Subtitle</label>
          <textarea
            name="homeHeroSubtitle"
            value={formData.homeHeroSubtitle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">About Me Content</label>
          <textarea
            name="aboutContent"
            value={formData.aboutContent}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input type="text" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white p-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          {loading ? 'Kaydediliyor...' : 'Save Changes'}
        </button>

        {message && <p className="text-center font-medium mt-4">{message}</p>}
      </form>
    </div>
  );
}
