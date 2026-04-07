import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin } from 'lucide-react';
import { api } from '../lib/api';

interface Profile {
  aboutContent: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get('/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            About Me
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-lg text-zinc-600 dark:text-zinc-400">
          <p>
            {profile?.aboutContent || 'I am a computer engineering student focused on full-stack development.'}
          </p>

          <h3 className="text-zinc-900 dark:text-white">Technical Skills</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(profile?.skills || []).map((skill) => (
              <div
                key={skill}
                className="flex items-center space-x-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-white" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <p className="text-zinc-500 dark:text-zinc-400">
            Contact: <a href="mailto:mehmeteminaydogdu498@gmail.com" className="text-zinc-900 dark:text-white hover:underline">mehmeteminaydogdu498@gmail.com</a>
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a
              href={profile?.githubUrl || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href={profile?.linkedinUrl || 'https://linkedin.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
