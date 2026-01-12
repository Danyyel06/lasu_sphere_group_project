
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

const FinanceTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lasusphere_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    localStorage.setItem('lasusphere_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString()
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Balance</div>
          <div className={`text-3xl font-black ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            ₦{balance.toLocaleString()}
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Total Income</div>
          <div className="text-3xl font-black text-emerald-700">₦{totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-100">
          <div className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-2">Total Expenses</div>
          <div className="text-3xl font-black text-rose-700">₦{totalExpense.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">New Transaction</h3>
          <form onSubmit={addTransaction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Monthly Allowance"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Books</option>
                <option>Tuition</option>
                <option>Savings</option>
                <option>Rent</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Add Transaction
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{transactions.length} Records</span>
          </div>
          <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                No transactions yet
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {t.description}
                        <div className="text-[10px] text-slate-400 font-medium">{new Date(t.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{t.category}</span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-black text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;