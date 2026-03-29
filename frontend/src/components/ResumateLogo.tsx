export default function ResumateLogo() {
  return (
    <div className="inline-flex items-center gap-0 leading-none select-none font-sans">
      {/* LEFT: "res" */}
      <span className="text-[24px] font-black italic text-white tracking-[-0.02em] flex items-center">
        res
      </span>

      {/* CENTER: big green U */}
      <span className="flex items-center justify-center relative mx-0">
        <svg
          width="32"
          height="32"
          viewBox="0 0 70 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 8 L10 40 Q10 62 35 62 Q60 62 60 40 L60 8"
            stroke="#22c55e"
            strokeWidth="13.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>

      {/* RIGHT: "mate" */}
      <span className="text-[24px] font-black italic text-white tracking-[-0.02em] flex items-center">
        mate
      </span>

      {/* ® */}
      <span className="text-[10px] font-medium text-white/80 self-start mt-0.5 ml-0.5">
        ®
      </span>
    </div>
  );
}
