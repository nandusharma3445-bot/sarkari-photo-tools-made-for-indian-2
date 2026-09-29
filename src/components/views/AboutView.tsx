import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, Code2, Heart, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolId } from '../../types';

interface AboutViewProps {
  onStartTool: (toolId: ToolId) => void;
  onNavigateContact: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartTool, onNavigateContact }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B2F5C] via-[#0D3B73] to-[#124B91] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/10">
        {/* Tiranga strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Founder Avatar with N Logo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] shadow-2xl">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src="/nandu-logo.svg"
                    alt="Nandu Sharma Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#0B2F5C] shadow-md" title="Active Developer">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Founder & Developer</span>
            </div>
          </div>

          {/* Intro Text */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Student Developer Initiative</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              About Nandu Sharma
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Hello! I'm <strong className="text-white font-bold">Nandu Sharma</strong>, an enthusiastic student developer from <strong className="text-amber-300 font-bold">Delhi, India</strong>. I developed <strong className="text-white font-bold">Sarkari Photo Tools</strong> with one single mission: to eliminate the frustration students and job aspirants face every day while resizing photos and signatures for competitive government examinations.
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs">
              <a
                href="mailto:nandusharma3445@gmail.com"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/20 transition-all font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>nandusharma3445@gmail.com</span>
              </a>
              <a
                href="tel:9625766541"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/20 transition-all font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 9625766541</span>
              </a>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-xl border border-white/20 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Delhi, India</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Why I Built This Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2F5C] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>The Story & Motivation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Why I Built Sarkari Photo Tools
          </h2>
        </div>

        <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
          <p>
            Every year, tens of millions of students in India fill out online registration forms for <strong className="text-slate-900">SSC CGL, CHSL, MTS, GD, UPSC Civil Services, NDA, CDS, Railway RRB NTPC/Group D, IBPS Bank exams, and State PSCs</strong>.
          </p>
          <p>
            Almost every single portal has strict, unforgiving upload constraints:
          </p>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 not-prose">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-bold text-[#0B2F5C] uppercase tracking-wide">The Photo Size Headache</span>
              <p className="text-xs sm:text-sm text-slate-700">
                Most portals demand photographs strictly between <strong>20KB to 50KB</strong>, or exact 3.5cm × 4.5cm dimensions. Regular phone cameras capture 5MB+ photos that get immediately rejected.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Strict 10KB Signature Rule</span>
              <p className="text-xs sm:text-sm text-slate-700">
                Signatures must be strictly between <strong>10KB to 20KB</strong> on a clear white background with black/blue ink, without shadows or blur.
              </p>
            </div>
          </div>

          <p>
            Cyber cafes frequently charge students ₹50 to ₹100 just to resize a photo. Worse, shady online image converters upload sensitive personal photos and identity documents to unknown third-party servers, posing severe privacy risks.
          </p>

          <p>
            Being a student developer from Delhi, I decided to build a <strong className="text-slate-900">100% free, 100% offline, privacy-first progressive web app</strong> that solves these problems right in the candidate's phone browser.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0B2F5C] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your photos never leave your device. All compression and cropping runs on your device's browser canvas.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">100% Free Forever</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No subscriptions, no hidden fees, no credit card, and zero obnoxious watermarks on your downloaded documents.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Made for Indian Exams</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tested rigorously against official specifications for SSC, UPSC, Railway RRB, IBPS, and State PSCs.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#0B2F5C] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Have a question or feedback?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Reach out directly to Nandu Sharma or try out the tools right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onStartTool('photo20kb')}
            className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F28B20] text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Try Photo Tool</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateContact}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <span>Contact Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};
