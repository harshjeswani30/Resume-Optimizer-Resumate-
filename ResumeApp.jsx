import { useState, useRef } from "react";

const styles = {
  "@import": "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap')",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    min-height: 100vh;
    background: #061a0b;
    background: radial-gradient(ellipse at 50% 0%, #13522a 0%, #0a2e14 30%, #061a0b 60%);
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #fff;
    overflow-x: hidden;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(0,255,90,0.6); }
    50%       { opacity: 0.6; box-shadow: 0 0 12px rgba(0,255,90,0.8); }
  }
`;

// Inject global styles once
if (typeof document !== "undefined" && !document.getElementById("rmr-styles")) {
  const tag = document.createElement("style");
  tag.id = "rmr-styles";
  tag.textContent = css;
  document.head.appendChild(tag);
}

/* ─── tiny inline-style helpers ─── */
const S = {
  /* layout */
  page: {
    minHeight: "100vh",
    background: "#061a0b",
    backgroundImage: "radial-gradient(ellipse at 50% 0%, #13522a 0%, #0a2e14 30%, #061a0b 60%)",
    fontFamily: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
    color: "#fff",
    overflowX: "hidden",
    position: "relative",
  },
  bgGlow1: {
    position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
    width: 800, height: 600, pointerEvents: "none", zIndex: 0,
    background: "radial-gradient(ellipse, rgba(0,255,90,0.06) 0%, transparent 70%)",
  },
  bgGlow2: {
    position: "fixed", top: 300, right: -200,
    width: 500, height: 500, pointerEvents: "none", zIndex: 0,
    background: "radial-gradient(circle, rgba(0,255,90,0.03) 0%, transparent 70%)",
  },
  glowLines: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 100, pointerEvents: "none", zIndex: 0,
  },
  glowLineCenter: {
    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
    width: 2, height: 60,
    background: "linear-gradient(to bottom, #00ff5a, #0f7a34, transparent)",
    boxShadow: "0 0 8px 2px rgba(0,255,90,0.4), 0 0 20px 4px rgba(0,255,90,0.15)",
  },
  glowLineRight: {
    position: "absolute", top: 0, right: "14%",
    width: 2, height: 50,
    background: "linear-gradient(to bottom, #00ff5a, #0f7a34, transparent)",
    boxShadow: "0 0 8px 2px rgba(0,255,90,0.4), 0 0 20px 4px rgba(0,255,90,0.15)",
  },
  glowLineLeftBranch: {
    position: "absolute", top: 30,
    left: "50%", transform: "translateX(calc(-50% - 80px))",
    width: 2, height: 35,
    background: "linear-gradient(to bottom, rgba(0,255,90,0.3), transparent)",
    boxShadow: "0 0 6px 1px rgba(0,255,90,0.2)",
  },
  glowLineRightBranch: {
    position: "absolute", top: 30,
    left: "50%", transform: "translateX(calc(-50% + 80px))",
    width: 2, height: 35,
    background: "linear-gradient(to bottom, rgba(0,255,90,0.3), transparent)",
    boxShadow: "0 0 6px 1px rgba(0,255,90,0.2)",
  },
  contentWrapper: { position: "relative", zIndex: 1 },

  /* header */
  header: {
    position: "relative", display: "flex",
    justifyContent: "center", alignItems: "flex-start",
    paddingTop: 20, zIndex: 10,
  },
  headerInner: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", maxWidth: 1400, padding: "0 40px", position: "relative",
  },
  navbarWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  navbarGlowLine: {
    width: 2, height: 30,
    background: "linear-gradient(to bottom, #00ff5a, #0f7a34)",
    boxShadow: "0 0 8px 2px rgba(0,255,90,0.5), 0 0 20px 4px rgba(0,255,90,0.2)",
    borderRadius: 1,
  },
  navbarGlowDot: {
    width: 6, height: 6, background: "#00ff5a", borderRadius: "50%",
    boxShadow: "0 0 10px 3px rgba(0,255,90,0.6), 0 0 25px 8px rgba(0,255,90,0.3)",
    marginBottom: -3, zIndex: 2,
  },
  navbar: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(145deg, #176b30, #0e4a1f)",
    borderRadius: 50, padding: "6px 8px", gap: 4,
    boxShadow: "0 4px 15px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px rgba(15,100,40,0.3)",
    border: "1px solid rgba(255,255,255,0.06)", position: "relative",
  },
  navItem: (active) => ({
    padding: "12px 28px", borderRadius: 50,
    color: active ? "#0e4a1f" : "#fff",
    fontSize: 15, fontWeight: active ? 600 : 500,
    cursor: "pointer", textDecoration: "none",
    whiteSpace: "nowrap", letterSpacing: "0.2px", userSelect: "none",
    background: active ? "#fff" : "transparent",
    boxShadow: active ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
    transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
    border: "none", fontFamily: "inherit",
  }),
  headerRight: {
    position: "absolute", right: 40, top: "50%",
    transform: "translateY(-50%)", display: "flex",
    alignItems: "center", gap: 12, marginTop: 30,
  },
  getStartedWrapper: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(145deg, #176b30, #0e4a1f)",
    borderRadius: 50, padding: 4,
    boxShadow: "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)", gap: 8,
  },
  getStartedBtn: {
    padding: "10px 24px", background: "#fff", color: "#0e4a1f",
    border: "none", borderRadius: 50, fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s ease",
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    border: "2px solid #00ff5a", boxShadow: "0 0 12px rgba(0,255,90,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0a3d18", overflow: "hidden", cursor: "pointer",
  },

  /* hero */
  hero: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "80px 40px 60px", textAlign: "center",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 20px", border: "1px solid rgba(0,255,90,0.3)",
    borderRadius: 50, background: "rgba(0,255,90,0.05)", marginBottom: 40,
  },
  badgeDot: {
    width: 8, height: 8, background: "#00ff5a", borderRadius: "50%",
    boxShadow: "0 0 6px rgba(0,255,90,0.6)",
    animation: "pulse-dot 2s infinite",
  },
  badgeText: {
    fontSize: 12, fontWeight: 600, letterSpacing: 2,
    color: "#00ff5a", fontFamily: "'Courier New',monospace", textTransform: "uppercase",
  },
  heroRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 30, flexWrap: "wrap",
  },
  heroRowLeft: { display: "flex", flexDirection: "column", alignItems: "center" },
  whiteItalic: {
    fontSize: "clamp(48px,7vw,80px)", fontWeight: 800,
    fontStyle: "italic", color: "#fff", lineHeight: 1.1, display: "block",
  },
  reqsGroup: { display: "flex", alignItems: "center", gap: 12 },
  reqsIcon: {
    width: 55, height: 55, background: "#fff", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  reqsText: {
    fontSize: "clamp(48px,7vw,80px)", fontWeight: 800,
    color: "#fff", lineHeight: 1.1,
  },
  greenItalic: {
    fontSize: "clamp(48px,7vw,80px)", fontWeight: 800,
    fontStyle: "italic", color: "#00ff5a", lineHeight: 1.1,
    textShadow: "0 0 40px rgba(0,255,90,0.3)", display: "block",
  },

  /* panels */
  panelsSection: { display: "flex", justifyContent: "center", padding: "20px 40px 80px" },
  panelsContainer: {
    display: "flex", gap: 0, maxWidth: 1100, width: "100%",
    background: "linear-gradient(160deg, #1a7a3a, #0f5525, #0a3d18)",
    borderRadius: 20, overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,90,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  panel: (first) => ({
    flex: 1, padding: 30, position: "relative",
    borderRight: first ? "1px solid rgba(255,255,255,0.08)" : "none",
  }),
  panelHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  panelTitle: { fontSize: 18, fontWeight: 700, color: "#fff" },
  panelTag: {
    fontSize: 11, fontFamily: "'Courier New',monospace",
    color: "rgba(255,255,255,0.4)", letterSpacing: 1,
  },
  uploadArea: (dragover, uploaded) => ({
    background: uploaded ? "rgba(0,255,90,0.06)" : "rgba(255,255,255,0.06)",
    border: `2px dashed ${uploaded ? "rgba(0,255,90,0.4)" : dragover ? "#00ff5a" : "rgba(255,255,255,0.12)"}`,
    borderRadius: 16, padding: "50px 30px 30px",
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", transition: "all 0.3s ease", cursor: "pointer",
    minHeight: 250, justifyContent: "center",
    background: dragover ? "rgba(0,255,90,0.08)" : uploaded ? "rgba(0,255,90,0.06)" : "rgba(255,255,255,0.06)",
  }),
  uploadIcon: (uploaded) => ({
    width: 64, height: 64, borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 20, border: "1px solid rgba(255,255,255,0.1)",
  }),
  uploadTitle: { fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 },
  uploadSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 },
  uploadInfo: {
    display: "inline-block", padding: "6px 16px",
    background: "rgba(255,255,255,0.06)", borderRadius: 6,
    fontFamily: "'Courier New',monospace", fontSize: 11,
    color: "rgba(255,255,255,0.4)", letterSpacing: 1,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  textareaWrapper: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: 24, minHeight: 250,
  },
  textarea: {
    width: "100%", minHeight: 200, background: "transparent",
    border: "none", color: "rgba(255,255,255,0.35)",
    fontFamily: "'Courier New',monospace", fontSize: 13,
    lineHeight: 1.7, resize: "none", outline: "none",
  },
};

/* ─── SVG icons ─── */
const UploadIcon = ({ color = "#00cc4a" }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path stroke={color} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline stroke={color} points="17 8 12 3 7 8"/>
    <line stroke={color} x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = ({ color = "#00ff5a" }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path stroke={color} d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline stroke={color} points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ff5a" strokeWidth={2} style={{ width: 24, height: 24 }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

/* ─── Nav items ─── */
const NAV = ["Home", "Templates", "History", "Pricing"];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ResumeApp() {
  const [activeNav, setActiveNav]   = useState(0);
  const [dragover, setDragover]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  /* file handling */
  const MAX = 5 * 1024 * 1024;

  function handleFile(file) {
    if (!file) return;
    if (file.size > MAX) { alert("File size exceeds 5 MB limit."); return; }
    setUploadedFile({ name: file.name, kb: (file.size / 1024).toFixed(1) });
  }

  function onDrop(e) {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div style={S.page}>
      {/* bg glows */}
      <div style={S.bgGlow1} />
      <div style={S.bgGlow2} />

      {/* glow lines */}
      <div style={S.glowLines}>
        <div style={S.glowLineCenter} />
        <div style={S.glowLineRight} />
        <div style={S.glowLineLeftBranch} />
        <div style={S.glowLineRightBranch} />
      </div>

      <div style={S.contentWrapper}>

        {/* ── HEADER ── */}
        <header style={S.header}>
          <div style={S.headerInner}>

            {/* centre nav */}
            <div style={S.navbarWrapper}>
              <div style={S.navbarGlowLine} />
              <div style={S.navbarGlowDot} />
              <nav style={S.navbar}>
                {NAV.map((label, i) => (
                  <button
                    key={label}
                    style={S.navItem(activeNav === i)}
                    onClick={() => setActiveNav(i)}
                    onMouseEnter={e => { if (activeNav !== i) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { if (activeNav !== i) e.currentTarget.style.background = "transparent"; }}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* right: get started + avatar */}
            <div style={S.headerRight}>
              <div style={S.getStartedWrapper}>
                <button
                  style={S.getStartedBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e8f5e9"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  Get Started
                </button>
                <div style={S.avatar}><UserIcon /></div>
              </div>
            </div>

          </div>
        </header>

        {/* ── HERO ── */}
        <section style={S.hero}>

          {/* badge */}
          <div style={S.badge}>
            <div style={S.badgeDot} />
            <span style={S.badgeText}>CORE ENGINE V3.1 ACTIVE</span>
          </div>

          {/* headline */}
          <div style={S.heroRow}>
            {/* "Match the" */}
            <div style={S.heroRowLeft}>
              <span style={S.whiteItalic}>Match</span>
              <span style={S.whiteItalic}>the</span>
            </div>

            {/* icon + "reqs." */}
            <div style={S.reqsGroup}>
              <div style={S.reqsIcon}>
                <CheckIcon color="#0e4a1f" />
              </div>
              <span style={S.reqsText}>reqs.</span>
            </div>

            {/* "Win the interview." */}
            <div style={S.heroRowLeft}>
              <span style={S.greenItalic}>Win the</span>
              <span style={S.greenItalic}>interview.</span>
            </div>
          </div>

        </section>

        {/* ── PANELS ── */}
        <section style={S.panelsSection}>
          <div style={S.panelsContainer}>

            {/* LEFT: source document */}
            <div style={S.panel(true)}>
              <div style={S.panelHeader}>
                <h3 style={S.panelTitle}>Source Document</h3>
                <span style={S.panelTag}>[RESUME_DATA]</span>
              </div>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
              />

              <div
                style={S.uploadArea(dragover, !!uploadedFile)}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragover(true); }}
                onDragLeave={e => { e.preventDefault(); setDragover(false); }}
                onDrop={onDrop}
              >
                <div style={S.uploadIcon(!!uploadedFile)}>
                  {uploadedFile ? <CheckIcon /> : <UploadIcon />}
                </div>
                <div style={S.uploadTitle}>
                  {uploadedFile ? uploadedFile.name : "Drop your resume here"}
                </div>
                <div style={S.uploadSubtitle}>
                  {uploadedFile
                    ? `${uploadedFile.kb} KB — Ready to process`
                    : "Drag & drop or click to browse local files."}
                </div>
                {!uploadedFile && <div style={S.uploadInfo}>MAX 5MB — PDF, DOCX, TXT</div>}
              </div>
            </div>

            {/* RIGHT: target parameters */}
            <div style={S.panel(false)}>
              <div style={S.panelHeader}>
                <h3 style={S.panelTitle}>Target Parameters</h3>
                <span style={S.panelTag}>[JD_INPUT]</span>
              </div>
              <div style={S.textareaWrapper}>
                <textarea
                  style={S.textarea}
                  placeholder={`// Paste the full job description here...\n\ne.g. 'We are looking for a Senior Product Designer with 5+ years of experience in high-fidelity prototyping, design systems, and cross-functional collaboration...'`}
                  onFocus={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                  onBlur={e => { if (!e.currentTarget.value) e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                />
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
