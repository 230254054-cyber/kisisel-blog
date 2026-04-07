import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [siteData, setSiteData] = useState({
    homeHeroTitle: '',
    homeHeroSubtitle: '',
    aboutContent: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: ''
  });

  const [newPost, setNewPost] = useState({ title: '', excerpt: '', content: '', category: 'Tech' });
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', tags: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => data && setSiteData(prev => ({ ...prev, ...data })));
  }, []);

  // Site Verilerini Kaydet
  const saveSiteData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteData)
    });
    setLoading(false);
    alert("Site bilgileri güncellendi!");
  };

  // Yeni Blog Yazısı Ekle
  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPost, date: new Date().toISOString() })
    });
    alert("Blog yazısı eklendi!");
    setNewPost({ title: '', excerpt: '', content: '', category: 'Tech' });
  };

  // Yeni Proje Ekle
  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProject, tags: newProject.tags.split(',') })
    });
    alert("Proje eklendi!");
    setNewProject({ title: '', description: '', link: '', tags: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 pb-20">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Yönetim Paneli</h1>

      {/* 1. GENEL SİTE AYARLARI */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Genel Site Bilgileri</h2>
        <form onSubmit={saveSiteData} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Hero Başlığı" value={siteData.homeHeroTitle} onChange={e => setSiteData({...siteData, homeHeroTitle: e.target.value})} />
            <input className="p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Hero Alt Başlığı" value={siteData.homeHeroSubtitle} onChange={e => setSiteData({...siteData, homeHeroSubtitle: e.target.value})} />
            <input className="p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="GitHub URL" value={siteData.githubUrl} onChange={e => setSiteData({...siteData, githubUrl: e.target.value})} />
            <input className="p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="LinkedIn URL" value={siteData.linkedinUrl} onChange={e => setSiteData({...siteData, linkedinUrl: e.target.value})} />
          </div>
          <textarea className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Hakkımda Yazısı" rows={4} value={siteData.aboutContent} onChange={e => setSiteData({...siteData, aboutContent: e.target.value})} />
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Yetenekler (React, Node, JS...)" value={siteData.skills} onChange={e => setSiteData({...siteData, skills: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">Genel Bilgileri Kaydet</button>
        </form>
      </section>

      {/* 2. YENİ BLOG EKLE */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Yeni Blog Yazısı Ekle</h2>
        <form onSubmit={addPost} className="space-y-4">
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Blog Başlığı" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required />
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Kısa Özet" value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} required />
          <textarea className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="İçerik (Markdown destekli)" rows={6} value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">Blog Yazısını Yayınla</button>
        </form>
      </section>

      {/* 3. YENİ PROJE EKLE */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Yeni Proje Ekle</h2>
        <form onSubmit={addProject} className="space-y-4">
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Proje Adı" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Proje Açıklaması" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Proje Linki" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
          <input className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Etiketler (React, Tailwind...)" value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})} />
          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700">Projeyi Ekle</button>
        </form>
      </section>
    </div>
  );
}
