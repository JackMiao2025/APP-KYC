
import React, { useState } from 'react';
import { Search, Loader2, PlayCircle, Plus, AlertCircle, Terminal, Globe, Smartphone, Languages, Clock, ArrowRight } from 'lucide-react';
import { analyzeDomain, analyzeApp } from './services/geminiService';
import { CrawlResult, CrawlStatus, AnalysisType, SearchHistoryItem } from './types';
import { AnalysisCard } from './components/AnalysisCard';
import { ComparisonChart } from './components/ComparisonChart';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<AnalysisType>('web');
  const [status, setStatus] = useState<CrawlStatus>(CrawlStatus.IDLE);
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Translations for Main UI
  const t = {
    title: lang === 'zh' ? "全渠道情报分析" : "Omnichannel Intelligence",
    subtitle: lang === 'zh' ? "Web & App 生态系统" : "Web & App Ecosystems",
    desc: lang === 'zh' ? "即时抓取网站或分析移动应用，提取可用性、分类和技术足迹。" : "Instantly crawl websites or analyze mobile apps to extract availability, categories, and tech footprints.",
    webMode: lang === 'zh' ? "网站分析" : "Website Analysis",
    appMode: lang === 'zh' ? "应用商店分析" : "App Store / Play",
    placeholderWeb: lang === 'zh' ? "输入域名 (例如 example.com)" : "Enter website domain (e.g., example.com)",
    placeholderApp: lang === 'zh' ? "输入 App Store 或 Play Store 链接" : "Enter App Store or Play Store Link",
    analyzeBtn: lang === 'zh' ? "开始分析" : "Analyze",
    scanning: lang === 'zh' ? "扫描中..." : "Scanning...",
    compAnalysis: lang === 'zh' ? "对比分析" : "Comparative Analysis",
    resultsTitle: lang === 'zh' ? "分析结果" : "Analysis Results",
    items: lang === 'zh' ? "项" : "items",
    readyTitle: lang === 'zh' ? "准备就绪" : "Ready to crawl",
    readyDesc: lang === 'zh' ? "选择模式并输入 URL 以开始收集情报。" : "Select a mode and enter a URL to start gathering intelligence.",
    errorDuplicate: lang === 'zh' ? "该输入已被分析。" : "This input has already been analyzed.",
    errorFailed: lang === 'zh' ? "分析失败，请检查输入并重试。" : "Failed to analyze. Check the input and try again.",
    recentSearches: lang === 'zh' ? "最近搜索记录" : "Recent Searches"
  };

  const handleAnalyze = async (inputStr?: string) => {
    const input = (inputStr || inputValue).trim();
    if (!input) return;

    // Basic Duplicate check (rough)
    const exists = results.find(r => {
        if (mode === 'web' && r.type === 'web') return (r.data as any).domain === input;
        if (mode === 'app' && r.type === 'app') return (r.data as any).storeUrl === input;
        return false;
    });

    if (exists) {
        setErrorMsg(t.errorDuplicate);
        return;
    }

    setStatus(CrawlStatus.LOADING);
    setErrorMsg(null);

    try {
      let resultData;
      
      if (mode === 'web') {
        resultData = await analyzeDomain(input, lang);
      } else {
        resultData = await analyzeApp(input, lang);
      }
      
      const newResult: CrawlResult = {
        id: crypto.randomUUID(),
        type: mode,
        timestamp: Date.now(),
        data: resultData.data,
        sources: resultData.sources
      };

      setResults(prev => [newResult, ...prev]); 
      
      // Update History
      setHistory(prev => {
        const newHist = { query: input, mode, timestamp: Date.now() };
        // Remove duplicate if exists at top
        const filtered = prev.filter(h => h.query !== input);
        return [newHist, ...filtered].slice(0, 10);
      });

      setInputValue('');
      setStatus(CrawlStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(CrawlStatus.ERROR);
      setErrorMsg(err.message || t.errorFailed);
    } finally {
      if (status !== CrawlStatus.ERROR) {
          setTimeout(() => setStatus(CrawlStatus.IDLE), 1000);
      }
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-cyan-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-950">
              <Terminal size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Cyber<span className="text-cyan-400">Crawl</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleLang}
               className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
             >
               <Languages size={14} />
               {lang === 'en' ? 'EN / 中文' : '中文 / EN'}
             </button>
             <div className="hidden md:block text-xs text-slate-500 font-mono">
                v2.2.0 // Intelligence
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {t.subtitle}
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            {t.desc}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex">
             <button 
                onClick={() => setMode('web')}
                className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${mode === 'web' ? 'bg-slate-700 text-cyan-300 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <Globe size={16} /> {t.webMode}
             </button>
             <button 
                onClick={() => setMode('app')}
                className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${mode === 'app' ? 'bg-slate-700 text-purple-300 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <Smartphone size={16} /> {t.appMode}
             </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="max-w-xl mx-auto mb-6 relative z-10">
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${mode === 'web' ? 'from-cyan-500 to-blue-600' : 'from-purple-500 to-pink-600'} rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
            <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 shadow-2xl overflow-hidden p-1">
              <div className="pl-4 text-slate-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={mode === 'web' ? t.placeholderWeb : t.placeholderApp}
                className="flex-1 bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 px-4 py-3 outline-none"
                disabled={status === CrawlStatus.LOADING}
              />
              <button
                type="submit"
                disabled={status === CrawlStatus.LOADING || !inputValue.trim()}
                className={`${mode === 'web' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500'} disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2 px-6 rounded-md transition-all flex items-center gap-2`}
              >
                {status === CrawlStatus.LOADING ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t.scanning}
                  </>
                ) : (
                  <>
                    <PlayCircle size={18} />
                    {t.analyzeBtn}
                  </>
                )}
              </button>
            </div>
          </form>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
           <div className="max-w-xl mx-auto mb-16">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-2 px-1">
                 <Clock size={12} /> {t.recentSearches}
              </div>
              <div className="flex flex-wrap gap-2">
                 {history.map((item, idx) => (
                    <button 
                       key={idx}
                       onClick={() => {
                         setMode(item.mode);
                         handleAnalyze(item.query);
                       }}
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                       {item.mode === 'web' ? <Globe size={10} /> : <Smartphone size={10} />}
                       {item.query}
                       <ArrowRight size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                 ))}
              </div>
           </div>
        )}

        {/* Comparison Section */}
        {results.length > 1 && (
           <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4 text-slate-300">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-xs uppercase tracking-widest font-semibold">{t.compAnalysis}</span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>
              <ComparisonChart results={results} lang={lang} />
           </div>
        )}

        {/* Results Grid */}
        <div className="space-y-4">
          {results.length > 0 && (
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{t.resultsTitle}</h3>
                <span className="text-sm text-slate-500">{results.length} {t.items}</span>
             </div>
          )}
          
          {results.map((result) => (
            <div key={result.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AnalysisCard result={result} onRemove={removeResult} lang={lang} />
            </div>
          ))}

          {results.length === 0 && status !== CrawlStatus.LOADING && (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 text-slate-600">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-medium text-slate-400">{t.readyTitle}</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                {t.readyDesc}
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
