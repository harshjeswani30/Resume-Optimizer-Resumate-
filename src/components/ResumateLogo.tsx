'use client';

import React from 'react';

const styles = `
  /* ── logo row ── */
  .resumate-logo {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    gap: 0;
    font-family: 'Inter', sans-serif;
    user-select: none;
  }

  /* lowercase italic white text on both sides */
  .logo-word {
    font-size: 24px;
    font-weight: 800;
    font-style: italic;
    color: #ffffff;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
  }

  /* wrapper for the big U svg */
  .logo-u-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    position: relative;
    top: 0;
  }

  /* registered mark */
  .logo-reg {
    font-size: 10px;
    font-weight: 400;
    font-style: normal;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    align-self: flex-start;
    margin-top: 2px;
    margin-left: 1px;
    opacity: 0.8;
  }
`;

export default function ResumateLogo() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="resumate-logo">
        {/* LEFT: "res" */}
        <span className="logo-word">res</span>

        {/* CENTER: big green U */}
        <span className="logo-u-wrap">
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
        <span className="logo-word">mate</span>

        {/* ® */}
        <span className="logo-reg">®</span>
      </div>
    </>
  );
}
