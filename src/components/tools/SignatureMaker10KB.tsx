import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, Edit3, Trash2, CheckCircle, Sliders, Eraser, Sparkles, AlertCircle } from 'lucide-react';

interface SignatureMakerProps {
  onBack?: () => void;
}

export const SignatureMaker10KB: React.FC<SignatureMakerProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(10);
  const [threshold, setThreshold] = useState<number>(170); // Background white threshold (0-255)
  const [contrast, setContrast] = useState<number>(30); // Contrast boost
  const [inkColor, setInkColor] = useState<'black' | 'blue' | 'original'>('black');
  
  // Output state
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSizeKB, setOutputSizeKB] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Drawing Pad Refs & State
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Signature Generator for Demo
  const loadDemoSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 180;
    const ctx = canvas.getContext('2d')!;

    // Slightly off-white / yellowish paper background simulating phone photo
    ctx.fillStyle = '#E8E5DD';
    ctx.fillRect(0, 0, 400, 180);

    // Draw stylish Indian cursive signature
    ctx.strokeStyle = '#1A237E';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(60, 100);
    ctx.bezierCurveTo(80, 40, 110, 30, 120, 90);
    ctx.bezierCurveTo(125, 120, 135, 130, 150, 75);
    ctx.bezierCurveTo(160, 40, 180, 110, 200, 95);
    ctx.bezierCurveTo(220, 80, 250, 70, 280, 105);
    ctx.bezierCurveTo(290, 115, 310, 60, 330, 85);
    // Flourish underline with dots
    ctx.moveTo(70, 130);
    ctx.lineTo(320, 125);
    ctx.arc(335, 125, 2.5, 0, Math.PI * 2);
    ctx.arc(348, 125, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    setUploadedSrc(canvas.toDataURL('image/jpeg', 0.9));
  };

  // Setup drawing canvas
  useEffect(() => {
    if (mode === 'draw' && drawCanvasRef.current) {
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [mode]);

  // Touch & Mouse Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.strokeStyle = inkColor === 'blue' ? '#003399' : '#000000';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (mode === 'draw' && drawCanvasRef.current) {
      processSignatureFromCanvas(drawCanvasRef.current);
    }
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setOutputUrl(null);
    setOutputSizeKB(0);
  };

  // Image processing: Background Whitening + High Contrast Ink Extraction + Compression
  const processSignatureFromCanvas = useCallback(
    async (sourceCanvas: HTMLCanvasElement | HTMLImageElement) => {
      setIsProcessing(true);

      // Sarkari official signature dimension: 140 x 60 px or 280 x 120 px for high DPI
      const outWidth = 280;
      const outHeight = 120;

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d')!;

      // Draw source fitted inside
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outWidth, outHeight);

      let srcW = sourceCanvas.width;
      let srcH = sourceCanvas.height;
      if (sourceCanvas instanceof HTMLImageElement) {
        srcW = sourceCanvas.naturalWidth || sourceCanvas.width;
        srcH = sourceCanvas.naturalHeight || sourceCanvas.height;
      }

      // Aspect fit centered
      const scale = Math.min((outWidth - 16) / srcW, (outHeight - 16) / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const offsetX = (outWidth - drawW) / 2;
      const offsetY = (outHeight - drawH) / 2;

      ctx.drawImage(sourceCanvas, offsetX, offsetY, drawW, drawH);

      // Pixel-level Paper Whitening & Ink Boost Algorithm
      const imgData = ctx.getImageData(0, 0, outWidth, outHeight);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Perceived luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Background whitening: If luminance > threshold, turn to pure #FFFFFF
        if (lum > threshold) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Dark stroke enhancement: make ink darker & clean
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const adjustedLum = Math.max(0, factor * (lum - 128) + 128);

          if (inkColor === 'black') {
            const inkDarkness = Math.min(adjustedLum, 50);
            data[i] = inkDarkness;
            data[i + 1] = inkDarkness;
            data[i + 2] = inkDarkness;
          } else if (inkColor === 'blue') {
            data[i] = 0;
            data[i + 1] = 40;
            data[i + 2] = Math.min(180, adjustedLum + 70);
          } else {
            // Original tint enhanced
            data[i] = Math.max(0, r - 40);
            data[i + 1] = Math.max(0, g - 40);
            data[i + 2] = Math.max(0, b - 40);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw subtle thin border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, outWidth, outHeight);

      // Compression engine strictly aiming for targetSizeKB (e.g. 10KB)
      const maxBytes = targetSizeKB * 1024;
      let minQ = 0.1;
      let maxQ = 0.95;
      let bestBlob: Blob | null = null;

      for (let i = 0; i < 6; i++) {
        const midQ = (minQ + maxQ) / 2;
        const b: Blob = await new Promise((res) =>
          canvas.toBlob((blob) => res(blob || new Blob()), 'image/jpeg', midQ)
        );
        if (b.size <= maxBytes) {
          bestBlob = b;
          minQ = midQ;
        } else {
          maxQ = midQ;
        }
      }

      if (!bestBlob || bestBlob.size > maxBytes) {
        // Fallback: scale canvas slightly to guarantee under target
        const tinyCanvas = document.createElement('canvas');
        tinyCanvas.width = 180;
        tinyCanvas.height = 80;
        const tCtx = tinyCanvas.getContext('2d')!;
        tCtx.drawImage(canvas, 0, 0, 180, 80);
        bestBlob = await new Promise((res) => tinyCanvas.toBlob(res, 'image/jpeg', 0.6));
      }

      if (bestBlob) {
        const sizeKb = +(bestBlob.size / 1024).toFixed(1);
        setOutputSizeKB(sizeKb);
        setOutputUrl(URL.createObjectURL(bestBlob));
      }
      setIsProcessing(false);
    },
    [threshold, contrast, inkColor, targetSizeKB]
  );

  // Process uploaded image when ready
  useEffect(() => {
    if (mode === 'upload' && uploadedSrc) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedSrc;
      img.onload = () => {
        processSignatureFromCanvas(img);
      };
    }
  }, [mode, uploadedSrc, processSignatureFromCanvas]);

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `Sarkari_Signature_${outputSizeKB}KB.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3">
      {/* Top Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#138808] bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              ← Back to Tools
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#138808] flex items-center gap-2">
              <span>Signature Maker (10KB - 20KB)</span>
              <span className="text-[10px] bg-emerald-100 text-[#138808] px-2 py-0.5 rounded-full font-bold">
                Auto White Background
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Converts grey paper to pure white background and compresses strictly to 10KB - 20KB.
            </p>
          </div>
        </div>

        <button
          onClick={loadDemoSignature}
          className="text-xs font-semibold text-[#138808] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#138808]" />
          <span>Demo Signature</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Input Selection & Adjustments (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Mode Switcher: Upload Photo vs Draw on Canvas */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              1. Choose Input Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('upload')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                  mode === 'upload'
                    ? 'bg-[#138808] text-white border-[#138808] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload Photo
              </button>
              <button
                onClick={() => setMode('draw')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                  mode === 'draw'
                    ? 'bg-[#138808] text-white border-[#138808] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-4 h-4" /> Draw on Screen
              </button>
            </div>

            {/* Upload Area */}
            {mode === 'upload' && (
              <div className="mt-3 relative border-2 border-dashed border-emerald-200 hover:border-[#138808] rounded-xl p-4 text-center bg-emerald-50/30 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <Upload className="w-6 h-6 text-[#138808] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#138808]">Upload Signature Photo</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click photo of signature on blank paper</p>
              </div>
            )}

            {/* Drawing Canvas */}
            {mode === 'draw' && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-500 font-medium">
                  <span>Sign inside the box using finger or mouse:</span>
                  <button
                    onClick={clearDrawing}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
                  >
                    <Eraser className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
                <div className="border-2 border-dashed border-emerald-300 rounded-xl overflow-hidden bg-white shadow-inner">
                  <canvas
                    ref={drawCanvasRef}
                    width={360}
                    height={160}
                    className="w-full h-36 touch-none cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background Whitener & Ink Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              2. Background Whitening &amp; Ink
            </label>

            {/* Background Whiteness Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Remove Grey Paper Shadow:</span>
                <span className="text-[#138808] font-mono">{threshold}</span>
              </div>
              <input
                type="range"
                min="100"
                max="240"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-[#138808] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Preserve Light Strokes</span>
                <span className="font-bold text-[#138808]">Pure White Paper</span>
                <span>Aggressive Clean</span>
              </div>
            </div>

            {/* Ink Color Selector */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Ink Color (Exam Mandated)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setInkColor('black')}
                  className={`py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                    inkColor === 'black'
                      ? 'bg-black text-white border-black'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-black border border-white" />
                  Black Ink
                </button>
                <button
                  onClick={() => setInkColor('blue')}
                  className={`py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                    inkColor === 'blue'
                      ? 'bg-blue-800 text-white border-blue-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Blue Ink
                </button>
                <button
                  onClick={() => setInkColor('original')}
                  className={`py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                    inkColor === 'original'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Natural
                </button>
              </div>
            </div>

            {/* Target Size (10KB - 20KB) */}
            <div className="pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Maximum Target Size:</span>
                <span className="text-[#138808] bg-emerald-50 px-2 py-0.5 rounded font-black">
                  {targetSizeKB} KB
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setTargetSizeKB(sz)}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      targetSizeKB === sz
                        ? 'bg-[#138808] text-white border-[#138808]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sz} KB {sz === 10 ? '(SSC / UPSC)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clean White Paper Output & Download (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col items-center">
            
            {/* Live Indicator */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Exam Format (140 × 60 px / 4 × 2 cm)</span>
              {outputSizeKB > 0 && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    outputSizeKB <= targetSizeKB
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {outputSizeKB <= targetSizeKB ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{outputSizeKB} KB / Limit {targetSizeKB} KB</span>
                </span>
              )}
            </div>

            {/* Signature Preview Frame */}
            <div className="relative w-full max-w-md h-40 bg-white rounded-xl border-2 border-[#138808] shadow-sm flex items-center justify-center p-3 overflow-hidden">
              {outputUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-white p-2">
                  <img
                    src={outputUrl}
                    alt="Processed Sarkari Signature"
                    className="max-h-full max-w-full object-contain filter contrast-125"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Edit3 className="w-8 h-8 mx-auto mb-1 text-emerald-200 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-500">No Signature Ready</p>
                  <p className="text-[11px] text-slate-400">Upload photo or draw above to view instant cleaned signature.</p>
                </div>
              )}
            </div>

            {/* Specifications Card */}
            <div className="w-full max-w-sm grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Size</span>
                <span className="text-xs font-extrabold text-[#138808]">
                  {outputSizeKB > 0 ? `${outputSizeKB} KB` : '--'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Aspect</span>
                <span className="text-xs font-extrabold text-slate-700">140 × 60 px</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Paper BG</span>
                <span className="text-xs font-extrabold text-emerald-700">Pure White</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full max-w-sm mt-4">
              <button
                onClick={handleDownload}
                disabled={!outputUrl || isProcessing}
                className="w-full py-3.5 px-4 bg-[#138808] hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Compressing to {targetSizeKB}KB...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    <span>Download {outputSizeKB ? `${outputSizeKB} KB` : ''} Signature (JPG)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium mt-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valid for SSC CGL, UPSC Civil Services, IBPS &amp; RRB NTPC</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
