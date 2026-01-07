
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { validateAnswer } from '../utils/validation';
import { useI18n } from '../utils/i18n';
import GeometryCanvas, { GeometryCanvasHandle } from '../components/GeometryCanvas';

const ExerciseView: React.FC = () => {
  const { chapterId, exerciseId } = useParams<{ chapterId: string; exerciseId: string }>();
  const navigate = useNavigate();
  const { chapters, progress, settings, revealHint, recordAttempt } = useAppStore();
  const t = useI18n(settings.locale);
  const canvasRef = useRef<GeometryCanvasHandle>(null);

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; correct: boolean } | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);

  const chapter = chapters.find(c => c.id === chapterId);
  const exerciseIdx = chapter?.exercises.findIndex(e => e.id === exerciseId) ?? -1;
  const exercise = chapter?.exercises[exerciseIdx];

  const exProgress = progress.chapters[chapterId!]?.exerciseProgress[exerciseId!] || {
    status: 'not_started',
    attempts: [],
    hintsRevealed: [],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setUserInput('');
    setFeedback(null);
    // Automatically show sandbox for geometry problems to encourage manual drawing
    if (chapter?.tags.includes('geometrie')) {
      setShowSandbox(true);
    }
  }, [exerciseId, chapter]);

  if (!chapter || !exercise) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Exercise not found</h2>
        <Link to="/chapters" className="text-indigo-600 font-bold">Back to Chapters</Link>
      </div>
    );
  }

  const handleCheck = () => {
    const result = validateAnswer(userInput, exercise.answer);
    setFeedback({ msg: result.feedback, correct: result.isCorrect });
    recordAttempt(chapter.id, exercise.id, userInput, result.isCorrect);
  };

  const handleHint = () => {
    const nextHint = exercise.hints.find(h => !exProgress.hintsRevealed.includes(h.id));
    if (nextHint) {
      revealHint(chapter.id, exercise.id, nextHint.id);
      // We no longer auto-draw; we let the student do it manually in the sandbox
      setShowSandbox(true);
    }
  };

  const handleNext = () => {
    const nextEx = chapter.exercises[exerciseIdx + 1];
    if (nextEx) navigate(`/chapters/${chapter.id}/exercise/${nextEx.id}`);
    else navigate(`/chapters/${chapter.id}`);
  };

  const handlePrev = () => {
    const prevEx = chapter.exercises[exerciseIdx - 1];
    if (prevEx) navigate(`/chapters/${chapter.id}/exercise/${prevEx.id}`);
  };

  const isSolved = exProgress.status === 'solved' || exProgress.status === 'solved_with_hints';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="flex items-center justify-between px-2">
        <Link to={`/chapters/${chapter.id}`} className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7 7-7" />
          </svg>
          {chapter.title}
        </Link>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowSandbox(!showSandbox)}
             className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 transition-all ${showSandbox ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 border-slate-100'}`}
           >
             {showSandbox ? t.hideSandbox : t.showSandbox}
           </button>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.exerciseOf} {exerciseIdx + 1} / {chapter.exercises.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${showSandbox ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6 transition-all duration-500`}>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="h-2 bg-slate-50 w-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                style={{ width: `${((exerciseIdx + 1) / chapter.exercises.length) * 100}%` }}
              />
            </div>

            <div className="p-8 md:p-10 space-y-12">
              <section className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-black leading-snug text-slate-900 tracking-tight">
                  {exercise.prompt.text}
                </h2>
                {exercise.prompt.images?.map((img, i) => (
                  <img key={i} src={img} alt="Figure" className="max-w-full h-auto rounded-3xl border border-slate-100 shadow-md mx-auto" />
                ))}
              </section>

              <section className="space-y-6">
                {exercise.answer.type === 'multiple_choice' ? (
                  <div className="grid grid-cols-1 gap-4">
                    {exercise.answer.choices?.map(choice => (
                      <button
                        key={choice.id}
                        disabled={isSolved}
                        onClick={() => setUserInput(choice.id)}
                        className={`text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg active:scale-[0.98] ${
                          userInput === choice.id 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-inner' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type={exercise.answer.type === 'numeric' ? 'number' : 'text'}
                      disabled={isSolved}
                      placeholder={t.enterAnswer}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                      className="w-full text-3xl font-black px-8 py-6 rounded-3xl border-2 border-slate-100 focus:outline-none focus:border-indigo-500 transition-all shadow-sm placeholder-slate-300"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleCheck}
                    disabled={isSolved || !userInput}
                    className={`flex-[2] py-5 rounded-3xl font-black text-white shadow-xl transition-all active:scale-95 ${
                      isSolved || !userInput 
                        ? 'bg-slate-200 shadow-none cursor-not-allowed text-slate-400' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                    }`}
                  >
                    {isSolved ? t.completed : t.checkAnswer}
                  </button>
                  
                  <button
                    onClick={handleHint}
                    disabled={exProgress.hintsRevealed.length === exercise.hints.length}
                    className="flex-1 px-8 py-5 rounded-3xl font-black border-2 border-slate-100 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center active:scale-95 disabled:opacity-30"
                  >
                    <span className="mr-2 text-xl">💡</span>
                    {t.hint} ({exProgress.hintsRevealed.length}/{exercise.hints.length})
                  </button>
                </div>

                {feedback && (
                  <div className={`p-6 rounded-3xl border-2 flex items-center animate-bounceIn ${
                    feedback.correct ? 'bg-green-50 border-green-100 text-green-700 shadow-sm' : 'bg-red-50 border-red-100 text-red-700 shadow-sm'
                  }`}>
                    <span className="text-3xl mr-4">{feedback.correct ? '🎉' : '❌'}</span>
                    <span className="font-black text-lg">{feedback.msg}</span>
                  </div>
                )}
              </section>

              {isSolved && exercise.solution && (
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 animate-fadeIn shadow-inner">
                  <h4 className="font-black text-slate-900 mb-3 flex items-center uppercase tracking-widest text-xs">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100-2H7a1 1 0 110 2h.01zm3 0a1 1 0 100-2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    {t.solution}
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{exercise.solution.text}</p>
                </div>
              )}

              {exProgress.hintsRevealed.length > 0 && (
                <section className="space-y-4 border-t-2 border-slate-50 pt-12">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t.hintsRevealed}</h3>
                  <div className="space-y-4">
                    {exercise.hints.filter(h => exProgress.hintsRevealed.includes(h.id)).map((hint, i) => (
                      <div key={hint.id} className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 animate-fadeIn shadow-sm">
                        <span className="font-black text-[10px] uppercase text-amber-500 mb-2 block tracking-widest">{t.hint} {i+1}</span>
                        <p className="font-bold leading-relaxed">{hint.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="bg-slate-50 px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
              <button 
                onClick={handlePrev} 
                disabled={exerciseIdx === 0}
                className="w-full sm:w-auto flex items-center justify-center text-slate-400 font-black hover:text-indigo-600 disabled:opacity-20 transition-colors px-4 py-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t.previous}
              </button>
              
              <button 
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center bg-white border-2 border-slate-200 px-10 py-4 rounded-2xl text-slate-900 font-black hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
              >
                {exerciseIdx === chapter.exercises.length - 1 ? t.finishChapter : t.next}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        {showSandbox && (
          <div className="lg:col-span-5 sticky top-24 animate-fadeInRight">
            <GeometryCanvas ref={canvasRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseView;
