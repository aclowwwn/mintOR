
import React, { useRef, useState } from 'react';
import { useAppStore } from '../store';
import { ChapterPack } from '../types';
import { useI18n } from '../utils/i18n';

const ContentManagement: React.FC = () => {
  const { chapters, progress, settings, importPack, resetProgress } = useAppStore();
  const t = useI18n(settings.locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleExportContent = () => {
    const data: ChapterPack = {
      schemaVersion: 1,
      pack: {
        id: "exported-pack",
        title: "Exported Data",
        createdAt: new Date().toISOString()
      },
      chapters
    };
    downloadJson(data, `math_mentor_content_${Date.now()}.json`);
  };

  const handleExportProgress = () => {
    downloadJson(progress, `math_mentor_progress_${Date.now()}.json`);
  };

  const downloadJson = (obj: any, filename: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.chapters && Array.isArray(json.chapters)) {
           importPack(json as ChapterPack);
           setMsg({ text: t.importSuccess, type: 'success' });
        } else {
           setMsg({ text: t.importError, type: 'error' });
        }
      } catch (err) {
        setMsg({ text: t.parseError, type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-24 md:pb-0">
      <header>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t.backupTitle}</h1>
        <p className="text-slate-500 mt-2 font-medium leading-relaxed">{t.backupDesc}</p>
      </header>

      {msg && (
        <div className={`p-6 rounded-3xl font-bold flex items-center animate-bounceIn shadow-lg ${
          msg.type === 'success' ? 'bg-green-50 text-green-700 border-2 border-green-100' : 'bg-red-50 text-red-700 border-2 border-red-100'
        }`}>
          <span className="text-2xl mr-4">{msg.type === 'success' ? '✅' : '⚠️'}</span>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.importPack}</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-sm">{t.importDesc}</p>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImport} 
            ref={fileInputRef}
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 rounded-[1.5rem] bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all flex items-center justify-center shadow-xl shadow-indigo-100 active:scale-[0.98]"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t.selectFile}
          </button>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.backupExport}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleExportContent}
              className="group p-6 rounded-[1.5rem] border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" strokeWidth={2.5}/></svg>
              </div>
              <span className="font-black text-slate-700 text-sm leading-tight uppercase tracking-widest">{t.exportChapters}</span>
            </button>
            <button 
              onClick={handleExportProgress}
              className="group p-6 rounded-[1.5rem] border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth={2.5}/></svg>
              </div>
              <span className="font-black text-slate-700 text-sm leading-tight uppercase tracking-widest">{t.exportProgress}</span>
            </button>
          </div>
        </section>

        <section className="bg-red-50 p-8 md:p-10 rounded-[2.5rem] border-2 border-red-100 space-y-6">
          <h2 className="text-2xl font-black text-red-700 tracking-tight">{t.dangerZone}</h2>
          <p className="text-red-600 font-bold leading-relaxed text-sm">{t.dangerDesc}</p>
          <button 
            onClick={() => {
              if (window.confirm(t.confirmReset)) {
                resetProgress();
                setMsg({ text: "Progress has been reset.", type: 'success' });
              }
            }}
            className="w-full py-6 rounded-[1.5rem] bg-white border-2 border-red-200 text-red-600 font-black hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {t.resetProgress}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ContentManagement;
