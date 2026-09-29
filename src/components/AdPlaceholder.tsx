import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  variant?: 'banner' | 'leaderboard' | 'rectangle';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId = 'top-banner',
  variant = 'leaderboard',
  className = '',
}) => {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 my-3 sm:my-4 ${className}`}>
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        {/* Ad Tag Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-3 py-1 flex items-center justify-between text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
          <span>Advertisement</span>
          <span className="text-[9px] text-slate-300">Google AdSense</span>
        </div>

        {/* Ad Container Content */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-slate-50/50 to-white min-h-[90px] sm:min-h-[100px] text-center">
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-lg py-3 px-4">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              Sarkari Exam Notice &amp; Recruitment Alerts 2026
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-md">
              SSC CGL • UPSC Civil Services • Railway RRB • Bank PO &amp; Clerk Admit Cards &amp; Notifications
            </p>
            <span className="mt-2 inline-block text-[10px] bg-blue-50 text-[#0B2F5C] font-semibold px-2.5 py-0.5 rounded border border-blue-200/60">
              Verified Sarkari Portal Ad Space
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
