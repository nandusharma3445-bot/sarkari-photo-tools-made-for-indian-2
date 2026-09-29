import React from 'react';
import { ShieldCheck, Lock, Cookie, Eye, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  const lastUpdated = 'September 29, 2026';

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 sm:py-6">
      {/* Policy Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2F5C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AdSense &amp; Privacy Compliant</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Last Updated: <strong className="text-slate-800">{lastUpdated}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At <strong className="text-slate-900">Sarkari Photo Tools</strong> (accessible from this application, developed by <strong className="text-slate-900">Nandu Sharma</strong>), candidate privacy is one of our primary priorities. This Privacy Policy document outlines the types of information that is collected and recorded, and how we use it, in strict compliance with Google AdSense terms and international privacy standards.
        </p>
      </div>

      {/* Critical Highlight: 100% Offline Client-Side Execution */}
      <div className="bg-emerald-50/80 border-2 border-emerald-300/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-base sm:text-lg">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Candidate Data Guarantee: 100% Client-Side In-Browser Processing</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
          <strong>We never upload your photos, signatures, or Aadhaar identity cards to any server.</strong> All compression algorithms (20KB photo maker, 10KB signature maker, 35x45mm passport cropping, and Aadhaar document merger) run purely within your web browser using HTML5 Canvas and client-side Web APIs. Your images and personal documents remain exclusively on your device at all times.
        </p>
      </div>

      {/* Structured Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        
        {/* Google AdSense & DoubleClick DART Cookies */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Cookie className="w-4 h-4 text-[#FF9933]" />
            <h2>Google AdSense &amp; DoubleClick DART Cookies</h2>
          </div>
          <p>
            Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ad Settings</a> or <a href="https://aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">www.aboutads.info</a>.
            </li>
            <li>
              Our AdSense publisher identity: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-xs">ca-pub-8750513120148607</code>.
            </li>
          </ul>
        </section>

        {/* Log Files */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-[#0B2F5C]" />
            <h2>Log Files</h2>
          </div>
          <p>
            Sarkari Photo Tools follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, and tracking users' movement on the website.
          </p>
        </section>

        {/* Third Party Privacy Policies */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Eye className="w-4 h-4 text-[#0B2F5C]" />
            <h2>Third-Party Advertising Partners</h2>
          </div>
          <p>
            Some of the advertisers on our site may use cookies and web beacons. Our advertising partner is:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Google AdSense</span>
              <span className="text-xs text-slate-500">Official Ad Delivery Partner</span>
            </div>
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#0B2F5C] hover:underline"
            >
              Google Privacy &amp; Terms &rarr;
            </a>
          </div>
        </section>

        {/* CCPA Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p>
            Under the CCPA, among other rights, California consumers have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>Request that a business disclose the categories and specific pieces of personal data collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data. <em>(Note: We do not sell any personal data)</em>.</li>
          </ul>
        </section>

        {/* GDPR Data Protection Rights */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            GDPR Data Protection Rights
          </h2>
          <p>
            We want to make sure you are fully aware of all of your data protection rights:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>The right to access</strong>: You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong>: You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong>: You have the right to request that we erase your personal data, under certain conditions.</li>
          </ul>
        </section>

        {/* Children's Information */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Children's Information
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Sarkari Photo Tools does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>

        {/* Contact Information */}
        <section className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Mail className="w-4 h-4 text-[#0B2F5C]" />
            <h2>Contact Regarding Privacy</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            If you have any questions or require more information about our Privacy Policy, do not hesitate to contact our founder:
          </p>
          <div className="space-y-1 text-xs text-slate-800 font-medium">
            <p><strong>Founder:</strong> Nandu Sharma</p>
            <p><strong>Email:</strong> <a href="mailto:nandusharma3445@gmail.com" className="text-blue-600 hover:underline">nandusharma3445@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:9625766541" className="text-blue-600 hover:underline">+91 9625766541</a></p>
            <p><strong>Address:</strong> Delhi, India</p>
          </div>
        </section>

      </div>
    </div>
  );
};
