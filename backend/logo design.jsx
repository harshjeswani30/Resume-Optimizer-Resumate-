export default function ResumateLogo() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;1,800;1,900&display=swap');

        /* ── card ── */
        .resumate-card {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #0d2818;
          border-radius: 14px;
          padding: 22px 36px;
        }

        /* ── logo row ── */
        .resumate-logo {
          display: inline-flex;
          align-items: center;
          line-height: 1;
          gap: 0;
          font-family: 'Inter', sans-serif;
        }

        /* lowercase italic white text on both sides */
        .logo-word {
          font-size: 34px;
          font-weight: 800;
          font-style: italic;
          color: #ffffff;
          letter-spacing: -0.5px;
          /* sit at the vertical middle of the U */
          display: flex;
          align-items: center;
        }

        /* wrapper for the big U svg */
        .logo-u-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 3px;
          /* pull it up slightly so it overhangs the text, just like the M */
          position: relative;
          top: -4px;
        }

        /* registered mark */
        .logo-reg {
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          align-self: flex-start;
          margin-top: 2px;
          margin-left: 2px;
        }
      `}</style>

            {/* ── dark card background ── */}
            <div className="resumate-card">
                <div className="resumate-logo">

                    {/* LEFT: "res" */}
                    <span className="logo-word">res</span>

                    {/* CENTER: big green U */}
                    <span className="logo-u-wrap">
                        <svg
                            width="70"
                            height="70"
                            viewBox="0 0 70 70"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/*
                U = two vertical strokes joined at the bottom by a semicircle.
                strokeLinecap="round" gives the same rounded ends as the M.
              */}
                            <path
                                d="M10 8
                   L10 40
                   Q10 62 35 62
                   Q60 62 60 40
                   L60 8"
                                stroke="#22c55e"
                                strokeWidth="13.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </span>

                    {/* RIGHT: "mate" */}
                    <span className="logo-word">mate</span>

                    {/* ® */}
                    <span className="logo-reg">®</span>

                </div>
            </div>
        </>
    );
}