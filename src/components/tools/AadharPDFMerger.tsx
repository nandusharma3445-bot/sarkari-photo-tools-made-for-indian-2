import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, Download, FileText, CheckCircle, ShieldCheck, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface AadharMergerProps {
  onBack?: () => void;
}

export const AadharPDFMerger: React.FC<AadharMergerProps> = ({ onBack }) => {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [layout, setLayout] = useState<'a4-xerox' | 'side-by-side'>('a4-xerox');
  const [maskAadhaar, setMaskAadhaar] = useState<boolean>(true);
  const [selfAttest, setSelfAttest] = useState<boolean>(false);
  const [applicantName, setApplicantName] = useState<string>('');
  
  // Output state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSizeKB, setFileSizeKB] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // File Upload Handlers
  const handleUploadFront = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFrontImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBackImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Demo Aadhaar Card Generator (Generates compliant sample front & back)
  const loadDemoCards = () => {
    // Generate Front
    const fc = document.createElement('canvas');
    fc.width = 600;
    fc.height = 380;
    const fctx = fc.getContext('2d')!;

    // Card white background & subtle border
    fctx.fillStyle = '#FFFFFF';
    fctx.fillRect(0, 0, 600, 380);
    fctx.strokeStyle = '#D1D5DB';
    fctx.lineWidth = 2;
    fctx.strokeRect(4, 4, 592, 372);

    // Tricolor top strip
    fctx.fillStyle = '#FF9933';
    fctx.fillRect(4, 4, 592, 10);
    fctx.fillStyle = '#FFFFFF';
    fctx.fillRect(4, 14, 592, 6);
    fctx.fillStyle = '#138808';
    fctx.fillRect(4, 20, 592, 10);

    // Header text
    fctx.fillStyle = '#B91C1C';
    fctx.font = 'bold 15px Arial';
    fctx.fillText('IDENTITY CARD • SAMPLE SPECIMEN', 80, 50);

    // Photo box
    fctx.fillStyle = '#E2E8F0';
    fctx.fillRect(35, 75, 115, 140);
    fctx.strokeStyle = '#94A3B8';
    fctx.strokeRect(35, 75, 115, 140);
    fctx.fillStyle = '#64748B';
    fctx.font = '12px Arial';
    fctx.textAlign = 'center';
    fctx.fillText('PHOTO', 92, 150);

    // Details
    fctx.textAlign = 'left';
    fctx.fillStyle = '#1E293B';
    fctx.font = 'bold 16px Arial';
    fctx.fillText('Rahul Kumar Sharma', 170, 100);
    fctx.font = '14px Arial';
    fctx.fillStyle = '#475569';
    fctx.fillText('Date of Birth / DOB: 12/04/1998', 170, 130);
    fctx.fillText('Gender: Male', 170, 155);

    // Aadhaar Number strip
    fctx.fillStyle = '#0B2F5C';
    fctx.font = 'bold 22px Courier, monospace';
    fctx.textAlign = 'center';
    fctx.fillText('5482  9104  3729', 300, 270);

    // Bottom red slogan
    fctx.fillStyle = '#B91C1C';
    fctx.font = 'bold 13px Arial';
    fctx.fillText('Identification Document Proof', 300, 340);

    setFrontImage(fc.toDataURL('image/jpeg', 0.95));

    // Generate Back
    const bc = document.createElement('canvas');
    bc.width = 600;
    bc.height = 380;
    const bctx = bc.getContext('2d')!;

    bctx.fillStyle = '#FFFFFF';
    bctx.fillRect(0, 0, 600, 380);
    bctx.strokeStyle = '#D1D5DB';
    bctx.lineWidth = 2;
    bctx.strokeRect(4, 4, 592, 372);

    // Tricolor top strip
    bctx.fillStyle = '#FF9933';
    bctx.fillRect(4, 4, 592, 10);
    bctx.fillStyle = '#FFFFFF';
    bctx.fillRect(4, 14, 592, 6);
    bctx.fillStyle = '#138808';
    bctx.fillRect(4, 20, 592, 10);

    // Address
    bctx.textAlign = 'left';
    bctx.fillStyle = '#1E293B';
    bctx.font = 'bold 14px Arial';
    bctx.fillText('Address:', 40, 70);
    bctx.font = '13px Arial';
    bctx.fillStyle = '#475569';
    bctx.fillText('S/O: Ramesh Sharma, House No. 45/B, Shanti Nagar,', 40, 95);
    bctx.fillText('Civil Lines, New Delhi, Delhi - 110001', 40, 120);

    // QR Code Box placeholder
    bctx.fillStyle = '#F8FAFC';
    bctx.fillRect(420, 65, 140, 140);
    bctx.strokeStyle = '#000000';
    bctx.strokeRect(420, 65, 140, 140);
    bctx.fillStyle = '#000000';
    bctx.font = 'bold 13px Arial';
    bctx.textAlign = 'center';
    bctx.fillText('SECURE QR', 490, 140);

    // Aadhaar number repeating at back
    bctx.fillStyle = '#0B2F5C';
    bctx.font = 'bold 22px Courier, monospace';
    bctx.textAlign = 'center';
    bctx.fillText('5482  9104  3729', 300, 270);

    // Help line
    bctx.fillStyle = '#B91C1C';
    bctx.font = 'bold 12px Arial';
    bctx.fillText('Helpline: 1947 | www.uidai.gov.in', 300, 340);

    setBackImage(bc.toDataURL('image/jpeg', 0.95));
  };

  // Render combined document
  useEffect(() => {
    if (!frontImage && !backImage) return;

    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    // Standard A4 aspect ratio at 150 DPI (874 x 1240 px)
    const cw = 874;
    const ch = 1240;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d')!;

    // Clean white A4 page background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cw, ch);

    // Document Header
    ctx.fillStyle = '#0B2F5C';
    ctx.fillRect(40, 40, cw - 80, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CANDIDATE APPLICATION DOCUMENT • IDENTIFICATION PROOF', cw / 2, 70);

    // Load and draw front & back images
    const loadImg = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(img);
      });
    };

    (async () => {
      let fImg: HTMLImageElement | null = null;
      let bImg: HTMLImageElement | null = null;

      if (frontImage) fImg = await loadImg(frontImage);
      if (backImage) bImg = await loadImg(backImage);

      const cardW = 540;
      const cardH = 340;
      const posX = (cw - cardW) / 2;

      // 1. Draw Front Card
      if (fImg) {
        // Label
        ctx.fillStyle = '#0B2F5C';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('1. AADHAAR CARD (FRONT SIDE)', posX, 130);

        ctx.drawImage(fImg, posX, 145, cardW, cardH);
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(posX, 145, cardW, cardH);

        // Mask Aadhaar first 8 digits if enabled
        if (maskAadhaar) {
          ctx.fillStyle = '#1E293B';
          // Draw mask badge over the number location
          const maskX = posX + 140;
          const maskY = 145 + cardH - 120;
          ctx.fillRect(maskX, maskY, 150, 30);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px Courier, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('XXXX-XXXX', maskX + 75, maskY + 20);
        }
      }

      // 2. Draw Back Card
      if (bImg) {
        const backY = 550;
        ctx.fillStyle = '#0B2F5C';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('2. AADHAAR CARD (BACK SIDE)', posX, backY);

        ctx.drawImage(bImg, posX, backY + 15, cardW, cardH);
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(posX, backY + 15, cardW, cardH);

        // Mask Aadhaar first 8 digits if enabled
        if (maskAadhaar) {
          ctx.fillStyle = '#1E293B';
          const maskX = posX + 140;
          const maskY = backY + 15 + cardH - 120;
          ctx.fillRect(maskX, maskY, 150, 30);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px Courier, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('XXXX-XXXX', maskX + 75, maskY + 20);
        }
      }

      // 3. Self Attestation Section
      const attestY = 970;
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(posX, attestY, cardW, 160);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(posX, attestY, cardW, 160);

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SELF ATTESTATION DECLARATION', posX + 20, attestY + 30);

      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('I hereby declare that this photocopy of my Aadhaar card is true and accurate.', posX + 20, attestY + 55);

      const nameDisplay = applicantName.trim() || 'Candidate Name';
      ctx.fillText(`Applicant Name: ${nameDisplay}`, posX + 20, attestY + 85);
      ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB')}`, posX + 20, attestY + 110);

      // Signature line on right
      ctx.strokeStyle = '#0B2F5C';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(posX + cardW - 180, attestY + 115);
      ctx.lineTo(posX + cardW - 20, attestY + 115);
      ctx.stroke();

      ctx.font = 'italic 12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0B2F5C';
      ctx.fillText('(Signature of Applicant)', posX + cardW - 100, attestY + 135);

      // Footer notice
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Generated via Sarkari Photo Tools • Candidate Photocopy Standard', cw / 2, ch - 30);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setFileSizeKB(+(blob.size / 1024).toFixed(1));
            setPreviewUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        0.85
      );
    })();
  }, [frontImage, backImage, maskAadhaar, selfAttest, applicantName]);

  // Download official PDF via jsPDF
  const downloadPDF = () => {
    if (!previewUrl) return;
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      // A4 dimensions: 210mm x 297mm
      pdf.addImage(img, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save('Aadhaar_Front_Back_Xerox_Govt.pdf');
    };
  };

  // Download JPEG image
  const downloadJPEG = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'Aadhaar_Front_Back_Xerox.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#0288D1] bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              ← Back to Tools
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0288D1] flex items-center gap-2">
              <span>Aadhar PDF Merger (Front &amp; Back)</span>
              <span className="text-[10px] bg-sky-100 text-[#0288D1] px-2 py-0.5 rounded-full font-bold">
                Xerox A4 PDF Standard
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Merges Front and Back into single printable Xerox sheet with UIDAI Masking.
            </p>
          </div>
        </div>

        <button
          onClick={loadDemoCards}
          className="text-xs font-semibold text-[#0288D1] bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0288D1]" />
          <span>Demo Cards</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Uploads & Security Controls (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Front & Back Upload Boxes */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              1. Upload Front &amp; Back Cards
            </label>

            {/* Front Box */}
            <div className="relative border-2 border-dashed border-sky-200 hover:border-[#0288D1] rounded-xl p-3 text-center bg-sky-50/20 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadFront}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-[#0288D1]" />
                <span className="text-xs font-bold text-[#0288D1]">
                  {frontImage ? '✓ Front Card Selected (Change)' : 'Select Front Side (Photo)'}
                </span>
              </div>
            </div>

            {/* Back Box */}
            <div className="relative border-2 border-dashed border-sky-200 hover:border-[#0288D1] rounded-xl p-3 text-center bg-sky-50/20 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadBack}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-[#0288D1]" />
                <span className="text-xs font-bold text-[#0288D1]">
                  {backImage ? '✓ Back Card Selected (Change)' : 'Select Back Side (Address)'}
                </span>
              </div>
            </div>
          </div>

          {/* UIDAI Privacy Masking */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Mask Aadhaar (UIDAI Rule)
                </label>
              </div>
              <input
                type="checkbox"
                checked={maskAadhaar}
                onChange={(e) => setMaskAadhaar(e.target.checked)}
                className="w-4 h-4 text-[#0288D1] accent-[#0288D1] rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              UIDAI strongly advises masking first 8 digits (<code>XXXX-XXXX-1234</code>) when submitting documents for security against identity theft.
            </p>
          </div>

          {/* Self-Attestation Details */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Applicant Details for Attestation
            </label>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. PRIYA SHARMA"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs font-semibold uppercase bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-[#0288D1] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Live A4 Document Preview & Download (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">A4 Xerox Sheet Preview</span>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                Ready for Exam Portals (&lt; 200 KB)
              </span>
            </div>

            {/* Document Preview */}
            <div className="w-full max-w-sm aspect-[1/1.414] bg-slate-100 rounded-xl overflow-hidden border-2 border-[#0288D1] shadow-sm flex items-center justify-center p-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Aadhaar Xerox Preview"
                  className="max-h-full max-w-full object-contain shadow-xs"
                />
              ) : (
                <div className="text-center text-slate-400 p-6">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-sky-200" />
                  <p className="text-xs font-semibold text-slate-600">No Cards Loaded</p>
                  <p className="text-[11px] text-slate-400">Upload Front &amp; Back or click &quot;Demo Cards&quot;.</p>
                </div>
              )}
            </div>

            {/* Downloads */}
            <div className="w-full max-w-sm mt-5 space-y-2.5">
              <button
                onClick={downloadPDF}
                disabled={!previewUrl || isProcessing}
                className="w-full py-3.5 px-4 bg-[#0B2F5C] hover:bg-[#072040] disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 text-[#FF9933]" />
                <span>Download A4 PDF Document</span>
              </button>

              <button
                onClick={downloadJPEG}
                disabled={!previewUrl || isProcessing}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download High-Res JPG Image</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard single-sheet format accepted across all central &amp; state portals</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
