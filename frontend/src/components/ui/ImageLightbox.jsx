import { useState, useEffect, useRef, useCallback } from 'react';
import { useLightbox } from '../../context/LightboxContext';

const MIN_SCALE = 0.5;
const MAX_SCALE = 10;
const ZOOM_STEP = 0.25;

export default function ImageLightbox() {
  const { lightbox, closeLightbox } = useLightbox();
  const { isOpen, src, title, subtitle } = lightbox;

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Reset view when opening a new image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, src]);

  // Keyboard support: Escape, +/-
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(MAX_SCALE, +(s + ZOOM_STEP).toFixed(2)));
      if (e.key === '-') setScale(s => Math.max(MIN_SCALE, +(s - ZOOM_STEP).toFixed(2)));
      if (e.key === '0') { setScale(1); setOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeLightbox]);

  // Wheel to zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(s + delta).toFixed(2))));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel]);

  // Pan / Drag — mouseup listened on window so releasing outside container works correctly
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const stopDrag = useCallback(() => setIsDragging(false), []);

  // Attach mousemove + mouseup to window so drag works even outside the container
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [isOpen, handleMouseMove, stopDrag]);

  const handleZoomIn = () => setScale(s => Math.min(MAX_SCALE, +(s + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setScale(s => Math.max(MIN_SCALE, +(s - ZOOM_STEP).toFixed(2)));
  const handleReset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'rgba(5, 8, 22, 0.92)', backdropFilter: 'blur(12px)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-dark-surface/60 backdrop-blur shrink-0 z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-white font-semibold text-sm truncate max-w-[60vw]">{title}</span>
          {subtitle && <span className="text-slate-400 text-xs mt-0.5 truncate max-w-[60vw]">{subtitle}</span>}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom percentage */}
          <span className="text-xs font-mono bg-dark-bg border border-dark-border px-3 py-1.5 rounded-lg text-primary min-w-[62px] text-center">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            className="p-2 rounded-lg bg-dark-bg border border-dark-border text-slate-300 hover:text-white hover:border-primary/60 disabled:opacity-30 transition-all"
            title="Zoom Out (−)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            className="p-2 rounded-lg bg-dark-bg border border-dark-border text-slate-300 hover:text-white hover:border-primary/60 disabled:opacity-30 transition-all"
            title="Zoom In (+)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>

          {/* Reset View */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-dark-bg border border-dark-border text-slate-300 hover:text-white hover:border-primary/60 transition-all"
            title="Reset View (0)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>

          <div className="w-px h-6 bg-dark-border mx-1" />

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="p-2 rounded-lg bg-dark-bg border border-dark-border text-slate-300 hover:text-red-400 hover:border-red-500/60 transition-all"
            title="Tutup (Esc)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center select-none"
        style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in' }}
        onMouseDown={handleMouseDown}
        onClick={(e) => { if (!isDragging && e.target === e.currentTarget) closeLightbox(); }}
      >
        <img
          src={src}
          alt={title}
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.12s ease-out',
            maxWidth: '90vw',
            maxHeight: '82vh',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Bottom hint bar */}
      <div className="shrink-0 flex items-center justify-center gap-6 py-2 text-slate-600 text-[11px] border-t border-white/5">
        <span>Scroll: Zoom</span>
        <span>·</span>
        <span>Drag: Geser</span>
        <span>·</span>
        <span>0: Reset</span>
        <span>·</span>
        <span>Esc: Tutup</span>
      </div>
    </div>
  );
}
