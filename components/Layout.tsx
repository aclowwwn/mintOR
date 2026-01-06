
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { useI18n } from '../utils/i18n';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { settings, setLocale } = useAppStore();
  const t = useI18n(settings.locale);

  const navItems = [
    { label: t.dashboard, path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: t.chapters, path: '/chapters', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: t.content, path: '/content', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row pb-20 md:pb-0 bg-slate-50">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-slate-900 text-white w-64 flex-shrink-0 sticky top-0 h-screen p-6 flex-col justify-between shadow-2xl">
        <div className="flex flex-col">
          <div className="text-2xl font-black mb-10 text-indigo-400 flex items-center tracking-tight">
             <span className="mr-3 text-3xl">📐</span> {t.appName}
          </div>
          <div className="flex flex-col space-y-2 w-full">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50 scale-105' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center p-1 bg-slate-800 rounded-lg">
            <button 
              onClick={() => setLocale('ro')}
              className={`flex-1 text-xs py-2 px-3 rounded-md transition-all ${settings.locale === 'ro' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ROMÂNĂ
            </button>
            <button 
              onClick={() => setLocale('en')}
              className={`flex-1 text-xs py-2 px-3 rounded-md transition-all ${settings.locale === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ENGLISH
            </button>
          </div>
          <div className="text-xs text-slate-500 font-medium text-center">
             v1.1.0 • Offline Ready
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="text-xl font-black text-indigo-600 tracking-tight flex items-center">
           <span className="mr-2">📐</span> {t.appName}
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setLocale('ro')}
            className={`text-[10px] px-2 py-1 rounded font-bold ${settings.locale === 'ro' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            RO
          </button>
          <button 
            onClick={() => setLocale('en')}
            className={`text-[10px] px-2 py-1 rounded font-bold ${settings.locale === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              location.pathname === item.path ? 'text-indigo-600 scale-110' : 'text-slate-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
