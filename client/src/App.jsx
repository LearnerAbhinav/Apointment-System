import React, { useState } from 'react';
import ChatInterface from './components/Chat/ChatInterface';
import AdminDashboard from './components/Admin/AdminDashboard';
import { MessageSquare, LayoutDashboard, CalendarCheck } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CalendarCheck className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AI<span className="text-indigo-400">Book</span></span>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={18} />
            <span>Chat Assistant</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('admin')}
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Manage Bookings</span>
          </button>
        </nav>

        <div className="mt-auto px-4 py-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">System Status</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-dark/50 backdrop-filter blur-sm z-10 sticky top-0">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            {activeTab === 'chat' ? 'Conversational AI' : 'Administrative Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">AD</div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {activeTab === 'chat' ? <ChatInterface /> : <AdminDashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;
