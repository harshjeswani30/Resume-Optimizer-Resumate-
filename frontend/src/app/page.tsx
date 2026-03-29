import React from 'react';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';

export default function Home() {
  return (
    <main className="relative h-screen w-full flex flex-col overflow-hidden bg-[#061a0b]">
      
      {/* Precise Background Glows from ResumeApp lines 47-56 */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0 opacity-60" 
           style={{ background: 'radial-gradient(ellipse, rgba(0,255,90,0.06) 0%, transparent 70%)' }} />
      <div className="fixed top-[300px] -right-[200px] w-[500px] h-[500px] pointer-events-none z-0 opacity-40"
           style={{ background: 'radial-gradient(circle, rgba(0,255,90,0.03) 0%, transparent 70%)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-10 pt-36 relative z-10">
        
        {/* Dynamic Neural Interface Dashboard */}
        <ResumeAnalyzer />
      </div>

    </main>
  );
}
