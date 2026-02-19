
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FilterSettings, INITIAL_FILTERS, PRINT_FORMATS, PrintFormat } from './types';
import { FilterControl } from './components/FilterControl';
import { Icon } from './components/Icon';
import { getAIEnhancementTips } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>(INITIAL_FILTERS);
  const [format, setFormat] = useState<PrintFormat>(PRINT_FORMATS[0]);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImage(dataUrl);
        setFilters(INITIAL_FILTERS);
        setAiTips(null);
        
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          imgRef.current = img;
          applyFilters();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply filters to canvas
  const applyFilters = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || !offscreenCanvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const offscreen = offscreenCanvasRef.current;
    const offCtx = offscreen.getContext('2d');

    if (!ctx || !offCtx) return;

    // We use high-res offscreen canvas for final output and a responsive one for preview
    const img = imgRef.current;
    
    // Set display canvas size (responsive)
    const container = canvas.parentElement;
    if (container) {
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;
      
      let drawWidth = img.width;
      let drawHeight = img.height;
      
      const ratio = Math.min(maxWidth / drawWidth, maxHeight / drawHeight);
      canvas.width = drawWidth * ratio;
      canvas.height = drawHeight * ratio;
      
      // Setup offscreen canvas at original resolution for "HD" quality
      offscreen.width = img.width;
      offscreen.height = img.height;

      const filterStr = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hueRotate}deg)
      `;

      // Draw preview
      ctx.filter = filterStr;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw HD version
      offCtx.filter = filterStr;
      offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
    }
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // AI Suggestions
  const handleAIAssist = async () => {
    if (!image) return;
    setIsAiLoading(true);
    try {
      const tips = await getAIEnhancementTips(image);
      setAiTips(tips);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Export High Quality
  const handleSave = () => {
    if (!offscreenCanvasRef.current) return;
    setIsExporting(true);
    setTimeout(() => {
      const dataUrl = offscreenCanvasRef.current!.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `HD_Studio_Edit_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setIsExporting(false);
    }, 500);
  };

  // Print Logic
  const handlePrint = () => {
    if (!offscreenCanvasRef.current) return;
    const dataUrl = offscreenCanvasRef.current.toDataURL('image/png', 1.0);
    const windowPrint = window.open('', '_blank');
    if (windowPrint) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Print HD Photo</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @page { size: auto; margin: 0; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      windowPrint.document.close();
    }
  };

  const updateFilter = (key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-950 no-print">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col p-6 overflow-y-auto no-print">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Icon name="crop" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">HD Print Studio</h1>
        </div>

        {!image ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl mb-4 w-full cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Icon name="upload" className="w-12 h-12 mx-auto mb-4 text-slate-500 group-hover:text-blue-500" />
                <p className="text-sm font-medium text-slate-300">Choose a high-res photo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 25MB</p>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Filters</h3>
                <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Icon name="refresh" className="w-3 h-3" /> Reset
                </button>
              </div>
              
              <FilterControl label="Brightness" value={filters.brightness} min={0} max={200} onChange={v => updateFilter('brightness', v)} unit="%" />
              <FilterControl label="Contrast" value={filters.contrast} min={0} max={200} onChange={v => updateFilter('contrast', v)} unit="%" />
              <FilterControl label="Saturation" value={filters.saturation} min={0} max={200} onChange={v => updateFilter('saturation', v)} unit="%" />
              <FilterControl label="Grayscale" value={filters.grayscale} min={0} max={100} onChange={v => updateFilter('grayscale', v)} unit="%" />
              <FilterControl label="Sepia" value={filters.sepia} min={0} max={100} onChange={v => updateFilter('sepia', v)} unit="%" />
              <FilterControl label="Blur" value={filters.blur} min={0} max={10} step={0.1} onChange={v => updateFilter('blur', v)} unit="px" />
              <FilterControl label="Hue Rotate" value={filters.hueRotate} min={0} max={360} onChange={v => updateFilter('hueRotate', v)} unit="°" />
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Print Format</h3>
              <div className="grid grid-cols-2 gap-2">
                {PRINT_FORMATS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFormat(f)}
                    className={`text-xs p-3 rounded-lg border transition-all text-left ${format.name === f.name ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-600'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="pt-4 border-t border-slate-800">
              <button
                onClick={handleAIAssist}
                disabled={isAiLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <span className="animate-pulse">Analyzing...</span>
                ) : (
                  <>
                    <Icon name="sparkles" className="w-4 h-4" /> AI Enhance Tips
                  </>
                )}
              </button>
              
              {aiTips && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 animate-fade-in">
                  <p className="text-xs leading-relaxed text-blue-100 italic">"{aiTips}"</p>
                </div>
              )}
            </section>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col bg-slate-950 overflow-hidden">
        {/* Header/Actions */}
        <header className="h-16 flex items-center justify-between px-6 bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             {image && (
                <span className="text-sm font-medium text-slate-400 hidden sm:inline">
                   {format.name} | {imgRef.current?.width} x {imgRef.current?.height} px
                </span>
             )}
          </div>
          <div className="flex items-center gap-3">
            {image && (
              <>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 rounded-lg font-semibold text-sm transition-all"
                >
                  <Icon name="print" className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={handleSave}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg font-semibold text-sm transition-all border border-slate-700"
                >
                  <Icon name="save" className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Save HD'}
                </button>
                <button
                  onClick={() => { setImage(null); setAiTips(null); }}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <Icon name="refresh" className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
          {!image ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-2xl">
                <Icon name="upload" className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Ready for High-Def Printing</h2>
              <p className="text-slate-500 max-w-sm mx-auto">Upload your favorite memories and optimize them with pro filters and AI-powered intelligence.</p>
            </div>
          ) : (
            <div className="relative shadow-2xl shadow-black/50 border border-slate-800 max-w-full max-h-full">
               {/* Hidden HD Canvas */}
               <canvas ref={offscreenCanvasRef} className="hidden" />
               {/* Visible Responsive Canvas */}
               <canvas ref={canvasRef} className="max-w-full max-h-full block object-contain" />
            </div>
          )}
        </div>

        {/* Format Selection Overlay for Print Logic */}
        {image && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-800 flex items-center gap-6 shadow-2xl z-20 hidden md:flex">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-r border-slate-700 pr-4">
                <Icon name="info" className="w-4 h-4" /> HD MODE ENABLED
             </div>
             <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Resolution</span>
                  <span className="text-xs text-blue-400 font-mono">300 DPI OPTIMIZED</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                  <span className="text-xs text-green-400 font-mono">READY TO PRINT</span>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Hidden printing helper */}
      <div className="print-only">
         {/* This is intentionally empty or could contain a simplified print layout if needed inside this frame */}
      </div>
    </div>
  );
};

export default App;
