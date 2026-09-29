import React, { useState } from 'react';
import { EXAM_PRESETS } from '../../types';
import { HelpCircle, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Shield, Info } from 'lucide-react';

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do government portals like SSC and UPSC reject photos?',
      a: 'Photos are commonly rejected for four major reasons: 1) File size is above 20KB or 50KB, 2) Background is dark, textured or patterned rather than plain white or light, 3) Candidate is wearing sunglasses, spectacles with glare, or cap/hat, 4) Photo is older than 3 months or missing the printed Name & Date of Photo (DOP) mandated by SSC.',
    },
    {
      q: 'How does the 20KB Photo Compressor guarantee size under 20KB without blurring?',
      a: 'Our tool utilizes a specialized browser-native binary search algorithm across JPEG quality tables and canvas downsampling. It adjusts compression until the resulting byte size strictly settles between 18.5 KB and 19.9 KB while preserving sharp facial features.',
    },
    {
      q: 'Why must signatures have a pure white background?',
      a: 'When you photograph a signature on paper with a mobile phone, room lighting casts shadows, making the paper appear grey, brown or yellowish. Automated OCR verification systems reject non-white backgrounds. Our Signature Maker removes paper shading and renders pure #FFFFFF white paper with high-contrast ink.',
    },
    {
      q: 'What is a Masked Aadhaar and why is it recommended?',
      a: 'A Masked Aadhaar displays only the last 4 digits of the 12-digit Aadhaar number while replacing the first 8 digits with "XXXX-XXXX". According to UIDAI guidelines, masked Aadhaar is legally valid for identity verification while preventing identity theft.',
    },
    {
      q: 'Are my photos and Aadhaar cards uploaded to any external server?',
      a: 'No. Absolutely not. The entire portal operates 100% on client-side HTML5 Canvas. Your images never leave your computer or smartphone, guaranteeing total privacy.',
    },
    {
      q: 'How can I print the 35x45mm Passport Photos cheaply?',
      a: 'Use our Passport Photo Maker and click "Download Print Sheet (4x6)". Save the resulting image to your phone and take it to any photo studio or cyber cafe. Printing a 4x6" photo sheet costs only ₹5 to ₹10, giving you 8 to 16 full passport photos!',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Help Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0B2F5C] flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0B2F5C]">
              Candidate Helpdesk &amp; Photo Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive reference for SSC, UPSC, Railway, Banking, and Defense recruitment specifications.
            </p>
          </div>
        </div>
      </div>

      {/* Official Guidelines Matrix Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs overflow-hidden">
        <h3 className="text-sm font-black text-[#0B2F5C] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#FF9933]" />
          <span>Government Exam Specifications Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-3">Examination Body</th>
                <th className="p-3">Photo Limit</th>
                <th className="p-3">Signature Limit</th>
                <th className="p-3">Dimensions</th>
                <th className="p-3">Name &amp; Date (DOP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EXAM_PRESETS.map((preset, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    <div>{preset.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{preset.category}</span>
                  </td>
                  <td className="p-3 text-emerald-700 font-bold">
                    {preset.minPhotoKB} KB - {preset.maxPhotoKB} KB
                  </td>
                  <td className="p-3 text-blue-700 font-bold">
                    {preset.minSignKB} KB - {preset.maxSignKB} KB
                  </td>
                  <td className="p-3 text-slate-600">{preset.photoDimensions}</td>
                  <td className="p-3">
                    {preset.requiresNameDate ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Optional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-[#0B2F5C] uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>Frequently Asked Questions (FAQ)</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50/60 hover:bg-slate-100/60 transition"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 pr-2">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3.5 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Checklist Before Uploading to Govt Portals */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 text-amber-950">
        <h3 className="text-sm font-black text-amber-900 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-[#FF9933]" />
          <span>Final Verification Checklist Before Online Submission</span>
        </h3>
        <ul className="text-xs space-y-1.5 text-amber-900/90 pl-1">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Ensure photo has plain white or very light background without any scenery or shadows.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Face should occupy 70% to 80% of photo area with both ears clearly visible.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Do NOT wear spectacles, dark glasses, caps, or headgear (except religious turbans/hijabs where face is fully clear).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Signatures must be done in continuous running handwriting—BLOCK/CAPITAL letters signature will be summarily rejected.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
