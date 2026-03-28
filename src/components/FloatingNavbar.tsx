'use client';

import React, { useState } from 'react';

const NAV = ['Home', 'Templates', 'History', 'Pricing'];

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
        
        {/* Left Symmetry (Blank) */}
        <div className="w-[300px] hidden lg:block" />

        {/* Center: Main Nav with Glow Bridge - reaching absolute top */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center">
          {/* Bridge reaching absolute top - solid gradient to link properly */}
          <div className="w-[2px] h-[50px] bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-[1px] shadow-[0_0_8px_2px_rgba(0,255,100,0.5),0_0_20px_4px_rgba(0,255,100,0.2)]" />
          <div className="w-[6px] h-[6px] bg-[#00ff5a] rounded-full shadow-[0_0_10px_3px_rgba(0,255,144,0.6),0_0_25px_8px_rgba(0,255,144,0.3)] -mt-[3px] z-[2] animate-pulse-dot" />
          
          <nav className="flex items-center bg-gradient-to-br from-[#176b30] to-[#0e4a1f] rounded-[50px] p-1.5 gap-1 shadow-[0_4px_15px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08),0_0_30px_rgba(15,100,40,0.3)] border border-white/5 relative -mt-[3px]">
            {NAV.map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveNav(i)}
                className={`px-6 py-2.5 rounded-[50px] text-[11px] font-black tracking-widest uppercase transition-all duration-500 whitespace-nowrap outline-none
                  ${activeNav === i 
                    ? 'bg-white text-[#0e4a1f] shadow-[0_2px_10px_rgba(0,0,0,0.15)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Account Section with Glow Bridge - Asymmetrical Shift (Slightly Up) */}
        <div className="absolute right-10 -top-8 flex flex-col items-center">
          {/* Bridge matching middle navbar but shifted slightly up - 42px solid gradient from absolute top */}
          <div className="w-[2px] h-[42px] bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-[1px] shadow-[0_0_8px_2px_rgba(0,255,100,0.5),0_0_20px_4px_rgba(0,255,100,0.2)]" />
          <div className="w-[6px] h-[6px] bg-[#00ff5a] rounded-full shadow-[0_0_10px_3px_rgba(0,255,144,0.6),0_0_25px_8px_rgba(0,255,144,0.3)] -mt-[3px] z-[2] animate-pulse-dot" />
          
          <div className="flex items-center bg-gradient-to-br from-[#176b30] to-[#0e4a1f] rounded-[50px] p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)] border border-white/5 gap-3 -mt-[3px] h-[54px]">
            <button className="px-6 py-2.5 bg-white text-[#0e4a1f] rounded-[50px] text-[11px] font-black tracking-[0.1em] uppercase hover:scale-[1.02] hover:bg-[#e8f5e9] transition-all duration-300">
              Get Started
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
