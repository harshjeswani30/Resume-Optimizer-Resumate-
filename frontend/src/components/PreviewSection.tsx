'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface PreviewSectionProps {
  result: {
    pdf_url: string;
    tex_source: string;
    optimized_score: number;
    initial_score: number;
    improvement: number;
    report: {
      matching_keywords: string[];
      missing_keywords: string[];
    };
  };
  onTexChange?: (newTex: string) => void;
  onRecompile?: () => void;
  onBack?: () => void;
  isCompiling?: boolean;
}

export default function PreviewSection({ 
  result,
  onTexChange, 
  onRecompile,
  onBack,
  isCompiling = false
}: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'latex' | 'report'>('pdf');
  const [pdfUrl, setPdfUrl] = useState(result.pdf_url);

  React.useEffect(() => {
    setPdfUrl(`${result.pdf_url}?t=${Date.now()}`);
  }, [result.pdf_url]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 w-full">
      {/* Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/20 border border-white/5 rounded-[20px] p-8 flex flex-col items-center justify-center text-center group hover:border-[#00ff5a]/30 transition-all duration-500">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Original Score</span>
          <div className="text-4xl font-black text-white/20 mb-1">{result.initial_score}%</div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white/20" style={{ width: `${result.initial_score}%` }}></div>
          </div>
        </div>

        <div className="bg-[#00ff5a0a] border border-[#00ff5a33] rounded-[20px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#00ff5a]/80 transition-all duration-500 shadow-[0_0_40px_rgba(0,255,100,0.1)]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff5a] to-transparent opacity-50"></div>
          <span className="text-[10px] font-mono text-[#00ff5a] uppercase tracking-[0.2em] mb-4">Optimized Score</span>
          <div className="text-6xl font-black text-[#00ff5a] mb-2 drop-shadow-[0_0_15px_#00ff5a66]">{result.optimized_score}%</div>
          <div className="w-full h-2 bg-[#00ff5a1a] rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff5a] shadow-[0_0_15px_#00ff5a]" style={{ width: `${result.optimized_score}%` }}></div>
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 rounded-[20px] p-8 flex flex-col items-center justify-center text-center group hover:border-[#00ff5a]/30 transition-all duration-500">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Improvement</span>
          <div className="text-4xl font-black text-[#00ff5a] mb-1">+{result.improvement}%</div>
          <div className="text-[10px] font-mono text-[#00ff5a]/60 tracking-widest uppercase">ATS Optimization Complete</div>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex flex-col h-[calc(100vh-420px)] min-h-[500px] bg-gradient-to-br from-[#1a7a3a] via-[#0f5525] to-[#0a3d18] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10">
        
        {/* Header with Back Button and Tabs */}
        <div className="flex items-center justify-between px-8 py-4 bg-black/20 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-[#00ff5a] transition-all uppercase group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
                </svg>
                Back to Optimizer
              </button>
            )}
            <div className="w-px h-4 bg-white/10" />
            <div className="flex gap-2">
              {[
                { id: 'pdf', label: 'PDF Preview' },
                { id: 'latex', label: 'LaTeX Source' },
                { id: 'report', label: 'ATS Analysis' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase transition-all
                    ${activeTab === tab.id 
                      ? 'bg-white text-[#0a3d18] shadow-lg' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'latex' && onRecompile && (
              <button
                onClick={onRecompile}
                disabled={isCompiling}
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isCompiling ? 'Compiling...' : 'Sync Changes'}
                <svg className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <a
              href={result.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-2.5 bg-white text-[#0e4a1f] rounded-xl text-xs font-black tracking-widest uppercase hover:bg-[#e8f5e9] transition-all flex items-center gap-2"
              download
            >
              Export PDF
            </a>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-black/20 overflow-hidden">
          {activeTab === 'pdf' ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&view=FitH`}
              className="w-full h-full border-none invert-[0.05] hue-rotate-[100deg]"
              title="Resume PDF Preview"
            />
          ) : activeTab === 'latex' ? (
            <Editor
              height="100%"
              defaultLanguage="latex"
              theme="vs-dark"
              value={result.tex_source}
              onChange={(value) => onTexChange?.(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 }
              }}
            />
          ) : (
            <div className="p-12 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#00ff5a1a]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[#00ff5a] font-black tracking-widest text-[11px] uppercase mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ff5a]"></span>
                    Matching Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.report.matching_keywords.map((kw, i) => (
                      <span key={i} className="px-4 py-2 bg-[#00ff5a1a] border border-[#00ff5a33] text-[#00ff5a] rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white/40 font-black tracking-widest text-[11px] uppercase mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-white/10"></span>
                    Missing Opportunities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.report.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
