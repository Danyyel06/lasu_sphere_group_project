
import React, { useState, useEffect } from 'react';
import { Student, UserProfile, CalendarEvent, Transaction, Goal } from '../types';

interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  icon: React.ReactNode;
}

const Overview: React.FC<{ user: Student }> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`lasusphere_profile_${user.matricNo}`);
    return saved ? JSON.parse(saved) : {
      currentGPA: 0.0,
      targetGPA: 4.0,
      coursesCompleted: 0,
      totalCourses: 40,
      creditsEarned: 0,
      totalCreditsRequired: 120
    };
  });

  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // 1. Sync Upcoming Calendar Events
    const savedEvents = localStorage.getItem('lasusphere_calendar');
    let parsedEvents: CalendarEvent[] = [];
    if (savedEvents) {
      parsedEvents = JSON.parse(savedEvents) as CalendarEvent[];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sorted = [...parsedEvents]
        .filter(e => new Date(e.date) >= today)
        .sort((a,b) => a.date.localeCompare(b.date))
        .slice(0, 3);
      setUpcomingEvents(sorted);
    }

    // 2. Aggregate All Activities for the Feed
    const allActivities: ActivityItem[] = [];

    // Add Transactions
    const txsStr = localStorage.getItem('lasusphere_transactions');
    if (txsStr) {
      const txs = JSON.parse(txsStr) as Transaction[];
      txs.forEach(t => {
        allActivities.push({
          title: t.type === 'income' ? 'Funds Received' : 'Expense Logged',
          desc: `${t.description} (₦${t.amount.toLocaleString()})`,
          time: new Date(t.date).toLocaleDateString(),
          timestamp: new Date(t.date).getTime(),
          icon: (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              </svg>
            </div>
          )
        });
      });
    }

    // Add Goals
    const goalsStr = localStorage.getItem('lasusphere_goals');
    if (goalsStr) {
      const goals = JSON.parse(goalsStr) as Goal[];
      goals.forEach(g => {
        allActivities.push({
          title: 'Goal Established',
          desc: `${g.title} (${g.progress}% Complete)`,
          time: 'Active Milestone',
          timestamp: parseInt(g.id), // ID is Date.now()
          icon: (
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )
        });
      });
    }

    // Add Calendar Events (as "Scheduled" activities)
    parsedEvents.forEach(e => {
      allActivities.push({
        title: 'Task Scheduled',
        desc: e.title,
        time: new Date(e.date).toLocaleDateString(),
        timestamp: parseInt(e.id), // ID is Date.now()
        icon: (
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      });
    });

    // Sort by timestamp descending
    allActivities.sort((a, b) => b.timestamp - a.timestamp);

    // Final display list
    if (allActivities.length === 0) {
      setRecentActivities([
        {
          title: 'New Session Started',
          desc: 'Everything you add is saved securely in your local storage.',
          time: 'JUST NOW',
          timestamp: Date.now(),
          icon: (
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          )
        },
        {
          title: 'System Ready',
          desc: 'All features are active and ready for your input.',
          time: 'SYSTEM',
          timestamp: Date.now() - 1000,
          icon: (
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )
        }
      ]);
    } else {
      setRecentActivities(allActivities.slice(0, 4));
    }

    localStorage.setItem(`lasusphere_profile_${user.matricNo}`, JSON.stringify(profile));
  }, [profile, user.matricNo]);

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Standing</h1>
          <p className="text-slate-500">Track your real-time performance and requirements.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(!isEditing);
            setEditForm(profile);
          }}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {isEditing ? 'Cancel Editing' : 'Update Stats'}
        </button>
      </div>

      {isEditing && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-slideUp mb-8">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4">Edit Academic Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Current GPA</label>
              <input 
                type="number" step="0.01" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.currentGPA}
                onChange={e => setEditForm({...editForm, currentGPA: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Target GPA</label>
              <input 
                type="number" step="0.01" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.targetGPA}
                onChange={e => setEditForm({...editForm, targetGPA: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Courses Completed</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.coursesCompleted}
                onChange={e => setEditForm({...editForm, coursesCompleted: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Total Courses Required</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.totalCourses}
                onChange={e => setEditForm({...editForm, totalCourses: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Credits Earned</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.creditsEarned}
                onChange={e => setEditForm({...editForm, creditsEarned: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1">Graduation Credits Req.</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editForm.totalCreditsRequired}
                onChange={e => setEditForm({...editForm, totalCreditsRequired: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <button 
            onClick={handleSaveProfile}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Current GPA</div>
          <div className="text-4xl font-black text-slate-800">{profile.currentGPA.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-tight">Target: {profile.targetGPA.toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Course Progress</div>
          <div className="text-4xl font-black text-slate-800">{profile.coursesCompleted} / {profile.totalCourses}</div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, profile.totalCourses > 0 ? (profile.coursesCompleted / profile.totalCourses) * 100 : 0)}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Credits Earned</div>
          <div className="text-4xl font-black text-slate-800">{profile.creditsEarned}</div>
          <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-tight">Req for graduation: {profile.totalCreditsRequired}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming Schedule
          </h3>
          <div className="space-y-4">
             {upcomingEvents.length === 0 ? (
               <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <p className="text-sm">Visit the <span className="font-bold text-indigo-600 underline cursor-pointer">Schedule</span> tab to add your own events.</p>
               </div>
             ) : (
               upcomingEvents.map(event => (
                 <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-100 transition-colors group">
                    <div className="w-12 h-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 group-hover:border-indigo-200 transition-colors">
                      <span className="text-[10px] font-black uppercase text-slate-400">{new Date(event.date).toLocaleDateString(undefined, {month: 'short'})}</span>
                      <span className="text-lg font-black text-slate-800 leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{event.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{event.category}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Recent Activity
          </h3>
          <div className="space-y-6">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex gap-4 group animate-fadeIn">
                {act.icon}
                <div>
                  <p className="text-sm font-bold text-slate-800">{act.title}</p>
                  <p className="text-xs text-slate-400 mb-0.5 leading-tight">{act.desc}</p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;