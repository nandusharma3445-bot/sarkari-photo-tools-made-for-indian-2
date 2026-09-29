import React from 'react';
import { Shield, Lock, Award, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigate?: (tab: ActiveTab) => void;
  onScrollToTools?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToTools }) => {
  return (
    <footer className="w-full bg-[#071F3D] text-slate-300 pt-8 pb-20 sm:pb-8 border-t-4 border-[#FF9933]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Feature Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">100% Offline Canvas</p>
              <p className="text-slate-400 text-[11px]">Zero Server Storage</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Client-Side Privacy</p>
              <p className="text-slate-400 text-[11px]">Photos Never Leave Phone</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Exam Standard Tools</p>
              <p className="text-slate-400 text-[11px]">SSC, UPSC, RRB, IBPS, NTA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#FF9933] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">100% Free Service</p>
              <p className="text-slate-400 text-[11px]">No Registration Needed</p>
            </div>
          </div>
        </div>

        {/* Center Portal Description */}
        <div className="py-6 text-center text-xs text-slate-400 max-w-2xl mx-auto space-y-1.5">
          <p className="font-bold text-white text-sm">
            Sarkari Photo Tools - Made for Indian Exams
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Designed for aspirants preparing for Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Board (RRB), IBPS Bank, State PSCs, and central competitive examinations.
          </p>
        </div>

        {/* Centered Navigation Links Bar: Home • Tools • About Us • Contact Us • Privacy Policy */}
        <div className="py-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onNavigate?.('home')}
            className="hover:text-yellow-400 transition cursor-pointer"
          >
            Home
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => (onScrollToTools ? onScrollToTools() : onNavigate?.('tools'))}
            className="hover:text-yellow-400 transition cursor-pointer"
          >
            Tools
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => onNavigate?.('about')}
            className="hover:text-yellow-400 transition cursor-pointer"
          >
            About Us
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => onNavigate?.('contact')}
            className="hover:text-yellow-400 transition cursor-pointer"
          >
            Contact Us
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => onNavigate?.('privacy')}
            className="hover:text-yellow-400 transition cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>

        {/* Footer Bottom Bar with Version, Developed by Nandu Sharma, Contacts & Copyright */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="font-mono text-slate-500 font-semibold">v1.2.0</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-bold">Developed by Nandu Sharma</span>
            <span className="text-slate-600">•</span>
            <a
              href="mailto:nandusharma3445@gmail.com"
              className="text-[#FF9933] hover:underline font-semibold"
            >
              nandusharma3445@gmail.com
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="tel:9625766541"
              className="text-amber-300 hover:underline font-semibold"
            >
              9625766541
            </a>
          </div>

          <p className="text-[10px] text-slate-500">
            © 2026 Sarkari Photo Tools - Made for Indian Exams. All client-side tools execute directly in browser memory.
          </p>
        </div>

      </div>
    </footer>
  );
};
