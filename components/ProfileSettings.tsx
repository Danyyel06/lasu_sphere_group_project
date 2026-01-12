
import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface ProfileSettingsProps {
  user: Student;
  onUpdate: (user: Student) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    otherName: user.otherName,
    surname: user.surname,
    password: user.password || '',
    matricNo: user.matricNo,
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lasusphere_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lasusphere_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.surname) {
      setMessage({ type: 'error', text: 'First Name and Surname are required.' });
      return;
    }

    const updatedUser: Student = {
      ...user,
      firstName: formData.firstName,
      otherName: formData.otherName,
      surname: formData.surname,
      password: formData.password || undefined,
    };

    localStorage.setItem(`lasusphere_user_${user.matricNo}`, JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn py-6 px-4 md:px-0">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Manage your personal information, security, and appearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Card: APPEARANCE */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-sm border border-slate-100 dark:border-slate-800 h-full">
            <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-12">APPEARANCE</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-black text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-slate-400 font-medium">Reduce eye strain</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: PERSONAL INFORMATION */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-12">PERSONAL INFORMATION</h3>
            
            {message && (
              <div className={`mb-10 p-5 rounded-3xl flex items-center gap-4 border animate-slideUp ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100' : 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100'}`}>
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-black">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">FIRST NAME</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-8 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none font-bold text-slate-800 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">OTHER NAME</label>
                  <input 
                    type="text" 
                    value={formData.otherName}
                    onChange={e => setFormData({...formData, otherName: e.target.value})}
                    className="w-full px-8 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none font-bold text-slate-800 text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">SURNAME (PERMANENT)</label>
                  <input 
                    type="text" 
                    value={formData.surname}
                    disabled
                    className="w-full px-8 py-5 rounded-[24px] bg-slate-100 dark:bg-slate-800/80 border-none text-slate-400 cursor-not-allowed transition-all outline-none font-bold text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">UPDATE PASSWORD</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="Set a new password"
                    className="w-full px-8 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">MATRICULATION NUMBER</label>
                <input 
                  type="text" 
                  value={formData.matricNo}
                  disabled
                  className="w-full px-8 py-5 rounded-[24px] bg-slate-100 dark:bg-slate-800/80 border-none text-slate-400 cursor-not-allowed transition-all outline-none font-black tracking-widest text-lg"
                />
                <p className="text-[11px] text-slate-400 italic font-medium px-2">Unique identifiers cannot be modified.</p>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="px-14 py-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black rounded-[24px] shadow-2xl transition-all active:scale-[0.97] text-lg"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
