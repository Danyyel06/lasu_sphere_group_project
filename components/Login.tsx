
import React, { useState } from 'react';
import { STUDENTS_DB } from '../constants';
import { Student } from '../types';

interface LoginProps {
  onLogin: (user: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [matricNo, setMatricNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const savedUserStr = localStorage.getItem(`lasusphere_user_${matricNo}`);
      let found: Student | undefined;

      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        const activePassword = savedUser.password || savedUser.surname;
        if (activePassword.toLowerCase() === password.toLowerCase()) {
          found = savedUser;
        }
      } else {
        found = STUDENTS_DB.find(
          s => s.matricNo === matricNo && s.surname.toLowerCase() === password.toLowerCase()
        );
      }

      if (found) {
        onLogin(found);
      } else {
        setError('Verification failed. Check your credentials (initial password is your Surname).');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors font-sans overflow-hidden">
      {/* Dynamic Brand Pillar - Visible from lg up (992px) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFC700] relative items-center justify-center p-20">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600 rounded-full blur-[140px] opacity-20"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[140px] opacity-10"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-10 w-36 h-36 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
             <img src="/main-logo.png" className="w-24 h-24 object-contain" alt="LASU Smart Companion" />
          </div>
          <h1 className="text-6xl text-black font-black mb-8 tracking-tighter leading-none">Lasu Sphere</h1>
          <p className="text-xl text-black leading-relaxed font-medium">
            Next-gen academic orchestration and secure student identity protocol for the Lagos State University community.
          </p>
        </div>
      </div>

      {/* Access Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="w-full max-w-md space-y-10 animate-fadeIn">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Portal Access</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Sign in to your personalized academic hub.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 animate-slideUp">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Matriculation ID</label>
              <input
                type="text"
                required
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-lg"
                placeholder="220591..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Verifying...
                </>
              ) : 'Open LasuSphere'}
            </button>
          </form>
          
          <div className="pt-4 text-center">
             <p className="text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest leading-relaxed">
               Default Password: Your Registered Surname. Mandatory security upgrade will follow first successful entry.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
