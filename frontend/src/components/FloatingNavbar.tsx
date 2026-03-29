'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ResumateLogo from './ResumateLogo';

const NAV = ['Home', 'Templates', 'Editor', 'History', 'Pricing'];

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ff5a" strokeWidth={2} className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function FloatingNavbar() {
  const pathname = usePathname();
  
  // Dynamically determine active index from URL
  const activeNav = NAV.findIndex(label => {
    const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
    return pathname === href;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-[100px] flex items-start justify-center pt-5 pointer-events-none font-sans">
      <div className="max-w-[1400px] w-full mx-auto relative flex items-start justify-between px-10 pointer-events-auto">
        
        {/* Left: Brand Logo with Glow Bridge (Now Global) */}
        <div className="absolute left-10 -top-5 flex flex-col items-center">
          {/* Layered Anchor Cap (Horizontal) - Flush to top edge */}
          <div className="absolute top-0 w-[24px] flex flex-col items-center">
            {/* Outer Glow Path (Horizontal) */}
            <div className="w-full h-[4px] bg-[#00ff5a]/20 blur-[2px] rounded-full" />
            {/* Bright Core (Horizontal) */}
            <div className="absolute top-0 w-full h-[2px] bg-[#00ff5a] shadow-[0_0_12px_rgba(0,255,100,1)] opacity-70" />
          </div>
          
          {/* Layered Neural Thread (Synced to 50px) */}
          <div className="relative flex flex-col items-center h-[50px]">
            {/* Outer Glow Path */}
            <div className="w-[4px] h-full bg-[#00ff5a]/20 blur-[2px] rounded-full" />
            {/* Bright Core */}
            <div className="absolute top-0 w-[1.5px] h-full bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-full shadow-[0_0_10px_rgba(0,255,100,0.6)]" />
          </div>
          
          {/* Neural Socket Holder */}
          <div className="w-[18px] h-[8px] bg-black border-x-[4px] border-t-[4px] border-black rounded-t-[4px] -mt-[3px] relative z-[3] shadow-[0_-2px_6px_rgba(0,255,100,0.2)]" />
          
          <div className="flex items-center bg-[#294d28] rounded-[50px] px-8 shadow-xl border-[4px] border-black -mt-[3px] h-[62px]">
            <div className="scale-90 translate-y-[2%]">
              <ResumateLogo />
            </div>
          </div>
        </div>

        {/* Center: Main Nav with Glow Bridge (Now Constant) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center -top-5">
          {/* Layered Anchor Cap (Horizontal) - Flush to top edge */}
          <div className="absolute top-0 w-[40px] flex flex-col items-center">
             {/* Outer Glow Path (Horizontal) */}
            <div className="w-full h-[4px] bg-[#00ff5a]/20 blur-[2px] rounded-full" />
             {/* Bright Core (Horizontal) */}
            <div className="absolute top-0 w-full h-[2px] bg-[#00ff5a] shadow-[0_0_15px_rgba(0,255,100,1)] opacity-80" />
          </div>

          {/* Layered Neural Thread (Full Home Length) */}
          <div className="relative flex flex-col items-center h-[50px]">
            {/* Outer Glow Path */}
            <div className="w-[4px] h-full bg-[#00ff5a]/20 blur-[2px] rounded-full" />
            {/* Bright Core */}
            <div className="absolute top-0 w-[1.5px] h-full bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-full shadow-[0_0_10px_rgba(0,255,100,0.6)]" />
          </div>
          
          {/* Neural Socket Holder (Circle Removed) */}
          <div className="w-[18px] h-[8px] bg-black border-x-[4px] border-t-[4px] border-black rounded-t-[4px] -mt-[3px] relative z-[3] shadow-[0_-2px_10px_rgba(0,255,100,0.2)]" />
          
          <nav className="flex items-center gap-1.5 shadow-xl border-black relative h-[62px] bg-[#294d28] rounded-[50px] p-2 border-[4px] -mt-[3px]">
            {NAV.map((label, i) => {
              const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
              return (
                <Link
                  key={label}
                  href={href}
                  className="px-6 h-[46px] flex items-center justify-center relative transition-all duration-300 group outline-none cursor-pointer"
                >
                  {/* Minimal Floating Highlight pill */}
                  <div className={`absolute inset-x-1.5 inset-y-1 bg-white rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] transition-all duration-500
                    ${activeNav === i ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-30 group-hover:scale-100'}
                  `} />
                  
                  <span className={`relative z-10 text-[12px] font-black tracking-[0.05em] transition-all duration-300 translate-y-[5%]
                    ${activeNav === i ? 'text-[#0e4a1f]' : 'text-white/70 group-hover:text-white'}
                  `}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Account Section with Glow Bridge (Now Global) */}
        <div className="absolute right-10 -top-5 flex flex-col items-center">
          {/* Layered Anchor Cap (Horizontal) - Flush to top edge */}
          <div className="absolute top-0 w-[24px] flex flex-col items-center">
            {/* Outer Glow Path (Horizontal) */}
            <div className="w-full h-[4px] bg-[#00ff5a]/20 blur-[2px] rounded-full" />
            {/* Bright Core (Horizontal) */}
            <div className="absolute top-0 w-full h-[2px] bg-[#00ff5a] shadow-[0_0_12px_rgba(0,255,100,1)] opacity-70" />
          </div>
          
          {/* Layered Neural Thread (Synced to 50px) */}
          <div className="relative flex flex-col items-center h-[50px]">
            {/* Outer Glow Path */}
            <div className="w-[4px] h-full bg-[#00ff5a]/20 blur-[2px] rounded-full" />
            {/* Bright Core */}
            <div className="absolute top-0 w-[1.5px] h-full bg-gradient-to-b from-[#00ff5a] to-[#0f7a34] rounded-full shadow-[0_0_10px_rgba(0,255,100,0.6)]" />
          </div>
          
          {/* Neural Socket Holder */}
          <div className="w-[18px] h-[8px] bg-black border-x-[4px] border-t-[4px] border-black rounded-t-[4px] -mt-[3px] relative z-[3] shadow-[0_-2px_6px_rgba(0,255,100,0.2)]" />
          
          <div className="flex items-center bg-[#294d28] rounded-[50px] p-2 shadow-xl border-[4px] border-black gap-2.5 -mt-[3px] h-[62px]">
            <button className="px-6 h-[46px] flex items-center justify-center relative transition-all duration-300 group outline-none">
              <div className="absolute inset-x-1.5 inset-y-1 bg-white rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] z-0" />
              <span className="relative z-10 text-[12px] font-black tracking-[0.05em] text-[#0e4a1f] translate-y-[5%] uppercase">
                Get started
              </span>
            </button>
            <div className="w-11 h-11 rounded-full border-2 border-[#00ff5a] shadow-[0_0_15px_rgba(0,255,90,0.4)] flex items-center justify-center bg-[#0a3d18] overflow-hidden cursor-pointer hover:border-white transition-all">
              <UserIcon />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
