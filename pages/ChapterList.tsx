
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { ExerciseProgress } from '../types';
import { useI18n } from '../utils/i18n';

const ChapterList: React.FC = () => {
  const { chapters, progress, settings } = useAppStore();
  const t = useI18n(settings.locale);
  const [search, setSearch] = useState('');

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t.chapters}</h1>
          <p className="text-slate-500 font-medium mt-1">{t.ready}</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm font-medium"
          />
          <svg className="w-6 h-6 absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map(chapter => {
          const chProgress = progress.chapters[chapter.id];
          const solvedCount = chProgress ? Object.values(chProgress.exerciseProgress).filter((p: ExerciseProgress) => p.status === 'solved' || p.status === 'solved_with_hints').length : 0;
          const totalCount = chapter.exercises.length;
          const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

          return (
            <Link 
              key={chapter.id} 
              to={`/chapters/${chapter.id}`}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col group"
            >
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-xl">{t.chapters.slice(0, -1)} {chapter.order}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.level} {chapter.difficulty}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{chapter.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 font-medium mb-6 leading-relaxed">{chapter.description}</p>
                <div className="flex flex-wrap gap-2">
                  {chapter.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="px-8 pb-8 mt-auto">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                  <span>{t.progress}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2rem] border-4 border-dashed border-slate-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg font-bold">{t.noChapters}</p>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
