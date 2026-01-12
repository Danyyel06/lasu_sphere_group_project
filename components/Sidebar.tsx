
import React from 'react';

interface SidebarProps {
  activeTab: 'overview' | 'ai' | 'calendar' | 'goals' | 'finance' | 'settings';
  setActiveTab: (tab: 'overview' | 'ai' | 'calendar' | 'goals' | 'finance' | 'settings') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'ai', label: 'AI Mentors', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )},
    { id: 'finance', label: 'Finance Hub', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
      </svg>
    )},
    { id: 'calendar', label: 'Calendar', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'goals', label: 'Milestones', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'settings', label: 'Identity', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )}
  ];

  return (
    <aside className="w-72 lg:w-80 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all shadow-2xl lg:shadow-none">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center p-2 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
            <img src="/main-logo.png" className="w-24 h-24 object-contain" alt="LASU Smart Companion" />
          </div>
          <div>
            <span className="block text-xl font-black text-slate-900 dark:text-white tracking-tighter">LasuSphere</span>
            <span className="block text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Academic Portal</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 dark:shadow-indigo-950/40 translate-x-1' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all font-black uppercase tracking-widest text-[9px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          End Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
