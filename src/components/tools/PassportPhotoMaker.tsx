import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, Grid, CheckCircle, Sliders, Sparkles, Printer } from 'lucide-react';

interface PassportPhotoProps {
  onBack?: () => void;
}

export const PassportPhotoMaker: React.FC<PassportPhotoProps> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);
  const [gridCount, setGridCount] = useState<number>(8); // 6, 8, 12, 16 on 4x6 sheet
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Outputs
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [sheetPhotoUrl, setSheetPhotoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // File upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Demo Portrait Generator
  const loadDemoPortrait = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 540;
    const ctx = canvas.getContext('2d')!;

    // Background white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 420, 540);

    // Dark formal blazer & collar
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(210, 520, 180, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // White shirt collar
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(170, 370);
    ctx.lineTo(210, 440);
    ctx.lineTo(250, 370);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#E2A980';
    ctx.fillRect(180, 320, 60, 60);

    // Face oval
    ctx.beginPath();
    ctx.ellipse(210, 240, 78, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.arc(210, 210, 85, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#27272A';
    ctx.beginPath();
    ctx.arc(185, 240, 6, 0, Math.PI * 2);
    ctx.arc(235, 240, 6, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = '#C98F65';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(210, 245);
    ctx.lineTo(215, 265);
    ctx.lineTo(205, 268);
    ctx.stroke();

    // Gentle smile
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(210, 285, 18, 0.2, Math.PI - 0.2);
    ctx.stroke();

    setImageSrc(canvas.toDataURL('image/jpeg', 0.95));
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Touch pan
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  // Process single 35x45mm photo and multi-photo sheet
  const renderPhotos = useCallback(() => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      // 1. Single Passport Photo: 350 x 450 px (35mm x 45mm @ 300 DPI)
      const pw = 350;
      const ph = 450;
      const singleCanvas = document.createElement('canvas');
      singleCanvas.width = pw;
      singleCanvas.height = ph;
      const sCtx = singleCanvas.getContext('2d')!;

      // Background
      sCtx.fillStyle = bgColor;
      sCtx.fillRect(0, 0, pw, ph);

      // Filters
      sCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      sCtx.save();
      sCtx.translate(pw / 2 + pan.x, ph / 2 + pan.y);
      sCtx.rotate((rotation * Math.PI) / 180);
      sCtx.scale(zoom, zoom);

      const aspect = img.width / img.height;
      let drawW = pw;
      let drawH = pw / aspect;
      if (drawH < ph) {
        drawH = ph;
        drawW = ph * aspect;
      }
      sCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      sCtx.restore();

      // Reset filter
      sCtx.filter = 'none';

      // 1px clean cutting border
      sCtx.strokeStyle = '#CBD5E1';
      sCtx.lineWidth = 1;
      sCtx.strokeRect(0, 0, pw, ph);

      const singleUrl = singleCanvas.toDataURL('image/jpeg', 0.95);
      setSinglePhotoUrl(singleUrl);

      // 2. Multi-Photo Printable 4x6" Sheet (1200 x 1800 px @ 300 DPI)
      const sheetW = 1200;
      const sheetH = 1800;
      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = sheetW;
      sheetCanvas.height = sheetH;
      const sheetCtx = sheetCanvas.getContext('2d')!;

      // Crisp White Photo Paper
      sheetCtx.fillStyle = '#FFFFFF';
      sheetCtx.fillRect(0, 0, sheetW, sheetH);

      // Sheet Title Header
      sheetCtx.fillStyle = '#0B2F5C';
      sheetCtx.font = 'bold 24px Arial, sans-serif';
      sheetCtx.textAlign = 'center';
      sheetCtx.fillText('PASSPORT SIZE 35x45mm PRINT SHEET (4x6 INCH)', sheetW / 2, 45);

      // Calculate Grid Layout (e.g., 8 photos = 2 cols x 4 rows or 4 cols x 2 rows)
      let cols = 2;
      let rows = 4;
      if (gridCount === 6) {
        cols = 2;
        rows = 3;
      } else if (gridCount === 8) {
        cols = 2;
        rows = 4;
      } else if (gridCount === 12) {
        cols = 3;
        rows = 4;
      } else if (gridCount === 16) {
        cols = 4;
        rows = 4;
      }

      const marginX = 80;
      const marginY = 80;
      const availableW = sheetW - marginX * 2;
      const availableH = sheetH - marginY * 2 - 30;

      const cellW = availableW / cols;
      const cellH = availableH / rows;

      const photoPrintW = Math.min(cellW - 20, (cellH - 20) * (3.5 / 4.5));
      const photoPrintH = photoPrintW * (4.5 / 3.5);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = marginX + c * cellW + (cellW - photoPrintW) / 2;
          const posY = marginY + 20 + r * cellH + (cellH - photoPrintH) / 2;

          // Draw passport photo instance
          sheetCtx.drawImage(singleCanvas, posX, posY, photoPrintW, photoPrintH);

          // Subtle cutting guideline ticks
          sheetCtx.strokeStyle = '#94A3B8';
          sheetCtx.lineWidth = 1;
          sheetCtx.setLineDash([4, 4]);
          sheetCtx.strokeRect(posX - 4, posY - 4, photoPrintW + 8, photoPrintH + 8);
          sheetCtx.setLineDash([]);
        }
      }

      // Bottom guidance note
      sheetCtx.fillStyle = '#64748B';
      sheetCtx.font = '16px Arial, sans-serif';
      sheetCtx.textAlign = 'center';
      sheetCtx.fillText('Cut along dotted lines. Standard 35mm x 45mm. Print on 4x6 Glossy Paper.', sheetW / 2, sheetH - 25);

      setSheetPhotoUrl(sheetCanvas.toDataURL('image/jpeg', 0.95));
      setIsProcessing(false);
    };
  }, [imageSrc, bgColor, zoom, rotation, pan, brightness, contrast, gridCount]);

  useEffect(() => {
    renderPhotos();
  }, [renderPhotos]);

  const downloadSingle = () => {
    if (!singlePhotoUrl) return;
    const a = document.createElement('a');
    a.href = singlePhotoUrl;
    a.download = `Passport_Photo_35x45mm.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSheet = () => {
    if (!sheetPhotoUrl) return;
    const a = document.createElement('a');
    a.href = sheetPhotoUrl;
    a.download = `Passport_Print_Sheet_${gridCount}_Photos_4x6.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#E65100] bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              ← Back to Tools
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#E65100] flex items-center gap-2">
              <span>Passport Photo Maker (35x45mm)</span>
              <span className="text-[10px] bg-orange-100 text-[#E65100] px-2 py-0.5 rounded-full font-bold">
                White BG • Printable 4x6 Sheet
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Standard 35x45mm format for Indian exams, applications &amp; passport photos with face alignment guide.
            </p>
          </div>
        </div>

        <button
          onClick={loadDemoPortrait}
          className="text-xs font-semibold text-[#E65100] bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
          <span>Demo Portrait</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Settings (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Upload Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              1. Upload Candidate Photo
            </label>
            <div className="relative border-2 border-dashed border-orange-200 hover:border-[#E65100] rounded-xl p-4 text-center bg-orange-50/20 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <Upload className="w-6 h-6 text-[#E65100] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-[#E65100]">Choose Portrait / Selfie</p>
              <p className="text-[11px] text-slate-400 mt-0.5">High clarity photo facing camera directly</p>
            </div>
          </div>

          {/* Background Color Options */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              2. Background Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Pure White', color: '#FFFFFF', desc: 'Passport, UPSC, SSC' },
                { label: 'Light Blue', color: '#DCEEFF', desc: 'State Police, Railways' },
                { label: 'Light Grey', color: '#F1F5F9', desc: 'Neutral studio look' },
                { label: 'Off-White', color: '#FDFBF7', desc: 'Soft warm white' },
              ].map((opt) => (
                <button
                  key={opt.color}
                  onClick={() => setBgColor(opt.color)}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition ${
                    bgColor === opt.color
                      ? 'border-[#E65100] ring-2 ring-[#E65100]/20 bg-orange-50/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs shrink-0 mt-0.5"
                    style={{ backgroundColor: opt.color }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Face Guideline & Print Sheet Options */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Face Alignment Oval Guide
              </label>
              <input
                type="checkbox"
                checked={showFaceGuide}
                onChange={(e) => setShowFaceGuide(e.target.checked)}
                className="w-4 h-4 text-[#E65100] accent-[#E65100] rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Shows ICAO 70-80% face coverage circle overlay to align head, chin and eyes correctly.
            </p>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Print Sheet Quantity (4×6&quot; Photo Paper)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[6, 8, 12, 16].map((num) => (
                  <button
                    key={num}
                    onClick={() => setGridCount(num)}
                    className={`py-1.5 text-xs font-bold rounded-lg border text-center transition ${
                      gridCount === num
                        ? 'bg-[#E65100] text-white border-[#E65100]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} Photos
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Adjustments */}
          {imageSrc && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Zoom &amp; Light Enhancer
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> Zoom -
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom +
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  <RotateCw className="w-3.5 h-3.5" /> 90° Turn
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Face Brightness:</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-[#E65100] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview & Downloads (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Passport Standard 35 × 45 mm</span>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">
                70-80% Face Area Standard
              </span>
            </div>

            {/* Passport Preview Box with Optional Overlay Guide */}
            <div
              className="relative w-[280px] h-[360px] bg-slate-100 rounded-xl overflow-hidden border-2 border-[#E65100] shadow-sm select-none cursor-move flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {singlePhotoUrl ? (
                <img
                  src={singlePhotoUrl}
                  alt="35x45mm Passport"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="text-center text-slate-400 p-6">
                  <Upload className="w-9 h-9 mx-auto mb-2 text-orange-200" />
                  <p className="text-xs font-semibold text-slate-600">No Photo Selected</p>
                  <p className="text-[11px] text-slate-400">Upload portrait photo or try Demo Portrait.</p>
                </div>
              )}

              {/* Face Guide SVG Overlay */}
              {showFaceGuide && imageSrc && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 280 360">
                    {/* Head Oval (70-80% of photo) */}
                    <ellipse
                      cx="140"
                      cy="170"
                      rx="72"
                      ry="95"
                      fill="none"
                      stroke="#FF9933"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {/* Eye Level Guide Line */}
                    <line x1="80" y1="165" x2="200" y2="165" stroke="#FF9933" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Chin Line */}
                    <line x1="110" y1="265" x2="170" y2="265" stroke="#FF9933" strokeWidth="1.5" />
                    <text x="140" y="45" fill="#E65100" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Align Face in Oval Guide
                    </text>
                  </svg>
                </div>
              )}
            </div>

            {/* Actions: Download Single or Printable Sheet */}
            <div className="w-full max-w-sm mt-5 space-y-2.5">
              
              <button
                onClick={downloadSingle}
                disabled={!singlePhotoUrl || isProcessing}
                className="w-full py-3 px-4 bg-[#E65100] hover:bg-orange-700 disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Single Photo (35x45mm JPG)</span>
              </button>

              <button
                onClick={downloadSheet}
                disabled={!sheetPhotoUrl || isProcessing}
                className="w-full py-3 px-4 bg-[#0B2F5C] hover:bg-[#072040] disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Printer className="w-4 h-4 text-[#FF9933]" />
                <span>Download {gridCount} Photos Print Sheet (4×6&quot;)</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 font-medium">
                💡 Take the 4×6&quot; sheet to any studio to print for ₹5 - ₹10.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
