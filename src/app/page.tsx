'use client';

import React from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#061a0b]">
      
      {/* Precise Background Glows from ResumeApp lines 47-56 */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0 opacity-60" 
           style={{ background: 'radial-gradient(ellipse, rgba(0,255,90,0.06) 0%, transparent 70%)' }} />
      <div className="fixed top-[300px] -right-[200px] w-[500px] h-[500px] pointer-events-none z-0 opacity-40"
           style={{ background: 'radial-gradient(circle, rgba(0,255,90,0.03) 0%, transparent 70%)' }} />

      <FloatingNavbar />

      <div className="flex-1 flex flex-col items-center justify-start px-10 pb-10 pt-40">
        
        {/* New Interface Placeholder */}
        <div className="w-full max-w-[1100px] mt-10 min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[30px] bg-black/5 animate-in fade-in zoom-in duration-1000">
           {/* READY FOR NEW IMPLEMENTATION */}
           <div className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase">Ready for Neural Interface Upgrade</div>
        </div>
      </div>

      {/* Glow Lines - Simplified Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-[100px] pointer-events-none z-0">
        {/* Center Line (overlaps with navbar bridge) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[60px] bg-gradient-to-b from-[#00ff5a] via-[#0f7a34] to-transparent shadow-[0_0_8px_2px_rgba(0,255,100,0.4),0_0_20px_4px_rgba(0,255,100,0.15)]" />
      </div>

    </main>
  );
}
