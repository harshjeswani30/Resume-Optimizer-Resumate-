import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0a0f0a;
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    background: linear-gradient(145deg, #0d1f0d, #0a180a);
    border: 1px solid #1a3a1a;
    border-radius: 16px;
    padding: 30px;
    width: 100%;
    max-width: 1240px;
    position: relative;
    overflow: hidden;
  }

  .container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 20%, rgba(0, 200, 80, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .top-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .source-panel {
    flex: 1;
    position: relative;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .panel-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
  }

  .panel-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #3a7a3a;
    letter-spacing: 0.5px;
  }

  .source-content {
    background: linear-gradient(145deg, #0b1a0b, #091409);
    border: 1px solid #1a3a1a;
    border-radius: 12px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .source-content:hover {
    border-color: #2a5a2a;
    box-shadow: 0 0 20px rgba(0, 200, 80, 0.05);
  }

  .source-content.dragover {
    border-color: #00e65c;
    box-shadow: 0 0 30px rgba(0, 230, 92, 0.1);
  }

  .upload-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(145deg, #0d2a0d, #0a1f0a);
    border: 2px solid #1a4a1a;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .upload-icon svg {
    width: 28px;
    height: 28px;
    stroke: #00e65c;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .upload-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .upload-subtitle {
    font-size: 14px;
    color: #6a8a6a;
    margin-bottom: 24px;
  }

  .file-types {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #4a7a4a;
    background: rgba(0, 200, 80, 0.05);
    border: 1px solid #1a3a1a;
    border-radius: 20px;
    padding: 8px 24px;
    letter-spacing: 1px;
  }

  .target-panel {
    flex: 1;
    position: relative;
  }

  .target-content {
    background: linear-gradient(145deg, #0b1a0b, #091409);
    border: 1px solid #1a3a1a;
    border-radius: 12px;
    min-height: 280px;
    position: relative;
  }

  .target-textarea {
    width: 100%;
    height: 280px;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    padding: 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    color: #5a9a5a;
    letter-spacing: 0.3px;
  }

  .target-textarea::placeholder {
    color: #3a6a3a;
  }

  .bottom-bar {
    background: linear-gradient(145deg, #0b1a0b, #091409);
    border: 1px solid #1a3a1a;
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-info {
    display: flex;
    gap: 32px;
    align-items: center;
  }

  .status-item {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #4a7a4a;
    letter-spacing: 1px;
  }

  .status-value {
    color: #00e65c;
    font-weight: 500;
  }

  .analyze-btn {
    background: linear-gradient(135deg, #00e65c, #00cc50, #00e65c);
    background-size: 200% 200%;
    border: none;
    border-radius: 30px;
    padding: 14px 36px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0a1a0a;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(0, 230, 92, 0.3);
    animation: btnGlow 3s ease-in-out infinite;
  }

  .analyze-btn svg {
    width: 18px;
    height: 18px;
    stroke: #0a1a0a;
    fill: none;
    stroke-width: 2.5;
  }

  .analyze-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 50px rgba(0, 230, 92, 0.5);
  }

  .analyze-btn:active {
    transform: translateY(0);
  }

  .file-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #00e65c;
  }

  .file-size-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #4a7a4a;
  }

  .remove-file {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #ff4444;
    cursor: pointer;
    background: none;
    border: 1px solid #3a1a1a;
    border-radius: 4px;
    padding: 4px 12px;
    margin-top: 8px;
    transition: all 0.2s;
  }

  .remove-file:hover {
    background: rgba(255, 68, 68, 0.1);
    border-color: #ff4444;
  }

  @keyframes btnGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 230, 92, 0.2);
      background-position: 0% 50%;
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 230, 92, 0.4);
      background-position: 100% 50%;
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .top-section {
      flex-direction: column;
    }

    .bottom-bar {
      flex-direction: column;
      gap: 16px;
    }

    .container {
      padding: 16px;
    }
  }
