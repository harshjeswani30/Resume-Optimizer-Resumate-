import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const customStyles = {
  editorScrollbar: `
    .editor-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .editor-scroll::-webkit-scrollbar-track { background: transparent; }
    .editor-scroll::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
    .editor-scroll::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
    .preview-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .preview-scroll::-webkit-scrollbar-track { background: transparent; }
    .preview-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .preview-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
    }
    .ai-btn-glow:hover { animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  `
};

const LineNumbers = ({ count }) => (
  <div className="w-12 flex flex-col items-end py-4 pr-3 font-mono text-sm leading-6 select-none shrink-0 border-r border-[#333]" style={{ background: '#1e1e1e', color: '#858585' }}>
    {Array.from({ length: count }, (_, i) => (
      <span key={i + 1}>{i + 1}</span>
    ))}
  </div>
);

const CodeLine = ({ children }) => <div>{children}</div>;

const EditorContent = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="flex-1 overflow-auto editor-scroll p-4 font-mono text-sm leading-6 whitespace-pre outline-none" style={{ color: '#d4d4d4' }} contentEditable={false} spellCheck={false}>
      {content}
    </div>
  );
};

const Header = ({ activeNav, setActiveNav }) => {
  const navItems = ['Templates', 'Cover Letters', 'Pricing'];
  return (
    <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-2 text-indigo-600">
        <i className="ri-article-fill text-2xl"></i>
        <span className="font-bold text-xl tracking-tight text-slate-900">ResuMate<span className="text-indigo-600">.ai</span></span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveNav('optimizer')}
          className={`flex items-center gap-1 transition-colors ${activeNav === 'optimizer' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
        >
          <i className="ri-magic-line"></i> Optimizer
        </button>
        {navItems.map(item => (
          <button
            key={item}
            onClick={() => setActiveNav(item.toLowerCase().replace(' ', '-'))}
            className={`transition-colors ${activeNav === item.toLowerCase().replace(' ', '-') ? 'text-indigo-600' : 'hover:text-slate-900'}`}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-900 transition-colors">
          <i className="ri-settings-3-line text-xl"></i>
        </button>
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">AM</div>
          Alex M.
        </button>
      </div>
    </header>
  );
};

const UploadSection = ({ jobDescription, setJobDescription, onOptimize, isOptimizing, uploadedFile, setUploadedFile }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 shrink-0 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <i className="ri-file-text-line text-indigo-500"></i> Current Resume
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl bg-slate-50 transition-colors h-28 flex flex-col items-center justify-center cursor-pointer group ${isDragging ? 'bg-indigo-50 border-indigo-300' : 'border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'}`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
          {uploadedFile ? (
            <>
              <i className="ri-file-check-line text-2xl text-indigo-500 mb-1"></i>
              <p className="text-sm text-indigo-600 font-medium">{uploadedFile}</p>
              <p className="text-xs text-slate-400">Click to replace</p>
            </>
          ) : (
            <>
              <i className={`ri-upload-cloud-2-line text-2xl mb-1 transition-colors ${isDragging ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'}`}></i>
              <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'}`}>Upload PDF or DOCX</p>
              <p className="text-xs text-slate-400">or drag and drop here</p>
            </>
          )}
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <i className="ri-briefcase-line text-indigo-500"></i> Target Job Description
          </label>
          <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Paste URL instead?</button>
        </div>
        <textarea
          className="w-full h-28 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none outline-none"
          placeholder="Paste the job description here. Our AI will analyze keywords, required skills, and tone to optimize your resume..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="lg:col-span-3 flex flex-col justify-end">
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3 text-sm text-indigo-800">
            <i className="ri-sparkling-fill text-yellow-500"></i>
            <span className="font-medium">{isOptimizing ? 'Optimizing...' : 'Ready to optimize'}</span>
          </div>
          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="ai-btn-glow w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <>
                <i className="ri-loader-4-line text-lg animate-spin"></i>
                Optimizing...
              </>
            ) : (
              <>
                <i className="ri-magic-line text-lg"></i>
                Optimize with AI
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

const EditorPanel = ({ onCompile, isCompiling }) => {
  const latexContent = `% Resume optimized for Senior Frontend Engineer role
\\documentclass[10pt, letterpaper]{article}

\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}

% Formatting sections
\\titleformat{\\section}{\\Large\\bfseries\\uppercase}{}
{0em}{}[\\titlerule]

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{Alex Morgan}} \\\\
    \\vspace{2mm}
    alex.morgan@email.com | (555) 123-4567 | San Francisco, CA \\\\
    \\href{https://linkedin.com/in/alexm}{linkedin.com/in/alexm} |
    \\href{https://github.com/alexm}{github.com/alexm}
\\end{center}

\\section*{Professional Summary}
Results-driven Senior Frontend Engineer with 6+ years of experience architecting scalable user interfaces.

\\section*{Experience}
\\noindent
\\textbf{Senior Frontend Engineer} \\hfill Jan 2021 -- Present \\\\
\\textit{TechFlow Solutions} \\hfill San Francisco, CA
\\begin{itemize}[leftmargin=*]
    \\item Architected and spearheaded the migration of a legacy monolithic dashboard to a modern React/TypeScript stack, improving rendering performance by 40\\%.
    \\item Implemented a custom UI component library using Tailwind CSS and Storybook, reducing design-to-code time by 30\\%.
    \\item Mentored 4 junior developers through regular pair programming and code reviews.
\\end{itemize}`;

  const lines = latexContent.split('\n');

  const renderLine = (line, idx) => {
    if (line.trim().startsWith('%')) {
      return <div key={idx} style={{ color: '#6a9955' }}>{line}</div>;
    }
    const parts = [];
    let remaining = line;
    let partIdx = 0;

    const tokenize = (text) => {
      const result = [];
      let i = 0;
      let current = '';
      while (i < text.length) {
        if (text[i] === '\\') {
          if (current) { result.push({ type: 'text', value: current }); current = ''; }
          let cmd = '\\';
          i++;
          while (i < text.length && /[a-zA-Z*]/.test(text[i])) { cmd += text[i]; i++; }
          result.push({ type: 'cmd', value: cmd });
        } else if (text[i] === '{' || text[i] === '}' || text[i] === '[' || text[i] === ']') {
          if (current) { result.push({ type: 'text', value: current }); current = ''; }
          result.push({ type: 'bracket', value: text[i] });
          i++;
        } else {
          current += text[i];
          i++;
        }
      }
      if (current) result.push({ type: 'text', value: current });
      return result;
    };

    const tokens = tokenize(line);
    return (
      <div key={idx}>
        {tokens.map((token, ti) => {
          if (token.type === 'cmd') return <span key={ti} style={{ color: token.value === '\\begin' || token.value === '\\end' || token.value === '\\item' || token.value === '\\section*' || token.value === '\\documentclass' || token.value === '\\usepackage' ? '#c586c0' : '#569cd6' }}>{token.value}</span>;
          if (token.type === 'bracket') return <span key={ti} style={{ color: '#ffd700' }}>{token.value}</span>;
          return <span key={ti} style={{ color: '#d4d4d4' }}>{token.value}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="w-full lg:w-[45%] flex flex-col rounded-2xl shadow-lg overflow-hidden border border-slate-800" style={{ background: '#1e1e1e' }}>
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#404040] shrink-0" style={{ background: '#2d2d2d' }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }}></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-[#404040]" style={{ background: '#1e1e1e' }}>
            <i className="ri-file-code-line text-slate-400 text-sm"></i>
            <span className="text-xs text-slate-300 font-mono">resume_optimized.tex</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-white transition-colors p-1.5 rounded hover:bg-[#404040]" title="Undo">
            <i className="ri-arrow-go-back-line"></i>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors p-1.5 rounded hover:bg-[#404040]" title="Redo">
            <i className="ri-arrow-go-forward-line"></i>
          </button>
          <div className="w-px h-4 bg-[#404040] mx-1"></div>
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className="text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 transition-colors disabled:opacity-70"
            style={{ background: isCompiling ? '#0a4f7a' : '#0e639c' }}
            onMouseEnter={e => !isCompiling && (e.currentTarget.style.background = '#1177bb')}
            onMouseLeave={e => !isCompiling && (e.currentTarget.style.background = '#0e639c')}
          >
            {isCompiling ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-play-fill"></i>}
            {isCompiling ? ' Compiling...' : ' Compile'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-12 flex flex-col items-end py-4 pr-3 font-mono text-sm leading-6 select-none shrink-0 border-r border-[#333]" style={{ background: '#1e1e1e', color: '#858585' }}>
          {lines.map((_, i) => <span key={i + 1}>{i + 1}</span>)}
        </div>
        <div className="flex-1 overflow-auto editor-scroll p-4 font-mono text-sm leading-6 outline-none" style={{ color: '#d4d4d4' }}>
          {lines.map((line, i) => renderLine(line, i))}
        </div>
      </div>

      <div className="h-6 flex items-center px-3 text-white text-[11px] font-sans shrink-0 justify-between" style={{ background: '#007acc' }}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><i className="ri-error-warning-line"></i> 0</span>
          <span className="flex items-center gap-1"><i className="ri-check-double-line"></i> AI Synced</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 24, Col 12</span>
          <span>UTF-8</span>
          <span>LaTeX</span>
        </div>
      </div>
    </div>
  );
};

const ResumePreview = ({ matchScore, isOptimized }) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 60));

  const handleDownload = () => {
    alert('PDF download initiated! (In a real app, this would generate and download the PDF.)');
  };

  return (
    <div className="w-full lg:w-[55%] flex flex-col bg-slate-200/80 rounded-2xl shadow-inner border border-slate-300 relative overflow-hidden">
      <div className="h-14 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-5 shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
            <i className="ri-eye-line text-lg"></i>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Live Preview</h2>
            <p className="text-[11px] text-slate-500">Updates automatically when code changes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium text-indigo-700">
            <i className="ri-checkbox-circle-fill text-indigo-500"></i> Match Score: {matchScore}%
          </div>
          <div className="h-6 w-px bg-slate-300"></div>
          <button onClick={handleZoomOut} className="text-slate-500 hover:text-slate-800 transition-colors p-2" title="Zoom Out">
            <i className="ri-zoom-out-line"></i>
          </button>
          <span className="text-xs font-medium text-slate-600">{zoom}%</span>
          <button onClick={handleZoomIn} className="text-slate-500 hover:text-slate-800 transition-colors p-2" title="Zoom In">
            <i className="ri-zoom-in-line"></i>
          </button>
          <button
            onClick={handleDownload}
            className="ml-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <i className="ri-download-2-line"></i> PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto preview-scroll p-6 md:p-10 flex justify-center bg-slate-200/50">
        <div
          className="bg-white shadow-xl shrink-0 p-12 font-serif text-slate-900 mx-auto relative group"
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            marginBottom: zoom < 100 ? `-${(100 - zoom) * 2.97}mm` : '0'
          }}
        >
          <div
            className="absolute -left-4 top-48 w-3 h-12 bg-indigo-500 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md cursor-help"
            title="AI optimized this bullet point to match 'scalable user interfaces' from JD"
          >
            <i className="ri-sparkling-fill text-white text-[10px]"></i>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-2 font-sans">Alex Morgan</h1>
            <div className="text-sm text-slate-700 flex justify-center gap-3 items-center">
              <span>alex.morgan@email.com</span>
              <span>•</span>
              <span>(555) 123-4567</span>
              <span>•</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="text-sm text-slate-700 flex justify-center gap-3 items-center mt-1">
              <a href="#" className="text-blue-800 hover:underline">linkedin.com/in/alexm</a>
              <span>•</span>
              <a href="#" className="text-blue-800 hover:underline">github.com/alexm</a>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 font-sans tracking-wide">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-justify">
              Results-driven Senior Frontend Engineer with 6+ years of experience architecting scalable user interfaces. Deep expertise in React, TypeScript, and modern state management. Proven track record of leading UI teams, optimizing web performance, and delivering complex applications in fast-paced environments.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 font-sans tracking-wide">Experience</h2>

            <div className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-md">Senior Frontend Engineer</h3>
                <span className="text-sm font-medium">Jan 2021 – Present</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="italic text-sm text-slate-700">TechFlow Solutions</h4>
                <span className="text-sm text-slate-700">San Francisco, CA</span>
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1.5 marker:text-slate-400">
                <li className="bg-indigo-50/50 -ml-2 pl-2 rounded">Architected and spearheaded the migration of a legacy monolithic dashboard to a modern React/TypeScript stack, improving rendering performance by 40%.</li>
                <li>Implemented a custom UI component library using Tailwind CSS and Storybook, adopted by 3 cross-functional teams, reducing design-to-code time by 30%.</li>
                <li>Mentored 4 junior developers through regular pair programming and comprehensive code reviews, establishing best practices for state management and testing.</li>
                {isOptimized && <li>Integrated automated CI/CD pipelines using GitHub Actions, reducing deployment time from hours to under 15 minutes.</li>}
              </ul>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-md">Frontend Developer</h3>
                <span className="text-sm font-medium">Jun 2018 – Dec 2020</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="italic text-sm text-slate-700">Creative Web Agency</h4>
                <span className="text-sm text-slate-700">Austin, TX</span>
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1.5 marker:text-slate-400">
                <li>Developed responsive, pixel-perfect web applications for high-profile clients using React, Redux, and SCSS.</li>
                <li>Collaborated closely with UX/UI designers to translate Figma wireframes into interactive, accessible web components (WCAG 2.1 AA compliant).</li>
                <li>Optimized existing codebase, reducing bundle size by 25% through lazy loading and code splitting.</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 font-sans tracking-wide">Technical Skills</h2>
            <div className="text-sm">
              <p className="mb-1"><span className="font-bold">Languages:</span> JavaScript (ES6+), TypeScript, HTML5, CSS3/SASS, Python (Basic)</p>
              <p className="mb-1 bg-indigo-50/50 rounded inline-block w-full"><span className="font-bold">Frameworks & Libraries:</span> React.js, Next.js, Redux, Tailwind CSS, Material UI, Jest, React Testing Library</p>
              <p><span className="font-bold">Tools & Practices:</span> Git, Webpack, Vite, CI/CD, Agile/Scrum, Responsive Design, Web Performance Optimization</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 font-sans tracking-wide">Education</h2>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-md">Bachelor of Science in Computer Science</h3>
              <span className="text-sm font-medium">May 2018</span>
            </div>
            <div className="flex justify-between items-baseline">
              <h4 className="italic text-sm text-slate-700">University of Texas at Austin</h4>
              <span className="text-sm text-slate-700">GPA: 3.8/4.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptimizerPage = () => {
  const [jobDescription, setJobDescription] = useState('We are looking for a Senior Frontend Engineer with deep expertise in React, TypeScript, and modern CSS frameworks (Tailwind). The ideal candidate has experience leading UI architecture for scalable web applications, optimizing performance, and mentoring junior developers. Experience with Node.js and CI/CD pipelines is a plus.');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isOptimized, setIsOptimized] = useState(true);
  const [matchScore, setMatchScore] = useState(92);

  const handleOptimize = () => {
    if (!uploadedFile && !jobDescription.trim()) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
      setMatchScore(prev => Math.min(prev + 2, 99));
    }, 2500);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => setIsCompiling(false), 1500);
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden max-w-[1920px] mx-auto w-full">
      <UploadSection
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        onOptimize={handleOptimize}
        isOptimizing={isOptimizing}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />
      <section className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <EditorPanel onCompile={handleCompile} isCompiling={isCompiling} />
        <ResumePreview matchScore={matchScore} isOptimized={isOptimized} />
      </section>
    </main>
  );
};

const PlaceholderPage = ({ title, icon }) => (
  <main className="flex-1 flex items-center justify-center p-6">
    <div className="text-center">
      <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i className={`${icon} text-4xl text-indigo-500`}></i>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">This section is coming soon. Navigate to the Optimizer to get started with your resume.</p>
    </div>
  </main>
);

const App = () => {
  const [activeNav, setActiveNav] = useState('optimizer');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = customStyles.editorScrollbar;
    style.textContent += `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Merriweather:wght@300;400;700&display=swap');
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderPage = () => {
    switch (activeNav) {
      case 'optimizer':
        return <OptimizerPage />;
      case 'templates':
        return <PlaceholderPage title="Resume Templates" icon="ri-layout-grid-line" />;
      case 'cover-letters':
        return <PlaceholderPage title="Cover Letters" icon="ri-mail-open-line" />;
      case 'pricing':
        return <PlaceholderPage title="Pricing Plans" icon="ri-price-tag-3-line" />;
      default:
        return <OptimizerPage />;
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 h-screen w-screen flex flex-col font-sans overflow-hidden">
      <Header activeNav={activeNav} setActiveNav={setActiveNav} />
      {renderPage()}
    </div>
  );
};

export default App;