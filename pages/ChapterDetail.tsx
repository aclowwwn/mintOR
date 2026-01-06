
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { useI18n } from '../utils/i18n';

const ChapterDetail: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { chapters, progress, settings } = useAppStore();
  const t = useI18n(settings.locale);

  const chapter = chapters.find(c => c.id === chapterId);
  if (!chapter) {
    return <div className="p-10 text-center font-bold">Chapter not found.</div>;
  }

  const chProgress = progress.chapters[chapter.id];

  const getStatusIcon = (status?: string) => {
    switch(status) {
      case 'solved': return '✅';
      case 'solved_with_hints': return '💡';
      case 'in_progress': return '⏳';
      default: return '⚪';
    }
  };

  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'solved': return 'bg-green-50 text-green-700 border-green-100';
      case 'solved_with_hints': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const nextToSolve = chapter.exercises.find(ex => {
    const status = chProgress?.exerciseProgress[ex.id]?.status;
    return status !== 'solved' && status !== 'solved_with_hints';
  }) || chapter.exercises[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24 md:pb-0">
      <Link to="/chapters" className="inline-flex items-center text-slate-400 font-bold hover:text-indigo-600 transition-colors">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
        {t.backToChapters}
      </Link>

      <header className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 -mr-16 -mt-16"></div>
        <div className="flex-1 relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
             {chapter.tags.map(tag => <span key={tag} className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-wider">#{tag}</span>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{chapter.title}</h1>
          <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed max-w-2xl">{chapter.description}</p>
        </div>
        <button 
          onClick={() => navigate(`/chapters/${chapter.id}/exercise/${nextToSolve.id}`)}
          className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95 relative z-10 text-lg"
        >
          {chProgress ? t.resumeChapter : t.startChapter}
        </button>
      </header>

      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.exercises}</h3>
          <span className="bg-white px-3 py-1 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{chapter.exercises.length} {t.exercises}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {chapter.exercises.map((ex, idx) => {
            const exProgress = chProgress?.exerciseProgress[ex.id];
            const status = exProgress?.status;

            return (
              <Link 
                key={ex.id} 
                to={`/chapters/${chapter.id}/exercise/${ex.id}`}
                className="group flex items-center justify-between p-6 md:p-8 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all ${getStatusClass(status)} group-hover:scale-110`}>
                    {idx + 1}
                  </div>
                  <div className="max-w-[150px] sm:max-w-xs md:max-w-md">
                    <h4 className="font-bold text-slate-900 line-clamp-1 text-lg group-hover:text-indigo-600 transition-colors leading-tight">{ex.prompt.text}</h4>
                    <div className="flex items-center mt-2 space-x-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2.5}/></svg>
                        ~{ex.meta?.estimatedSeconds || 60}s
                      </span>
                      {exProgress?.attempts.length ? (
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeWidth={2.5}/></svg>
                          {exProgress.attempts.length} {exProgress.attempts.length === 1 ? t.attempt : t.attempts}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getStatusIcon(status)}</span>
                  <svg className="hidden sm:block w-6 h-6 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ChapterDetail;