`;

// ── tiny helper components ────────────────────────────────────────────────────

const UploadSVG = () => (
    <svg viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CheckSVG = () => (
    <svg viewBox="0 0 24 24" style={{ stroke: "#00e65c" }}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SearchSVG = () => (
    <svg viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const SpinnerSVG = () => (
    <svg
        viewBox="0 0 24 24"
        style={{ animation: "spin 1s linear infinite" }}
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            strokeDasharray="30 70"
            strokeDashoffset="0"
        />
    </svg>
);

const CompleteSVG = () => (
    <svg viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// ── helpers ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes) {
    if (bytes === 0) return "0.00KB";
    const k = 1024;
    if (bytes < k) return bytes + "B";
    if (bytes < k * k) return (bytes / k).toFixed(2) + "KB";
    return (bytes / (k * k)).toFixed(2) + "MB";
}

const VALID_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

// ── main component ────────────────────────────────────────────────────────────

export default function ResumeAnalyzer() {
    const fileInputRef = useRef(null);

    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null); // { name, size }
    const [jdText, setJdText] = useState("");
    const [analyzeState, setAnalyzeState] = useState("idle"); // idle | analyzing | complete
    const [tokenStatus, setTokenStatus] = useState("READY");

    // ── file handling ─────────────────────────────────────────────────────────

    const handleFile = useCallback((file) => {
        const isValidType =
            VALID_TYPES.includes(file.type) ||
            /\.(pdf|docx|txt)$/i.test(file.name);

        if (!isValidType) {
            alert("Please upload a PDF, DOCX, or TXT file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit.");
            return;
        }

        setUploadedFile({ name: file.name, size: file.size });
        setTokenStatus("LOADED");
    }, []);

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setUploadedFile(null);
        setTokenStatus("READY");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── drag & drop ───────────────────────────────────────────────────────────

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDropZoneClick = (e) => {
        if (
            e.target.classList.contains("remove-file") ||
            e.target.closest(".remove-file")
        )
            return;
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    };

    // ── analyze ───────────────────────────────────────────────────────────────

    const handleAnalyze = () => {
        const hasFile = !!uploadedFile;
        const hasJD = jdText.trim().length > 0;

        if (!hasFile && !hasJD) {
            alert("Please upload your resume and paste a job description.");
            return;
        }
        if (!hasFile) {
            alert("Please upload your resume.");
            return;
        }
        if (!hasJD) {
            alert("Please paste a job description.");
            return;
        }

        setAnalyzeState("analyzing");
        setTokenStatus("PROCESSING");

        setTimeout(() => {
            setAnalyzeState("complete");
            setTokenStatus("COMPLETE");

            setTimeout(() => {
                setAnalyzeState("idle");
                setTokenStatus(uploadedFile ? "LOADED" : "READY");
            }, 2000);
        }, 3000);
    };

    // ── derived values ────────────────────────────────────────────────────────

    const memoryDisplay = uploadedFile
        ? formatFileSize(uploadedFile.size)
        : "0.00KB";

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Inject CSS once */}
            <style>{styles}</style>

            <div className="container">
                <div className="top-section">
                    {/* ── Source Document Panel ── */}
                    <div className="source-panel">
                        <div className="panel-header">
                            <span className="panel-title">Source Document</span>
                            <span className="panel-tag">[RESUME_DATA]</span>
                        </div>

                        <div
                            className={`source-content${isDragOver ? " dragover" : ""}`}
                            onClick={handleDropZoneClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept=".pdf,.docx,.txt"
                                onChange={handleFileInputChange}
                            />

                            {/* Default upload UI */}
                            {!uploadedFile && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="upload-icon">
                                        <UploadSVG />
                                    </div>
                                    <div className="upload-title">Drop your resume here</div>
                                    <div className="upload-subtitle">
                                        Drag &amp; drop or click to browse local files.
                                    </div>
                                    <div className="file-types">MAX 5MB — PDF, DOCX, TXT</div>
                                </div>
                            )}

                            {/* File uploaded UI */}
                            {uploadedFile && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        className="upload-icon"
                                        style={{ borderColor: "#00e65c" }}
                                    >
                                        <CheckSVG />
                                    </div>
                                    <div className="file-name">{uploadedFile.name}</div>
                                    <div className="file-size-text">
                                        {formatFileSize(uploadedFile.size)}
                                    </div>
                                    <button className="remove-file" onClick={handleRemoveFile}>
                                        REMOVE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Target Parameters Panel ── */}
                    <div className="target-panel">
                        <div className="panel-header">
                            <span className="panel-title">Target Parameters</span>
                            <span className="panel-tag">[JD_INPUT]</span>
                        </div>
                        <div className="target-content">
                            <textarea
                                className="target-textarea"
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder={`// Paste the full job description here...\n\ne.g. 'We are looking for a Senior Product Designer with 5+ years of experience in high-fidelity prototyping, design systems, and cross-functional collaboration...'`}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="bottom-bar">
                    <div className="status-info">
                        <span className="status-item">
                            MEMORY:{" "}
                            <span className="status-value">{memoryDisplay}</span>
                        </span>
                        <span className="status-item">
                            TOKENS:{" "}
                            <span className="status-value">{tokenStatus}</span>
                        </span>
                    </div>

                    <button
                        className="analyze-btn"
                        onClick={handleAnalyze}
                        disabled={analyzeState === "analyzing"}
                    >
                        {analyzeState === "idle" && (
                            <>
                                <SearchSVG />
                                Analyze &amp; Optimize
                            </>
                        )}
                        {analyzeState === "analyzing" && (
                            <>
                                <SpinnerSVG />
                                Analyzing...
                            </>
                        )}
                        {analyzeState === "complete" && (
                            <>
                                <CompleteSVG />
                                Analysis Complete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}