'use client';

import React, { useState } from 'react';
import ResumateLogo from './ResumateLogo';

const NAV = ['Home', 'Templates', 'Editor', 'History', 'Pricing'];

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ff5a" strokeWidth={2} className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function FloatingNavbar() {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-[100px] flex items-start justify-center pt-5 pointer-events-none">
      <div className="max-w-[1400px] w-full mx-auto relative flex items-start justify-between px-10 pointer-events-auto">
        
        {/* Left: Brand Logo with Glow Bridge - Asymmetrical Shift (Slightly Up) */}
        <div className="absolute left-10 -top-8 flex flex-col items-center">
          {/* Bridge matching right side - 42px solid gradient from absolute top */}
          <div className="w-[2px] h-[42px] bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-[1px] shadow-[0_0_8px_2px_rgba(0,255,100,0.5),0_0_20px_4px_rgba(0,255,100,0.2)]" />
          <div className="w-[6px] h-[6px] bg-[#00ff5a] rounded-full shadow-[0_0_10px_3px_rgba(0,255,144,0.6),0_0_25px_8px_rgba(0,255,144,0.3)] -mt-[3px] z-[2] animate-pulse-dot" />
          
          <div className="flex items-center bg-[#294d28] rounded-[50px] px-8 shadow-xl border-[4px] border-black -mt-[3px] h-[62px]">
            <ResumateLogo />
          </div>
        </div>

        {/* Center: Main Nav with Glow Bridge - reaching absolute top */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center">
          {/* Bridge reaching absolute top - solid gradient to link properly */}
          <div className="w-[2px] h-[50px] bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-[1px] shadow-[0_0_8px_2px_rgba(0,255,100,0.5),0_0_20px_4px_rgba(0,255,100,0.2)]" />
          <div className="w-[6px] h-[6px] bg-[#00ff5a] rounded-full shadow-[0_0_10px_3px_rgba(0,255,144,0.6),0_0_25px_8px_rgba(0,255,144,0.3)] -mt-[3px] z-[2] animate-pulse-dot" />
          
          <nav className="flex items-center h-[62px] bg-[#294d28] rounded-[50px] p-2 gap-1.5 shadow-xl border-[4px] border-black relative -mt-[3px]">
            {NAV.map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveNav(i)}
                className="px-6 h-[46px] flex items-center justify-center relative transition-all duration-300 group outline-none"
              >
                {/* Minimal Floating Highlight */}
                {activeNav === i && (
                  <div className="absolute inset-x-2 inset-y-1.5 bg-white rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] z-0" />
                )}
                
                <span className={`relative z-10 text-[12px] font-black tracking-wider transition-colors duration-300
                  ${activeNav === i ? 'text-[#0e4a1f]' : 'text-white'}
                `}>
                  {label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Account Section with Glow Bridge - Asymmetrical Shift (Slightly Up) */}
        <div className="absolute right-10 -top-8 flex flex-col items-center">
          {/* Bridge matching middle navbar but shifted slightly up - 42px solid gradient from absolute top */}
          <div className="w-[2px] h-[42px] bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-[1px] shadow-[0_0_8px_2px_rgba(0,255,100,0.5),0_0_20px_4px_rgba(0,255,100,0.2)]" />
          <div className="w-[6px] h-[6px] bg-[#00ff5a] rounded-full shadow-[0_0_10px_3px_rgba(0,255,144,0.6),0_0_25px_8px_rgba(0,255,144,0.3)] -mt-[3px] z-[2] animate-pulse-dot" />
          
          <div className="flex items-center bg-[#294d28] rounded-[50px] p-2 shadow-xl border-[4px] border-black gap-3 -mt-[3px] h-[62px]">
            <button className="px-6 h-[46px] flex items-center justify-center relative transition-all duration-300 group outline-none">
              {/* Minimal Floating Highlight matching middle nav */}
              <div className="absolute inset-x-2 inset-y-1.5 bg-white rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] z-0" />
              <span className="relative z-10 text-[12px] font-black tracking-[0.05em] text-[#0e4a1f]">
                Get started
              </span>
            </button>
            <div className="w-11 h-11 rounded-full border-2 border-[#00ff5a] shadow-[0_0_15px_rgba(0,255,90,0.5)] flex items-center justify-center bg-[#0a3d18] overflow-hidden cursor-pointer hover:border-white transition-all">
              <UserIcon />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
