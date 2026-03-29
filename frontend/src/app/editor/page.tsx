'use client';

import React, { useState, useEffect, useRef } from 'react';

const INITIAL_LATEX = `\\documentclass[11pt, a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}

% -- Personal Identity --
\\begin{document}
\\name{Alex Thompson}
\\contact{San Francisco, CA \\textbullet\\ alex@thompson.design}

\\section{Summary}
Senior Product Designer with 8+ years specializing in complex
design systems and high-fidelity prototyping.

\\section{Experience}
\\job{Lead Designer}{Nebula Systems}{2020 -- Present}
\\begin{itemize}
      \\item Spearheaded the re-architecture of the core UI...
      \\item Reduced design-to-dev handoff time by 40\\%...
\\end{itemize}

\\end{document}`;

// --- Token colorizer ---
function colorizeLatex(line: string) {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const patterns = [
        { regex: /^(%.*$)/, className: "comment" },
        { regex: /^(\\[a-zA-Z]+)(\{)([^}]*)(\})/, types: ["command", "brace", "arg", "brace"] },
        { regex: /^(\\[a-zA-Z]+)(\[)([^\]]*)(\])/, types: ["command", "brace", "arg", "brace"] },
        { regex: /^(\\[a-zA-Z]+)/, className: "command" },
        { regex: /^([{}])/, className: "brace" },
        { regex: /^([^\\{}\n%]+)/, className: "plain" },
        { regex: /^(.)/, className: "plain" },
    ];

    while (remaining.length > 0) {
        let matched = false;
        for (const p of patterns) {
            const m = remaining.match(p.regex);
            if (m) {
                if (p.types) {
                    for (let i = 0; i < p.types.length; i++) {
                        if (m[i + 1] !== undefined) {
                            parts.push(
                                <span key={key++} className={`lt-${p.types[i]}`}>
                                    {m[i + 1]}
                                </span>
                            );
                        }
                    }
                    remaining = remaining.slice(m[0].length);
                } else {
                    const className = (p as any).className || "plain";
                    parts.push(
                        <span key={key++} className={`lt-${className}`}>
                            {m[1]}
                        </span>
                    );
                    remaining = remaining.slice(m[1].length);
                }
                matched = true;
                break;
            }
        }
        if (!matched) {
            parts.push(<span key={key++}>{remaining[0]}</span>);
            remaining = remaining.slice(1);
        }
    }
    return parts;
}

