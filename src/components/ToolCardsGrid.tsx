import React from 'react';
import { ToolId } from '../types';
import { Image, PenTool, Camera, FileText, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ToolCardsGridProps {
  onSelectTool: (toolId: ToolId) => void;
  activeTool?: ToolId | null;
}

export const ToolCardsGrid: React.FC<ToolCardsGridProps> = ({ onSelectTool, activeTool }) => {
  const tools = [
    {
      id: 'photo20kb' as ToolId,
      name: '20KB Photo Maker',
      description: 'Compress & resize photograph precisely under 20KB or 50KB for SSC, UPSC, IBPS, Railway & Police forms.',
      badgeText: 'FREE • INSTANT',
      circleBg: 'bg-[#EBF3FA]',
      circleBorder: 'border-[#B8D7F2]',
      iconColor: 'text-[#0B2F5C]',
      accentColor: '#0B2F5C',
      icon: Image,
      features: ['Precise 20KB compression', 'Add Name & Date of Photo (DOP)', 'SSC 3.5×4.5cm preset'],
    },
    {
      id: 'signature10kb' as ToolId,
      name: 'Signature Maker (10KB)',
      description: 'Auto-clean dark background into pure white paper, enhance ink stroke, and compress strictly between 10KB - 20KB.',
      badgeText: 'FREE • INSTANT',
      circleBg: 'bg-[#E8F5E9]',
      circleBorder: 'border-[#C8E6C9]',
      iconColor: 'text-[#138808]',
      accentColor: '#138808',
      icon: PenTool,
      features: ['Auto white paper cleanup', 'Digital touch draw & upload', '140×60 px ratio'],
    },
    {
      id: 'passport35x45' as ToolId,
      name: 'Passport Photo 35x45mm',
      description: 'Standard 35x45mm photo size with White / Light Blue background and multi-photo printable sheets.',
      badgeText: 'FREE • INSTANT',
      circleBg: 'bg-[#FFF3E0]',
      circleBorder: 'border-[#FFE0B2]',
      iconColor: 'text-[#E65100]',
      accentColor: '#E65100',
      icon: Camera,
      features: ['Pure White / Blue background', 'Face positioning guide oval', 'Print 6, 8, 12 photos on 4x6 / A4'],
    },
    {
      id: 'aadharpdf' as ToolId,
      name: 'Aadhar PDF Merger',
      description: 'Merge Front & Back of Aadhaar / PAN card into single Xerox print A4 PDF or image with optional UIDAI masking.',
      badgeText: 'FREE • INSTANT',
      circleBg: 'bg-[#E1F5FE]',
      circleBorder: 'border-[#B3E5FC]',
      iconColor: 'text-[#0288D1]',
      accentColor: '#0288D1',
      icon: FileText,
      features: ['Front & Back Xerox layout', 'Mask first 8 digits (XXXX-XXXX)', 'PDF under 200KB upload limit'],
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
            <h2 className="text-lg sm:text-2xl font-black text-[#0B2F5C] tracking-tight">
              Sarkari Photo Tools - Exam Presets
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select a tool to format, compress, or merge your documents strictly as per exam guidelines.
          </p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Device-Only Processing</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = activeTool === tool.id;

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`group relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'border-[#0B2F5C] ring-2 ring-[#0B2F5C]/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              } flex flex-col justify-between`}
            >
              {/* Card Top: Colored Circle Icon + Badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  {/* Colored Circle with Icon */}
                  <div
                    className={`w-14 h-14 rounded-full ${tool.circleBg} border ${tool.circleBorder} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>

                  {/* Badge: FREE • INSTANT */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wider bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs uppercase">
                      {tool.badgeText}
                    </span>
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-base sm:text-lg font-black text-[#0B2F5C] group-hover:text-blue-900 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {tool.description}
                </p>

                {/* Features List */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                  {tool.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  No Sign Up Required
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2F5C] group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
