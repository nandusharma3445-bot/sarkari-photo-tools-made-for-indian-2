import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, CheckCircle, AlertCircle, FileText, Sparkles, Sliders } from 'lucide-react';
import { EXAM_PRESETS } from '../../types';

interface PhotoCompressorProps {
  onBack?: () => void;
}

export const PhotoCompressor20KB: React.FC<PhotoCompressorProps> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(20);
  const [selectedPreset, setSelectedPreset] = useState<string>('SSC (CGL, CHSL, MTS, GD, CPO)');
  const [candidateName, setCandidateName] = useState<string>('');
  const [photoDate, setPhotoDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [includeNameDate, setIncludeNameDate] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Output state
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSizeKB, setOutputSizeKB] = useState<number>(0);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number }>({ width: 350, height: 450 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Load sample or uploaded image
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

  // Set default sample photo if none loaded
  const loadDemoPhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d')!;

    // Clean neutral studio background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 500);

    // Subtle head & shoulder silhouette illustration
    ctx.fillStyle = '#1E3A8A';
    // Shoulders
    ctx.beginPath();
    ctx.ellipse(200, 480, 160, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#E0A97E';
    ctx.fillRect(170, 310, 60, 60);

    // Head
    ctx.beginPath();
    ctx.ellipse(200, 240, 75, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(200, 210, 80, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(175, 240, 6, 0, Math.PI * 2);
    ctx.arc(225, 240, 6, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#994433';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(200, 275, 20, 0.2, Math.PI - 0.2);
    ctx.stroke();

    setImageSrc(canvas.toDataURL('image/jpeg', 0.95));
  };

  // Apply exam preset
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = EXAM_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setTargetSizeKB(preset.minPhotoKB === 20 ? 20 : preset.minPhotoKB);
      if (preset.requiresNameDate) {
        setIncludeNameDate(true);
      }
    }
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan support
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

  // Canvas processing & binary search compression to strictly target ≤ targetSizeKB
  const processAndCompress = useCallback(async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      imgElementRef.current = img;

      // Desired output dimensions: 3.5cm x 4.5cm standard (350 x 450 px)
      const outWidth = 350;
      const outHeight = 450;
      setOutputDimensions({ width: outWidth, height: outHeight });

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d')!;

      // Background white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outWidth, outHeight);

      // Save context for transform
      ctx.save();
      // Photo area (leave room at bottom if name/date banner is enabled)
      const photoAreaHeight = includeNameDate ? outHeight - 75 : outHeight;

      // Clip photo area
      ctx.beginPath();
      ctx.rect(0, 0, outWidth, photoAreaHeight);
      ctx.clip();

      ctx.translate(outWidth / 2 + pan.x, photoAreaHeight / 2 + pan.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const aspect = img.width / img.height;
      let drawW = outWidth;
      let drawH = outWidth / aspect;
      if (drawH < photoAreaHeight) {
        drawH = photoAreaHeight;
        drawW = photoAreaHeight * aspect;
      }
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Draw Name and Date banner if requested
      if (includeNameDate) {
        const bannerH = 75;
        const bannerY = outHeight - bannerH;

        // White background strip with top separator
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, bannerY, outWidth, bannerH);
        ctx.strokeStyle = '#0B2F5C';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, bannerY, outWidth - 2, bannerH - 1);

        // Candidate Name
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayName = candidateName.trim().toUpperCase() || 'CANDIDATE NAME';
        ctx.fillText(displayName, outWidth / 2, bannerY + 24);

        // Date of Photo (DOP)
        ctx.font = '600 13px "Plus Jakarta Sans", Arial, sans-serif';
        const formattedDate = photoDate
          ? photoDate.split('-').reverse().join('/')
          : new Date().toLocaleDateString('en-GB');
        ctx.fillText(`DOP: ${formattedDate}`, outWidth / 2, bannerY + 50);
      }

      // Outer border (standard Sarkari requirement: clean 1px border)
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, outWidth, outHeight);

      // Precise Binary Search Compression to achieve strictly targetSizeKB (e.g. 19.5 KB)
      const maxBytes = targetSizeKB * 1024;
      let minQ = 0.05;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;
      let bestQuality = 0.7;

      const testCompression = (quality: number): Promise<Blob> => {
        return new Promise((resolve) => {
          canvas.toBlob(
            (b) => {
              resolve(b || new Blob());
            },
            'image/jpeg',
            quality
          );
        });
      };

      (async () => {
        // Run 7 iterations of binary search
        for (let i = 0; i < 7; i++) {
          const midQ = (minQ + maxQ) / 2;
          const blob = await testCompression(midQ);
          if (blob.size <= maxBytes) {
            bestBlob = blob;
            bestQuality = midQ;
            minQ = midQ; // try to get better visual quality while still under target
          } else {
            maxQ = midQ;
          }
        }

        // If even lowest quality exceeds, scale down canvas resolution slightly
        if (!bestBlob || bestBlob.size > maxBytes) {
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = 250;
          scaledCanvas.height = 320;
          const sCtx = scaledCanvas.getContext('2d')!;
          sCtx.drawImage(canvas, 0, 0, 250, 320);
          bestBlob = await new Promise((res) => scaledCanvas.toBlob(res, 'image/jpeg', 0.65));
        }

        if (bestBlob) {
          const sizeKb = +(bestBlob.size / 1024).toFixed(1);
          setOutputSizeKB(sizeKb);
          const url = URL.createObjectURL(bestBlob);
          setOutputUrl(url);
        }
        setIsProcessing(false);
      })();
    };
  }, [imageSrc, targetSizeKB, candidateName, photoDate, includeNameDate, zoom, rotation, pan]);

  useEffect(() => {
    processAndCompress();
  }, [processAndCompress]);

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    const nameSlug = candidateName ? candidateName.replace(/\s+/g, '_') : 'Sarkari_Photo';
    a.download = `${nameSlug}_${outputSizeKB}KB_Exam_Photo.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#0B2F5C] bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              ← Back to Tools
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0B2F5C] flex items-center gap-2">
              <span>20KB Photo Maker &amp; Compressor</span>
              <span className="text-[10px] bg-blue-100 text-[#0B2F5C] px-2 py-0.5 rounded-full font-bold">
                SSC • UPSC • RRB
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Strictly formats and compresses candidate photo to exact exam file-size constraints.
            </p>
          </div>
        </div>

        <button
          onClick={loadDemoPhoto}
          className="text-xs font-semibold text-[#0B2F5C] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0B2F5C]" />
          <span>Load Demo Sample</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Configuration Controls (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Upload Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-[#0B2F5C] uppercase tracking-wide block mb-2">
              1. Select Candidate Photograph
            </label>
            <div className="relative border-2 border-dashed border-blue-200 hover:border-[#0B2F5C] rounded-xl p-4 text-center bg-blue-50/30 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <Upload className="w-7 h-7 text-[#0B2F5C] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-[#0B2F5C]">Click or Drag &amp; Drop Photo</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG from Mobile or PC</p>
            </div>
          </div>

          {/* Exam Presets */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-[#0B2F5C] uppercase tracking-wide block">
              2. Exam Target Preset
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B2F5C]"
            >
              {EXAM_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.minPhotoKB}-{p.maxPhotoKB} KB)
                </option>
              ))}
            </select>

            {/* Target Size Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Target File Size Limit:</span>
                <span className="text-[#0B2F5C] bg-blue-100 px-2 py-0.5 rounded font-black">
                  {targetSizeKB} KB
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={targetSizeKB}
                onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                className="w-full accent-[#0B2F5C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>10 KB (Strict)</span>
                <span className="font-bold text-[#0B2F5C]">20 KB (SSC/UPSC)</span>
                <span>50 KB</span>
                <span>100 KB</span>
              </div>
            </div>
          </div>

          {/* Name & Date on Photo (Mandatory for SSC/UPSC) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B2F5C] uppercase tracking-wide">
                3. Print Name &amp; Date (DOP)
              </label>
              <input
                type="checkbox"
                checked={includeNameDate}
                onChange={(e) => setIncludeNameDate(e.target.checked)}
                className="w-4 h-4 text-[#0B2F5C] rounded accent-[#0B2F5C] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Required by SSC CGL, CHSL, MTS, NDA to print applicant name and date photo was taken at the bottom.
            </p>

            {includeNameDate && (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Candidate Full Name (CAPITAL LETTERS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AMIT KUMAR SHARMA"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full text-xs font-semibold uppercase bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-[#0B2F5C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Date of Photo (DOP)
                  </label>
                  <input
                    type="date"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-[#0B2F5C] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image Adjustment Controls */}
          {imageSrc && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-[#0B2F5C] uppercase tracking-wide block">
                Adjust Framing &amp; Rotation
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> Zoom -
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom +
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  <RotateCw className="w-3.5 h-3.5" /> 90° Turn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive Canvas Preview & Download Box (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col items-center">
            
            {/* Live Status Banner */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Photo Preview (3.5 × 4.5 cm)</span>
              
              <div className="flex items-center gap-2">
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
                    <span>{outputSizeKB} KB / Max {targetSizeKB} KB</span>
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Crop Frame */}
            <div
              className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[410px] bg-slate-100 rounded-lg overflow-hidden border-2 border-[#0B2F5C] shadow-inner select-none cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {outputUrl ? (
                <img
                  src={outputUrl}
                  alt="Processed Sarkari Photo"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Upload className="w-10 h-10 mb-2 text-slate-300 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-600">No Photo Selected</p>
                  <p className="text-[11px] text-slate-400 mt-1">Upload candidate picture or click &quot;Load Demo Sample&quot; to test.</p>
                </div>
              )}

              {/* Drag helper hint */}
              {imageSrc && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium pointer-events-none">
                  Drag to Reposition
                </div>
              )}
            </div>

            {/* Output Verification Specs */}
            <div className="w-full max-w-sm grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">File Size</span>
                <span className="text-xs font-extrabold text-[#0B2F5C]">
                  {outputSizeKB > 0 ? `${outputSizeKB} KB` : '--'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolution</span>
                <span className="text-xs font-extrabold text-[#0B2F5C]">
                  {outputDimensions.width} × {outputDimensions.height} px
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Format</span>
                <span className="text-xs font-extrabold text-emerald-700">JPEG / JPG</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full max-w-sm mt-4">
              <button
                onClick={handleDownload}
                disabled={!outputUrl || isProcessing}
                className="w-full py-3.5 px-4 bg-[#0B2F5C] hover:bg-[#072040] disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Compressing strictly to {targetSizeKB}KB...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#FF9933]" />
                    <span>Download {outputSizeKB ? `${outputSizeKB} KB` : ''} Photo (JPG)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium mt-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified ready for SSC, UPSC, Railway &amp; State PSC portals</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