// --- Resume Preview ---
function ResumePreview() {
    return (
        <div className="bg-white w-full max-w-[560px] min-h-[720px] p-[48px_52px] shadow-[0_8px_48px_rgba(0,0,0,0.6)] rounded-[2px] text-[#111] font-serif">
            <div className="text-center mb-[18px]">
                <h1 className="text-[22px] font-bold tracking-[2px] mb-2">ALEX THOMPSON</h1>
                <div className="border-t-[1.5px] border-[#111] my-[6px]" />
                <p className="text-[10.5px] text-[#444] mt-[6px]">
                    San Francisco, CA • alex@thompson.design • 555-0123
                </p>
            </div>

            <section className="mb-4">
                <h2 className="text-[11.5px] font-bold tracking-[0.5px] mb-1">PROFESSIONAL SUMMARY</h2>
                <div className="border-t-[0.75px] border-[#bbb] my-[4px_0_10px]" />
                <p className="text-[10.5px] leading-[1.55] text-[#222]">
                    Senior Product Designer with 8+ years specializing in complex design
                    systems and high-fidelity prototyping. Proven track record of
                    delivering user-centric solutions for SaaS platforms.
                </p>
            </section>

            <section className="mb-4">
                <h2 className="text-[11.5px] font-bold tracking-[0.5px] mb-1">EXPERIENCE</h2>
                <div className="border-t-[0.75px] border-[#bbb] my-[4px_0_10px]" />

                <div className="mb-3.5">
                    <div className="flex justify-between items-baseline mb-[5px]">
                        <span className="text-[10.5px] font-bold">Lead Designer | Nebula Systems</span>
                        <span className="text-[10px] italic text-[#555]">2020 – Present</span>
                    </div>
                    <ul className="pl-[18px] text-[10.5px] leading-[1.55] list-disc">
                        <li className="mb-1">Spearheaded the re-architecture of the core UI framework resulting in a 25% increase in user retention.</li>
                        <li className="mb-1">Reduced design-to-dev handoff time by 40% through the implementation of a comprehensive design system.</li>
                        <li className="mb-1">Led cross-functional workshops to align product strategy with technical constraints.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default function ResumeEditor() {
    const [code, setCode] = useState(INITIAL_LATEX);
    const [jobId, setJobId] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [cursor, setCursor] = useState({ line: 14, col: 5 });
    const [compileTime, setCompileTime] = useState(0);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileDone, setCompileDone] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lines = code.split("\n");

    // ── Hydration ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem("optimized_resume");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.tex_source) setCode(data.tex_source);
                if (data.job_id) setJobId(data.job_id);
                // Backend returns full URL http://localhost:8000/output/...
                if (data.pdf_url) setPdfUrl(data.pdf_url);
            } catch (e) {
                console.error("Failed to parse stored resume data:", e);
            }
        }
    }, []);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        setCompileDone(false);
    };

    const handleKeyUp = (e: React.KeyboardEvent | React.MouseEvent) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const text = ta.value.substring(0, ta.selectionStart);
        const lineNum = text.split("\n").length;
        const lastNl = text.lastIndexOf("\n");
        const col = ta.selectionStart - lastNl;
        setCursor({ line: lineNum, col });
    };

    const handleCompile = async () => {
        if (!jobId) return;
        
        const startTime = Date.now();
        setIsCompiling(true);
        setCompileDone(false);

        try {
            const formData = new FormData();
            formData.append("job_id", jobId);
            formData.append("tex_source", code);

            const response = await fetch("http://localhost:8000/api/compile-resume", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            
            if (!response.ok) {
                const errorMsg = data.detail || "Compilation failed. Check your LaTeX syntax.";
                throw new Error(errorMsg);
            }
            
            // Refresh PDF with cache buster - data.pdf_url is full URL
            setPdfUrl(`${data.pdf_url}?t=${Date.now()}`);
            setCompileTime(Date.now() - startTime);
            setCompileDone(true);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("COMPILE_ERROR:", error);
            alert(error.message);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        }
    };

    return (
        <div className="bg-[#061a0b] min-h-screen relative overflow-hidden font-sans">
            {/* Background Glows (Synced with Home) */}
            <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0 opacity-60" 
                 style={{ background: 'radial-gradient(ellipse, rgba(0,255,90,0.06) 0%, transparent 70%)' }} />
            <div className="fixed top-[300px] -right-[200px] w-[500px] h-[500px] pointer-events-none z-0 opacity-40"
                 style={{ background: 'radial-gradient(circle, rgba(0,255,90,0.03) 0%, transparent 70%)' }} />

            
            <style jsx global>{`
                .lt-command { color: #00e65c; font-weight: 600; }
                .lt-brace   { color: #4aaa4a; }
                .lt-arg     { color: #00c050; }
                .lt-comment { color: #3a6a3a; font-style: italic; }
                .lt-plain   { color: #7ab87a; }
                
                .code-scroll::-webkit-scrollbar { width: 6px; }
                .code-scroll::-webkit-scrollbar-track { background: transparent; }
                .code-scroll::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 3px; }

                .analyzer-card {
                    background: linear-gradient(145deg, #0d1f0d, #0a180a);
                    border: 1px solid #1a3a1a;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    position: relative;
                    overflow: hidden;
                }

                .panel-content {
                    background: linear-gradient(145deg, #0b1a0b, #091409);
                    border: 1px solid #1a3a1a;
                    border-radius: 12px;
                }
            `}</style>

            <main className="pt-36 pb-10 px-10 h-screen flex flex-col items-center relative z-10">
                
                {/* Neural Workspace Container (Box Card) */}
                <div className="analyzer-card w-full max-w-[1400px] flex-1 flex flex-col p-6 pt-3 gap-5">
                    
                    {/* Main Split Content */}
                    <div className="flex-1 flex gap-5 overflow-hidden">
                        
                        {/* Left Card: Source Code */}
                        <div className="flex-1 flex flex-col gap-3 min-w-0">
                            <div className="flex items-center justify-between px-1 h-[44px]">
                                <span className="text-[14px] font-bold text-white/90 translate-y-[10%]">Source Editor</span>
                                
                                <button 
                                    onClick={handleCompile}
                                    disabled={isCompiling}
                                    className="group relative h-[38px] flex items-center justify-center bg-[#00e65c] rounded-lg px-6 transition-all duration-200 hover:bg-[#00ff66] disabled:opacity-50 outline-none border-none cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a1a0a"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                        <span className="text-[11px] font-black text-[#0a1a0a] tracking-[0.05em] uppercase translate-y-[2%]">
                                            {isCompiling ? "Compiling..." : "Compile"}
                                        </span>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="panel-content flex-1 flex flex-col relative overflow-hidden group">
                                <div className="code-scroll flex-1 overflow-auto flex py-4 relative">
                                    {/* Line Numbers */}
                                    <div className="min-w-[48px] px-3.5 flex flex-col shrink-0 select-none border-r border-[#1a3a1a]">
                                        {lines.map((_, i) => (
                                            <div key={i} className="font-mono text-[13px] leading-[1.75] text-[#2a4a2a] text-right">{i + 1}</div>
                                        ))}
                                    </div>

                                    {/* Code Area */}
                                    <div className="flex-1 relative pl-5">
                                        {lines.map((line, i) => (
                                            <div key={i} className="font-mono text-[13px] leading-[1.75] whitespace-pre pr-5 text-[#7ab87a]">
                                                {colorizeLatex(line)}
                                            </div>
                                        ))}

                                        <textarea
                                            ref={textareaRef}
                                            value={code}
                                            onChange={handleTextareaChange}
                                            onKeyUp={handleKeyUp}
                                            onMouseUp={handleKeyUp}
                                            spellCheck={false}
                                            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none font-mono text-[13px] leading-[1.75] text-transparent caret-[#00e65c] p-0 pl-5 pr-5 z-10 overflow-hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Card: PDF Preview */}
                        <div className="w-1/2 flex flex-col gap-3 min-w-0">
                            <div className="flex items-center justify-between px-1 h-[44px]">
                                <span className="text-[14px] font-bold text-white/90 translate-y-[10%]">Output Preview</span>

                                <button 
                                    onClick={handleDownload}
                                    disabled={!pdfUrl}
                                    className="group relative h-[38px] flex items-center justify-center bg-[#00e65c] rounded-lg px-6 transition-all duration-200 hover:bg-[#00ff66] outline-none border-none cursor-pointer disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a1a0a" stroke="#0a1a0a" strokeWidth="0.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        <span className="text-[11px] font-black text-[#0a1a0a] tracking-[0.05em] uppercase translate-y-[2%]">Download PDF</span>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="panel-content flex-1 flex flex-col overflow-hidden bg-[#0a150a] relative">
                                {isCompiling && (
                                    <div className="absolute inset-0 z-20 bg-[#061a0b]/80 flex flex-col items-center justify-center gap-4">
                                        <div className="w-12 h-12 border-2 border-[#00e65c] border-t-transparent rounded-full animate-spin" />
                                        <span className="font-mono text-[12px] text-[#00e65c] tracking-widest">SYNCHRONIZING...</span>
                                    </div>
                                )}
                                
                                {pdfUrl ? (
                                    <iframe 
                                        src={`${pdfUrl}${pdfUrl.includes("#") ? "" : "#toolbar=0&navpanes=0&scrollbar=0"}`} 
                                        className="w-full h-full border-none bg-white"
                                        title="Resume Preview"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
                                        <div className="w-12 h-12 border-2 border-[#1a3a1a] rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 border border-[#1a3a1a] rotate-45" />
                                        </div>
                                        <span className="font-mono text-[10px] text-[#3a7a3a] tracking-widest">NO ASSETS LOADED</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Workspace Footer Row */}
                    <div className="h-[28px] border-t border-[#1a3a1a]/50 flex items-center justify-between px-2 pt-2 shrink-0">
                        <div className="flex items-center gap-6">
                            <span className="font-mono text-[10px] text-[#3a7a3a] tracking-wider uppercase">L: <span className="text-[#5aaa5a]">{cursor.line}</span> | C: <span className="text-[#5aaa5a]">{cursor.col}</span></span>
                            <span className="font-mono text-[10px] text-[#3a7a3a] tracking-wider uppercase">Status: <span className={compileDone ? "text-[#00e65c]" : "text-yellow-500"}>{compileDone ? "SYNCED" : "DIVERGED"}</span></span>
                        </div>
                        <div className="font-mono text-[10px] text-[#3a9a3a] tracking-widest">
                            {compileDone && compileTime > 0 && `✓ Compiled in ${compileTime}ms`}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
