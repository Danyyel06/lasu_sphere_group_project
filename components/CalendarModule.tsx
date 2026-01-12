
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';

const CalendarModule: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('lasusphere_calendar');
    // Start with empty array for "from scratch" experience
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lasusphere_calendar', JSON.stringify(events));
  }, [events]);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', category: 'academic' as any });
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now().toString(), reminder: true }]);
    setNewEvent({ title: '', date: '', category: 'academic' });
    setShowModal(false);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">{monthName}</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{year}</p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="h-28 bg-slate-50/50 rounded-xl border border-dashed border-slate-100"></div>;
              
              const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <div key={day} className={`h-28 p-2 border border-slate-50 rounded-xl transition-all cursor-pointer group flex flex-col ${isToday ? 'bg-indigo-50 ring-2 ring-indigo-100 ring-inset' : 'hover:bg-slate-50'}`}>
                  <div className={`text-xs font-black mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {day}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        onClick={(ev) => { ev.stopPropagation(); removeEvent(e.id); }}
                        className={`text-[9px] p-1 rounded font-bold truncate group/item relative ${
                          e.category === 'academic' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                        }`}
                        title="Click to remove"
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6 flex items-center justify-between">
            Upcoming
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px]">{events.length} Total</span>
          </h3>
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400 font-medium italic">No reminders set. Click "Add Reminder" to start organizing your schedule.</p>
              </div>
            ) : (
              events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
                .sort((a,b) => a.date.localeCompare(b.date))
                .slice(0, 10)
                .map(event => (
                  <div key={event.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-xl flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{event.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{event.category}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Schedule New Task</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reminder Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Review AI Research Paper"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['academic', 'personal', 'extracurricular'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewEvent({...newEvent, category: cat as any})}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                        newEvent.category === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
                <button onClick={addEvent} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-indigo-700">Save Reminder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;