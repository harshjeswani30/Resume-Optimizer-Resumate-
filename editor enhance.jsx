import { useState, useEffect, useRef } from "react";

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

// ── Token colorizer ───────────────────────────────────────────────────────────
function colorizeLatex(line) {
    const parts = [];
    let remaining = line;
    let key = 0;

    // Patterns in priority order
    const patterns = [
        // Comment
        { regex: /^(%.*$)/, className: "comment" },
        // \command{...} — command + braced arg
        {
            regex: /^(\\[a-zA-Z]+)(\{)([^}]*)(\})/,
            types: ["command", "brace", "arg", "brace"],
        },
        // \command[ ...
        {
            regex: /^(\\[a-zA-Z]+)(\[)([^\]]*)(\])/,
            types: ["command", "brace", "arg", "brace"],
        },
        // lone \command
        { regex: /^(\\[a-zA-Z]+)/, className: "command" },
        // lone { or }
        { regex: /^([{}])/, className: "brace" },
        // plain text chunk up to next special char
        { regex: /^([^\\{}\n%]+)/, className: "plain" },
        // fallback single char
        { regex: /^(.)/, className: "plain" },
    ];

    while (remaining.length > 0) {
        let matched = false;
        for (const p of patterns) {
            const m = remaining.match(p.regex);
            if (m) {
                if (p.types) {
                    // multi-group match
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
                    parts.push(
                        <span key={key++} className={`lt-${p.className}`}>
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

// ── Resume Preview ────────────────────────────────────────────────────────────
function ResumePreview() {
    return (
        <div className="resume-paper">
            <div className="resume-header">
                <h1 className="resume-name">ALEX THOMPSON</h1>
                <div className="resume-rule" />
                <p className="resume-contact">
                    San Francisco, CA • alex@thompson.design • 555-0123
                </p>
            </div>

            <section className="resume-section">
                <h2 className="resume-section-title">PROFESSIONAL SUMMARY</h2>
                <div className="resume-rule-thin" />
                <p className="resume-body">
                    Senior Product Designer with 8+ years specializing in complex design
                    systems and high-fidelity prototyping. Proven track record of
                    delivering user-centric solutions for SaaS platforms.
                </p>
            </section>

            <section className="resume-section">
                <h2 className="resume-section-title">EXPERIENCE</h2>
                <div className="resume-rule-thin" />

                <div className="resume-job">
                    <div className="resume-job-header">
                        <span className="resume-job-title">
                            Lead Designer | Nebula Systems
                        </span>
                        <span className="resume-job-date">2020 – Present</span>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Spearheaded the re-architecture of the core UI framework resulting
                            in a 25% increase in user retention.
                        </li>
                        <li>
                            Reduced design-to-dev handoff time by 40% through the
                            implementation of a comprehensive design system.
                        </li>
                        <li>
                            Led cross-functional workshops to align product strategy with
                            technical constraints.
                        </li>
                    </ul>
                </div>

                <div className="resume-job">
                    <div className="resume-job-header">
                        <span className="resume-job-title">
                            Product Designer | Flux Media
                        </span>
                        <span className="resume-job-date">2017 – 2020</span>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Designed and launched the mobile application which gained 500k+
                            downloads in the first year.
                        </li>
                        <li>
                            Established internal user research protocols to validate feature
                            prototypes.
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumeEditor() {
    const [code, setCode] = useState(INITIAL_LATEX);
    const [cursor, setCursor] = useState({ line: 14, col: 5 });
    const [compileTime] = useState(482);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileDone, setCompileDone] = useState(true);
    const textareaRef = useRef(null);
    const lines = code.split("\n");

    const handleTextareaChange = (e) => {
        setCode(e.target.value);
    };

    const handleKeyUp = (e) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const text = ta.value.substring(0, ta.selectionStart);
        const lineNum = text.split("\n").length;
        const lastNl = text.lastIndexOf("\n");
        const col = ta.selectionStart - lastNl;
        setCursor({ line: lineNum, col });
    };

    const handleCompile = () => {
        setIsCompiling(true);
        setCompileDone(false);
        setTimeout(() => {
            setIsCompiling(false);
            setCompileDone(true);
        }, 1800);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0f0a;
          font-family: 'Inter', sans-serif;
        }

        /* ── shell ── */
        .editor-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-height: 600px;
          background: #0d1a0d;
          color: #fff;
          overflow: hidden;
        }

        /* ── top bar ── */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0b150b;
          border-bottom: 1px solid #1a3a1a;
          padding: 0 20px;
          height: 52px;
          flex-shrink: 0;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-tab {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #5a9a5a;
          letter-spacing: 0.5px;
          padding: 6px 14px;
          border-bottom: 2px solid #00e65c;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-import {
          display: flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1px solid #2a5a2a;
          border-radius: 8px;
          padding: 8px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-import:hover { border-color: #00e65c; background: rgba(0,230,92,0.05); }

        .btn-compile {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #00e65c;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a1a0a;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 20px rgba(0,230,92,0.3);
        }
        .btn-compile:hover { background: #00ff66; box-shadow: 0 0 30px rgba(0,230,92,0.5); }
        .btn-compile:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── right panel top bar ── */
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .preview-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #5a9a5a;
          letter-spacing: 1px;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #2a5a2a;
          border-radius: 7px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          transition: all 0.2s;
          color: #ffffff;
        }
        .btn-icon:hover { border-color: #00e65c; background: rgba(0,230,92,0.05); }

        .btn-download {
          display: flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1px solid #2a5a2a;
          border-radius: 8px;
          padding: 8px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-download:hover { border-color: #00e65c; background: rgba(0,230,92,0.05); }

        /* ── main split pane ── */
        .main-area {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* ── LEFT: code editor ── */
        .editor-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #1a3a1a;
          overflow: hidden;
          position: relative;
        }

        .code-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          padding: 16px 0;
          position: relative;
        }

        .code-scroll::-webkit-scrollbar { width: 6px; }
        .code-scroll::-webkit-scrollbar-track { background: transparent; }
        .code-scroll::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 3px; }

        /* line numbers */
        .line-numbers {
          min-width: 48px;
          padding: 0 12px 0 16px;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex-shrink: 0;
          user-select: none;
        }

        .line-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.75;
          color: #2a4a2a;
          text-align: right;
        }

        /* code lines overlay */
        .code-lines {
          flex: 1;
          position: relative;
        }

        .code-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.75;
          white-space: pre;
          padding-right: 20px;
        }

        /* hidden textarea for editing */
        .code-textarea {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.75;
          color: transparent;
          caret-color: #00e65c;
          padding: 0;
          padding-right: 20px;
          z-index: 2;
          overflow: hidden;
        }

        /* ── LaTeX token colors ── */
        .lt-command { color: #00e65c; font-weight: 600; }
        .lt-brace   { color: #4aaa4a; }
        .lt-arg     { color: #00c050; }
        .lt-comment { color: #3a6a3a; font-style: italic; }
        .lt-plain   { color: #7ab87a; }

        /* ── RIGHT: preview pane ── */
        .preview-pane {
          width: 50%;
          display: flex;
          flex-direction: column;
          background: #0b150b;
          overflow: hidden;
        }

        .preview-scroll {
          flex: 1;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 32px 24px;
        }

        .preview-scroll::-webkit-scrollbar { width: 6px; }
        .preview-scroll::-webkit-scrollbar-track { background: transparent; }
        .preview-scroll::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 3px; }

        /* ── Resume Paper ── */
        .resume-paper {
          background: #ffffff;
          width: 100%;
          max-width: 560px;
          min-height: 720px;
          padding: 48px 52px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.6);
          border-radius: 2px;
          color: #111;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-header {
          text-align: center;
          margin-bottom: 18px;
        }

        .resume-name {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #111;
          margin-bottom: 8px;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-rule {
          border: none;
          border-top: 1.5px solid #111;
          margin: 6px 0;
        }

        .resume-rule-thin {
          border: none;
          border-top: 0.75px solid #bbb;
          margin: 4px 0 10px;
        }

        .resume-contact {
          font-size: 10.5px;
          color: #444;
          margin-top: 6px;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-section {
          margin-bottom: 16px;
        }

        .resume-section-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #111;
          margin-bottom: 4px;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-body {
          font-size: 10.5px;
          line-height: 1.55;
          color: #222;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-job {
          margin-bottom: 14px;
        }

        .resume-job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 5px;
        }

        .resume-job-title {
          font-size: 10.5px;
          font-weight: 700;
          color: #111;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-job-date {
          font-size: 10px;
          font-style: italic;
          color: #555;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-list {
          padding-left: 18px;
          font-size: 10.5px;
          line-height: 1.55;
          color: #222;
          font-family: 'Times New Roman', Times, serif;
        }

        .resume-list li {
          margin-bottom: 4px;
        }

        /* ── bottom status bar ── */
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #091209;
          border-top: 1px solid #1a3a1a;
          padding: 0 20px;
          height: 32px;
          flex-shrink: 0;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #3a7a3a;
          letter-spacing: 0.5px;
        }

        .status-item span {
          color: #5aaa5a;
        }

        .status-right {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #3a9a3a;
          letter-spacing: 0.5px;
        }

        /* ── compile animation ── */
        @keyframes pulse-green {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .compiling { animation: pulse-green 0.8s ease-in-out infinite; }

        /* ── top bar divider between left and right sections ── */
        .top-bar-divider {
          width: 1px;
          height: 100%;
          background: #1a3a1a;
        }
      `}</style>

            <div className="editor-shell">
                {/* ══ TOP BAR ══════════════════════════════════════════════════════ */}
                <div className="top-bar">
                    {/* LEFT section */}
                    <div className="top-bar-left">
                        <span className="file-tab">RESUME_V3_MASTER.TEX</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Import */}
                        <button className="btn-import">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Import
                        </button>

                        {/* Compile PDF */}
                        <button
                            className="btn-compile"
                            onClick={handleCompile}
                            disabled={isCompiling}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            {isCompiling ? "Compiling..." : "Compile PDF"}
                        </button>

                        <div className="top-bar-divider" />

                        {/* LIVE PREVIEW label */}
                        <span className="preview-label">LIVE PREVIEW</span>

                        {/* Grid icon */}
                        <button className="btn-icon">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                            </svg>
                        </button>

                        {/* Download */}
                        <button className="btn-download">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download
                        </button>
                    </div>
                </div>

                {/* ══ MAIN AREA ═════════════════════════════════════════════════════ */}
                <div className="main-area">
                    {/* ── LEFT: LaTeX Editor ── */}
                    <div className="editor-pane">
                        <div className="code-scroll">
                            {/* Line numbers */}
                            <div className="line-numbers">
                                {lines.map((_, i) => (
                                    <div key={i} className="line-num">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Highlighted code + invisible textarea */}
                            <div className="code-lines">
                                {/* Syntax-highlighted display */}
                                {lines.map((line, i) => (
                                    <div key={i} className="code-line">
                                        {colorizeLatex(line)}
                                    </div>
                                ))}

                                {/* Editable textarea on top */}
                                <textarea
                                    ref={textareaRef}
                                    className="code-textarea"
                                    value={code}
                                    onChange={handleTextareaChange}
                                    onKeyUp={handleKeyUp}
                                    onClick={handleKeyUp}
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Live Preview ── */}
                    <div className="preview-pane">
                        <div className="preview-scroll">
                            <ResumePreview />
                        </div>
                    </div>
                </div>

                {/* ══ STATUS BAR ═══════════════════════════════════════════════════ */}
                <div className="status-bar">
                    <div className="status-left">
                        <span className="status-item">
                            ⬡ ENGINE: <span>LATEX_V3.1_STABLE</span>
                        </span>
                        <span className="status-item">
                            LINE: <span>{cursor.line}</span>
                        </span>
                        <span className="status-item">
                            COLUMN: <span>{cursor.col}</span>
                        </span>
                    </div>
                    <div className="status-right">
                        {isCompiling ? (
                            <span className="compiling">⬡ COMPILING...</span>
                        ) : compileDone ? (
                            <span>✓ COMPILATION SUCCESSFUL IN {compileTime}ms</span>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}