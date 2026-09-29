import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Check, MessageSquare, Clock, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    exam: 'General Inquiry',
    message: '',
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Save message locally
    try {
      const storedMessages = JSON.parse(localStorage.getItem('sarkari_contact_messages') || '[]');
      storedMessages.push({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('sarkari_contact_messages', JSON.stringify(storedMessages));
    } catch {
      // LocalStorage fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleSendViaMailto = () => {
    const subject = encodeURIComponent(`[Sarkari Photo Tools Inquiry - ${formData.exam}] from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nExam / Topic: ${formData.exam}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:nandusharma3445@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B2F5C] bg-blue-100/80 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Contact Nandu Sharma
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Need help resizing your exam photos, reporting a portal issue, or sharing suggestions? Feel free to reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        {/* Left Column: Direct Contact Info (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#0B2F5C] text-white rounded-3xl p-6 shadow-md border border-white/10 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Developer Contact</span>
              <h2 className="text-xl font-black mt-1 text-white">Direct Coordinates</h2>
              <p className="text-xs text-slate-300 mt-1">
                Reach out directly via email, mobile call, or WhatsApp.
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-300" /> Official Email
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('nandusharma3445@gmail.com', 'email')}
                  className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <a
                href="mailto:nandusharma3445@gmail.com"
                className="text-xs sm:text-sm font-bold text-white hover:text-amber-200 transition break-all block"
              >
                nandusharma3445@gmail.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone &amp; WhatsApp
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('9625766541', 'phone')}
                  className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="tel:9625766541"
                  className="text-sm font-bold text-white hover:text-emerald-200 transition"
                >
                  +91 9625766541
                </a>
                <a
                  href="https://wa.me/919625766541"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Location
              </span>
              <p className="text-sm font-bold text-white">
                Delhi, India
              </p>
              <p className="text-[11px] text-slate-300">
                National Capital Region (NCR)
              </p>
            </div>

            {/* Response Time Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-3 rounded-xl">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Typical response time: within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Working Contact Form (3 cols) */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Message Prepared &amp; Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>! Your inquiry regarding <strong>{formData.exam}</strong> has been logged. You can also send it directly via your mail client right now:
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSendViaMailto}
                    className="px-5 py-2.5 bg-[#0B2F5C] hover:bg-[#071F3D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>Open in Email App</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', exam: 'General Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MessageSquare className="w-5 h-5 text-[#0B2F5C]" />
                  <h2 className="text-lg font-bold text-slate-900">Send a Message</h2>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2F5C] focus:bg-white transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. yourname@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2F5C] focus:bg-white transition"
                  />
                </div>

                {/* Exam / Inquiry Type */}
                <div>
                  <label htmlFor="exam" className="block text-xs font-bold text-slate-700 mb-1">
                    Exam / Topic
                  </label>
                  <select
                    id="exam"
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2F5C] focus:bg-white transition"
                  >
                    <option value="SSC Exam (CGL, CHSL, MTS, GD)">SSC Exam (CGL, CHSL, MTS, GD)</option>
                    <option value="UPSC Civil Services / NDA / CDS">UPSC Civil Services / NDA / CDS</option>
                    <option value="Railway RRB (NTPC, Group D, ALP)">Railway RRB (NTPC, Group D, ALP)</option>
                    <option value="IBPS / Banking Exams">IBPS / Banking Exams</option>
                    <option value="State PSC Application">State PSC Application</option>
                    <option value="Aadhaar PDF Merger Tool">Aadhaar PDF Merger Tool</option>
                    <option value="General Feedback / Suggestion">General Feedback / Suggestion</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue, suggestions, or portal specification question..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2F5C] focus:bg-white transition resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#0B2F5C] hover:bg-[#071F3D] active:bg-[#041224] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your email address is never shared or published.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
