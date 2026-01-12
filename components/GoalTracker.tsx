
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('lasusphere_goals');
    // Start empty for "from scratch" experience
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lasusphere_goals', JSON.stringify(goals));
  }, [goals]);

  const [newGoal, setNewGoal] = useState({ title: '', deadline: '', progress: 0, category: 'academic' as any });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.deadline) return;
    setGoals([...goals, { ...newGoal, id: Date.now().toString() }]);
    setNewGoal({ title: '', deadline: '', progress: 0, category: 'academic' });
    setIsAdding(false);
  };

  const updateProgress = (id: string, amount: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + amount)) } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Success Roadmap</h2>
          <p className="text-slate-500 font-medium">Build your own academic and personal milestones from the ground up.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Goal
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-slideUp">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Setup New Objective</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Goal Identification</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Finish Calculus 2 Syllabus"
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Target Deadline</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGoal.deadline}
                onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Category</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGoal.category}
                onChange={e => setNewGoal({...newGoal, category: e.target.value as any})}
              >
                <option value="academic">Academic Objective</option>
                <option value="personal">Personal Growth</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAddGoal}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Create
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-xl font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-600 mb-2">No Goals Established Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Start by setting clear, time-bound objectives. Your progress will be visualized here as you update your milestones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                  goal.category === 'academic' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-700'
                }`}>
                  {goal.category}
                </span>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              
              <h3 className="font-black text-slate-800 text-lg mb-1 leading-tight">{goal.title}</h3>
              <p className="text-[10px] text-slate-400 mb-8 flex items-center gap-1 font-bold uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Due {new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${
                      goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`} 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <button 
                  onClick={() => updateProgress(goal.id, -10)}
                  className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                </button>
                <button 
                  className={`flex-1 py-2 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    goal.progress === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {goal.progress === 100 ? 'Goal Achieved' : 'Update Milestone'}
                </button>
                <button 
                  onClick={() => updateProgress(goal.id, 10)}
                  className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalTracker;