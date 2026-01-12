
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import Sidebar from './Sidebar';
import Overview from './Overview';
import AIChatbots from './AIChatbots';
import CalendarModule from './CalendarModule';
import GoalTracker from './GoalTracker';
import FinanceTracker from './FinanceTracker';
import ProfileSettings from './ProfileSettings';

interface DashboardProps {
  user: Student;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'calendar' | 'goals' | 'finance' | 'settings'>('overview');
  const [currentUser, setCurrentUser] = useState<Student>(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUpdates = () => {
      const savedUser = localStorage.getItem(`lasusphere_user_${user.matricNo}`);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    };
    checkUpdates();
    window.addEventListener('storage', checkUpdates);
    return () => window.removeEventListener('storage', checkUpdates);
  }, [user.matricNo]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview user={currentUser} />;
      case 'ai': return <AIChatbots />;
      case 'calendar': return <CalendarModule />;
      case 'goals': return <GoalTracker />;
      case 'finance': return <FinanceTracker />;
      case 'settings': return <ProfileSettings user={currentUser} onUpdate={setCurrentUser} />;
      default: return <Overview user={currentUser} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Drawer for md and below, static for lg and above */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          onLogout={onLogout} 
        />
      </div>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize tracking-tight leading-none">
                Hello, {currentUser.firstName.toLowerCase()}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                {currentUser.matricNo} • Verified Profile
              </p>
            </div>
            <div className="sm:hidden font-black text-indigo-600 text-lg">LasuSphere</div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Secured</span>
              </div>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl shadow-indigo-100 dark:shadow-none ring-4 ring-white dark:ring-slate-800 transform hover:scale-105 transition-transform cursor-pointer">
              {currentUser.firstName[0].toUpperCase()}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
