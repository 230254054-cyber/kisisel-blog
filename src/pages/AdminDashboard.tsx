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

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => data && setFormData(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Yükleme hatası:", err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/site-data', {
        method: 'POST', // Backend ile uyumlu
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("✅ Firebase güncellendi!");
      } else {
        const err = await response.json();
        alert("❌ Hata: " + err.error);
      }
    } catch (err) {
      alert("❌ Sunucuya erişilemedi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Admin Paneli</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <input 
          className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white"
          placeholder="Hero Title"
          value={formData.homeHeroTitle}
          onChange={e => setFormData({...formData, homeHeroTitle: e.target.value})}
        />
        <textarea 
          className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white"
          placeholder="Hero Subtitle"
          rows={3}
          value={formData.homeHeroSubtitle}
          onChange={e => setFormData({...formData, homeHeroSubtitle: e.target.value})}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
