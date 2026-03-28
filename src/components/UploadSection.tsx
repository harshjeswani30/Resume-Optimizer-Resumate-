'use client';

import React, { useState, useRef } from 'react';

interface UploadSectionProps {
  onFileSelect: (file: File | null) => void;
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ff5a" strokeWidth={2} className="w-8 h-8">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ff5a" strokeWidth={2} className="w-8 h-8">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

export default function UploadSection({ onFileSelect }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5 MB limit.");
        return;
      }
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5 MB limit.");
        return;
      }
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragover(false); }}
      onDrop={onDrop}
      className={`min-h-[300px] rounded-[15px] flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-pointer text-center relative overflow-hidden group
        ${file 
          ? 'bg-[#00ff5a0a] border-2 border-dashed border-[#00ff5a33]' 
          : dragover 
            ? 'bg-[#00ff5a14] border-2 border-dashed border-[#00ff5a]' 
            : 'bg-black/20 border-2 border-dashed border-white/5 hover:border-[#00ff5a4d] hover:bg-black/30'
        }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Decorative background glow on hover */}
      <div className="absolute inset-0 bg-[#00ff5108] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className={`w-16 h-16 rounded-[16px] flex items-center justify-center mb-6 bg-white/5 border border-white/10 transition-all duration-500 scale-100 group-hover:scale-110 shadow-lg ${file ? 'bg-[#00ff5a14] border-[#00ff5a33]' : ''}`}>
        {file ? <CheckIcon /> : <UploadIcon />}
      </div>

      <div className="space-y-2 z-10">
        <h4 className="text-[17px] font-black text-white tracking-widest uppercase mb-1">
          {file ? file.name : 'Drop your resume here'}
        </h4>
        <p className="text-[12px] text-white/40 font-mono tracking-wider">
          {file 
            ? `${(file.size / 1024).toFixed(1)} KB — Ready to process` 
            : 'Drag & drop or click to browse local files.'}
        </p>
      </div>

      {!file && (
        <div className="mt-8 px-5 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase z-10">
          MAX 5MB — PDF, DOCX, TXT
        </div>
      )}

      {file && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setFile(null);
            onFileSelect(null);
          }}
          className="mt-8 text-[10px] font-mono text-white/30 hover:text-[#00ff5a] transition-all tracking-[0.2em] uppercase z-10 border-b border-white/10 hover:border-[#00ff5a] pb-1"
        >
          Remove File
        </button>
      )}
    </div>
  );
}
