import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ActiveTab } from '../types';
import { Download, Smartphone, Monitor, CheckCircle, X, Menu, Home, Wrench, User, Mail, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onScrollToTools: () => void;
  onOpenHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onScrollToTools,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [showInstalledModal, setShowInstalledModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) {
        setShowInstalledModal(true);
      }
    } else if (isInstalled) {
      setShowInstalledModal(true);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  const navItems = [
    { label: 'Home', tab: 'home' as ActiveTab, icon: Home, action: () => onNavigate('home') },
    { label: 'Tools', tab: 'tools' as ActiveTab, icon: Wrench, action: onScrollToTools },
    { label: 'About Us', tab: 'about' as ActiveTab, icon: User, action: () => onNavigate('about') },
    { label: 'Contact', tab: 'contact' as ActiveTab, icon: Mail, action: () => onNavigate('contact') },
    { label: 'Privacy Policy', tab: 'privacy' as ActiveTab, icon: ShieldAlert, action: () => onNavigate('privacy') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B2F5C] text-white shadow-lg border-b-2 border-[#FF9933]/70">
      {/* Indian National Tricolor Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Brand Identity with N Logo & Developer Tag */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
            title="Sarkari Photo Tools - Home"
          >
            {/* N Logo + "By Nandu Sharma" */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md border-2 border-amber-300 flex items-center justify-center transition-transform group-hover:scale-105 bg-white">
                  <img
                    src="/nandu-logo.svg"
                    alt="Nandu Sharma Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#138808] border border-white items-center justify-center text-[7px] text-white font-bold">✓</span>
                </span>
              </div>
              <span className="text-[8px] sm:text-[9.5px] text-amber-200/90 font-bold mt-0.5 tracking-tight whitespace-nowrap">
                By Nandu Sharma
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white leading-tight">
                  Sarkari Photo Tools
                </h1>
              </div>
              <span className="text-[10px] sm:text-xs text-amber-200/80 font-medium hidden sm:inline-block">
                Made for Indian Exams
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FF9933] text-slate-950 shadow-xs'
                      : 'text-slate-200 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Install App Button + Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install App Button */}
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border border-blue-400/40"
              title="Install App"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="font-extrabold tracking-wide whitespace-nowrap">Install App</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#071F3D] border-t border-white/15 px-4 pt-3 pb-4 space-y-2 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    item.action();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                    isActive
                      ? 'bg-[#FF9933] text-slate-950'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Developer: Nandu Sharma</span>
            <span className="text-amber-300 font-semibold">Delhi, India</span>
          </div>
        </div>
      )}

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B2F5C]">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-500">Fast offline access from home screen</p>
                </div>
              </div>
              <button onClick={() => setShowIOSModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ol className="text-xs space-y-2.5 text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2563EB] bg-white w-5 h-5 rounded-full flex items-center justify-center border shadow-xs shrink-0">1</span>
                <span>Tap the <strong>Share button</strong> (box with arrow up) at the bottom of Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2563EB] bg-white w-5 h-5 rounded-full flex items-center justify-center border shadow-xs shrink-0">2</span>
                <span>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2563EB] bg-white w-5 h-5 rounded-full flex items-center justify-center border shadow-xs shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner to complete.</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white hover:bg-[#1D4ED8] transition shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Generic Browser Guided Install Modal */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B2F5C]">Install Sarkari App</h3>
                  <p className="text-xs text-slate-500">Standalone fast desktop / phone app</p>
                </div>
              </div>
              <button onClick={() => setShowGenericModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs space-y-2 text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              <p>
                To install this app on your device:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Look for the <strong>Install icon (computer/download arrow)</strong> in your browser&apos;s address bar.</li>
                <li>Or tap the <strong>browser menu (⋮)</strong> &gt; select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
              </ul>
              <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                ✓ Works 100% offline without internet connection once installed.
              </p>
            </div>
            <button
              onClick={() => setShowGenericModal(false)}
              className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white hover:bg-[#1D4ED8] transition shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Already Installed Modal */}
      {showInstalledModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#0B2F5C]">App Ready &amp; Installed</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sarkari Photo Tools is installed on your device with full offline capabilities!
            </p>
            <button
              onClick={() => setShowInstalledModal(false)}
              className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white hover:bg-[#1D4ED8] transition shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
