
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { ChapterProgress, ExerciseProgress } from '../types';
import { useI18n } from '../utils/i18n';

const Dashboard: React.FC = () => {
  const { chapters, progress, settings } = useAppStore();
  const t = useI18n(settings.locale);

  const totalExercises = chapters.reduce((acc, c) => acc + c.exercises.length, 0);
  
  // Fix: Explicitly cast Object.values to ChapterProgress[] to avoid 'unknown' type errors during arithmetic operations
  const solvedExercises = (Object.values(progress.chapters) as ChapterProgress[]).reduce((acc: number, cp: ChapterProgress) => {
    // Fix: Explicitly cast Object.values to ExerciseProgress[] to ensure ep is recognized correctly
    return acc + (Object.values(cp.exerciseProgress) as ExerciseProgress[]).filter((ep: ExerciseProgress) => ep.status === 'solved' || ep.status === 'solved_with_hints').length;
  }, 0);

  const progressPct = totalExercises > 0 ? Math.round((solvedExercises / totalExercises) * 100) : 0;

  // Fix: Explicitly cast Object.entries to ensure b[1] and a[1] are recognized as ChapterProgress instead of unknown
  const recentChapterId = (Object.entries(progress.chapters) as [string, ChapterProgress][])
    .sort((a, b) => {
      const getLatestTimestamp = (cp: ChapterProgress) => {
        let latest = 0;
        // Fix: Explicitly cast Object.values to ExerciseProgress[]
        (Object.values(cp.exerciseProgress) as ExerciseProgress[]).forEach(ep => {
          ep.attempts.forEach(att => {
            const time = new Date(att.timestamp).getTime();
            if (time > latest) latest = time;
          });
        });
        return latest;
      };
      // Fix: Added explicit return value check for subtraction operation
      return getLatestTimestamp(b[1]) - getLatestTimestamp(a[1]);
    })
    .map(([id]) => id)[0];
  
  const recentChapter = chapters.find(c => c.id === recentChapterId);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t.welcome}</h1>
        <p className="text-slate-500 mt-2 font-medium">{t.ready}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.overallProgress}</span>
            <div className="text-5xl font-black text-indigo-600 mt-2">{progressPct}%</div>
          </div>
          <div className="mt-6 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progressPct}%` }}></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-4">{solvedExercises} {t.solvedOf} {totalExercises}</p>
        </div>

        <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white flex flex-col justify-between transition-transform hover:scale-[1.02]">
          <div>
            <h3 className="text-xl font-black tracking-tight">{t.resume}</h3>
            <p className="text-indigo-100 text-sm mt-2 font-medium">
              {recentChapter ? `${recentChapter.title}` : t.pickChapter}
            </p>
          </div>
          <Link 
            to={recentChapter ? `/chapters/${recentChapter.id}` : '/chapters'}
            className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-center hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
          >
            {t.goToChapter}
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center md:items-start">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t.badges}</span>
           <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm" title="First Exercise">⭐</div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl opacity-20 shadow-sm" title="Streak 5 Days">🔥</div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl opacity-20 shadow-sm" title="Perfect Score">🏆</div>
           </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.availableChapters}</h2>
          <Link to="/chapters" className="text-indigo-600 font-bold hover:underline text-sm uppercase tracking-wide">{t.viewAll}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.slice(0, 4).map(chapter => (
            <Link key={chapter.id} to={`/chapters/${chapter.id}`} className="group block bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h4 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{chapter.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-2 font-medium">{chapter.description}</p>
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {t.level} {chapter.difficulty}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
