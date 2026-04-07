import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, LayoutDashboard, FileText, Briefcase, Settings, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { Post } from '../types';
import { useNavigate } from 'react-router-dom';

type Tab = 'blogs' | 'projects' | 'profile';

interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
}

interface Profile {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  aboutContent: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('blogs');
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>({
    homeHeroTitle: '',
    homeHeroSubtitle: '',
    aboutContent: '',
    skills: [],
    githubUrl: '',
    linkedinUrl: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsData, projectsData, profileData] = await Promise.all([
        api.get('/posts'),
        api.get('/projects'),
        api.get('/profile')
      ]);
      setPosts(postsData);
      setProjects(projectsData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Blog Handlers
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      if (currentPost._id) {
        await api.put(`/posts/${currentPost._id}`, currentPost, token);
      } else {
        await api.post('/posts', { ...currentPost, published: true }, token);
      }
      setIsEditing(false);
      setCurrentPost({});
      fetchData();
      setNotification({ message: 'Post saved successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error saving post:', error);
      setNotification({ message: error.message || 'Error saving post', type: 'error' });
    }
  };

  const handleDeletePost = async (id: string) => {
    const token = localStorage.getItem('token') || '';
    try {
      await api.delete(`/posts/${id}`, token);
      fetchData();
      setNotification({ message: 'Post deleted successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setNotification({ message: error.message || 'Error deleting post', type: 'error' });
    }
  };

  // Project Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      if (currentProject._id) {
        await api.put(`/projects/${currentProject._id}`, currentProject, token);
      } else {
        await api.post('/projects', currentProject, token);
      }
      setIsEditing(false);
      setCurrentProject({});
      fetchData();
      setNotification({ message: 'Project saved successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error saving project:', error);
      setNotification({ message: error.message || 'Error saving project', type: 'error' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    const token = localStorage.getItem('token') || '';
    try {
      await api.delete(`/projects/${id}`, token);
      fetchData();
      setNotification({ message: 'Project deleted successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      setNotification({ message: error.message || 'Error deleting project', type: 'error' });
    }
  };

  // Profile Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      await api.put('/profile', profile, token);
      setNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setNotification({ message: error.message || 'Error saving profile', type: 'error' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setNotification({ message: 'New passwords do not match!', type: 'error' });
      return;
    }
    const token = localStorage.getItem('token') || '';
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, token);
      setNotification({ message: 'Password changed successfully!', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setNotification({ message: error.message || 'Error changing password', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="h-8 w-8 text-zinc-900 dark:text-white" />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
        </div>
        <div className="flex space-x-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'blogs' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Blogs</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'projects' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 rounded-xl px-6 py-3 text-white shadow-lg ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => { setIsEditing(true); setCurrentPost({}); }}
              className="flex items-center space-x-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{post.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => { setIsEditing(true); setCurrentPost(post); }} className="mr-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeletePost(post._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => { setIsEditing(true); setCurrentProject({}); }}
              className="flex items-center space-x-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{project.description}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => { setIsEditing(true); setCurrentProject(project); }} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteProject(project._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveProfile} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Home Hero Title</label>
                <input
                  type="text"
                  value={profile.homeHeroTitle}
                  onChange={(e) => setProfile({ ...profile, homeHeroTitle: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Home Hero Subtitle</label>
                <input
                  type="text"
                  value={profile.homeHeroSubtitle}
                  onChange={(e) => setProfile({ ...profile, homeHeroSubtitle: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">About Me Content</label>
                <textarea
                  rows={6}
                  value={profile.aboutContent}
                  onChange={(e) => setProfile({ ...profile, aboutContent: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GitHub URL</label>
                <input
                  type="text"
                  value={profile.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn URL</label>
                <input
                  type="text"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          <form onSubmit={handleChangePassword} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Change Password</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Settings className="h-4 w-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modals */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {activeTab === 'blogs' ? (currentPost._id ? 'Edit Post' : 'New Post') : (currentProject._id ? 'Edit Project' : 'New Project')}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={activeTab === 'blogs' ? handleSavePost : handleSaveProject} className="p-6">
                {activeTab === 'blogs' ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={currentPost.title || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      required
                    />
                    <textarea
                      placeholder="Content (Markdown supported)"
                      rows={10}
                      value={currentPost.content || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tags (Comma separated)"
                      value={currentPost.tags?.join(', ') || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={currentProject.title || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      rows={4}
                      value={currentProject.description || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={currentProject.image || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Live Link"
                        value={currentProject.link || ''}
                        onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      />
                      <input
                        type="text"
                        placeholder="GitHub Link"
                        value={currentProject.github || ''}
                        onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full px-6 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-zinc-900 px-8 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
