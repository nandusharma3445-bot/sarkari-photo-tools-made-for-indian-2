import React, { useState } from 'react';
import { Header } from './components/Header';
import { AdPlaceholder } from './components/AdPlaceholder';
import { ToolCardsGrid } from './components/ToolCardsGrid';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PhotoCompressor20KB } from './components/tools/PhotoCompressor20KB';
import { SignatureMaker10KB } from './components/tools/SignatureMaker10KB';
import { PassportPhotoMaker } from './components/tools/PassportPhotoMaker';
import { AadharPDFMerger } from './components/tools/AadharPDFMerger';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { PrivacyView } from './components/views/PrivacyView';
import { HelpView } from './components/views/HelpView';
import { ActiveTab, ToolId } from './types';
import { ShieldCheck, ArrowRight, FileCheck2, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const handleSelectTool = (toolId: ToolId) => {
    setActiveTool(toolId);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBackToTools = () => {
    setActiveTool(null);
    handleScrollToTools();
  };

  const handleNavigate = (tab: ActiveTab) => {
    if (tab === 'tools') {
      handleScrollToTools();
      return;
    }
    setActiveTool(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTools = () => {
    setActiveTool(null);
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById('tools-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 220, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-slate-800 font-sans selection:bg-[#FF9933] selection:text-white">
      {/* 1. Sticky Responsive Header with Left N logo, Center Menu, Right Install App button */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onScrollToTools={handleScrollToTools}
        onOpenHelp={() => handleNavigate('help')}
      />

      {/* 2. Top Advertisement Placeholder (after header as requested) */}
      <AdPlaceholder slotId="header-leaderboard" />

      {/* 3. Main Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* If a specific tool is active */}
        {activeTool ? (
          <div className="my-4 animate-fade-in">
            {activeTool === 'photo20kb' && <PhotoCompressor20KB onBack={handleBackToTools} />}
            {activeTool === 'signature10kb' && <SignatureMaker10KB onBack={handleBackToTools} />}
            {activeTool === 'passport35x45' && <PassportPhotoMaker onBack={handleBackToTools} />}
            {activeTool === 'aadharpdf' && <AadharPDFMerger onBack={handleBackToTools} />}
          </div>
        ) : activeTab === 'about' ? (
          /* About Us Page */
          <div className="my-2 sm:my-4 animate-fade-in">
            <AboutView
              onStartTool={handleSelectTool}
              onNavigateContact={() => handleNavigate('contact')}
            />
          </div>
        ) : activeTab === 'contact' ? (
          /* Contact Us Page */
          <div className="my-2 sm:my-4 animate-fade-in">
            <ContactView />
          </div>
        ) : activeTab === 'privacy' ? (
          /* Privacy Policy Page */
          <div className="my-2 sm:my-4 animate-fade-in">
            <PrivacyView />
          </div>
        ) : activeTab === 'help' ? (
          /* Help & Guidelines View */
          <div className="my-2 sm:my-4 animate-fade-in">
            <HelpView />
          </div>
        ) : (
          /* Home & Tools Overview */
          <div className="space-y-6 my-2 sm:my-4 animate-fade-in">
            
            {/* Exam Notice Banner */}
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-gradient-to-r from-[#0B2F5C] via-[#0F3B72] to-[#124B91] text-white rounded-2xl p-5 sm:p-7 shadow-md relative overflow-hidden">
                {/* Decorative Tiranga accent strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div className="w-1/3 bg-[#FF9933]" />
                  <div className="w-1/3 bg-white" />
                  <div className="w-1/3 bg-[#138808]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs">
                        Exam Standard
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline Client-Side Tool
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                      Indian Exams Photo &amp; Document Tools
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Instant, pixel-perfect formatting for SSC CGL/CHSL, UPSC Civil Services, Railway RRB, IBPS Bank, and State PSC applications. Zero watermark, strictly compliant file sizes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleSelectTool('photo20kb')}
                      className="px-4 py-2.5 bg-[#FF9933] hover:bg-[#F28B20] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Start 20KB Photo Maker</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSelectTool('signature10kb')}
                      className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Clean Signature (10KB)</span>
                    </button>
                  </div>
                </div>

                {/* Subtle N Logo watermark background */}
                <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none select-none">
                  <img
                    src="/nandu-logo.svg"
                    alt=""
                    className="w-56 h-56 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* 4 Tool Cards Grid with Anchor for Tools Navigation */}
            <div id="tools-section" className="scroll-mt-20">
              <ToolCardsGrid onSelectTool={handleSelectTool} activeTool={activeTool} />
            </div>

            {/* Trust & Verification Badges */}
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0B2F5C]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Hardware Accelerated</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Processes photos at 300 DPI directly on your phone CPU/GPU with instant preview.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">UIDAI Masking Support</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Masked Aadhaar feature protects against unauthorized identity misuse.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Zero Rejection Guarantee</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Precise file bounds ensure forms never reject images for size violations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* 4. Bottom Advertisement Placeholder (before footer as requested) */}
      <AdPlaceholder slotId="footer-banner" className="mt-6" />

      {/* 5. Footer with Developed by Nandu Sharma */}
      <Footer onNavigate={handleNavigate} onScrollToTools={handleScrollToTools} />

      {/* 6. Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'tools') {
            handleScrollToTools();
          } else {
            handleNavigate(tab);
          }
        }}
      />

      {/* 7. Offline PWA Indicator Toast */}
      <OfflineIndicator />
    </div>
  );
}
