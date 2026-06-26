import React from 'react';
import { useLightbox } from '../../../context/LightboxContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function PipelineSnapshots({ snapshots }) {
  const { openLightbox } = useLightbox();
  const { t } = useLanguage();

  const getSnapshotTitle = (snap, idx) => {
    if (!snap.op_key) return snap.title; // fallback
    const baseLabel = t(`op.${snap.op_key}`);
    let details = '';
    if (snap.params) {
      if (snap.op_key === 'translate_x' && snap.params.tx !== undefined) {
        details = ` (${snap.params.tx}px)`;
      } else if (snap.op_key === 'translate_y' && snap.params.ty !== undefined) {
        details = ` (${snap.params.ty}px)`;
      } else if (snap.op_key === 'rotate' && snap.params.angle !== undefined) {
        details = ` (${snap.params.angle}°)`;
      } else if (snap.op_key === 'scale' && snap.params.scale !== undefined) {
        details = ` (${snap.params.scale}x)`;
      } else if (snap.op_key === 'brightness' && snap.params.brightness !== undefined) {
        details = ` (${snap.params.brightness})`;
      } else if (snap.op_key === 'contrast' && snap.params.contrast !== undefined) {
        details = ` (${snap.params.contrast}x)`;
      } else if (snap.op_key === 'threshold' && snap.params.threshold !== undefined) {
        details = ` (${snap.params.threshold})`;
      } else if (snap.op_key === 'binarize' && snap.params.threshold !== undefined) {
        details = ` (${snap.params.threshold})`;
      } else if (snap.op_key === 'mean_filter' && snap.params.mean_size !== undefined) {
        details = ` (${snap.params.mean_size}x${snap.params.mean_size})`;
      } else if (snap.op_key === 'median_filter' && snap.params.median_size !== undefined) {
        details = ` (${snap.params.median_size}x${snap.params.median_size})`;
      } else if (snap.op_key === 'edge_canny' && snap.params.low !== undefined && snap.params.high !== undefined) {
        details = ` (${snap.params.low},${snap.params.high})`;
      } else if (['morph_dilate', 'morph_erode', 'morph_open', 'morph_close'].includes(snap.op_key) && snap.params.kernel_size !== undefined) {
        details = ` (${snap.params.kernel_size}x${snap.params.kernel_size})`;
      } else if (snap.op_key === 'segment_threshold' && snap.params.val !== undefined && snap.params.mode !== undefined) {
        details = ` (${snap.params.mode.toUpperCase()}:${snap.params.val})`;
      } else if (snap.op_key === 'segment_adaptive' && snap.params.method !== undefined && snap.params.block !== undefined) {
        details = ` (${snap.params.method.toUpperCase()}, ${snap.params.block}x${snap.params.block})`;
      } else if (snap.op_key === 'segment_otsu' && snap.params.otsu_val !== undefined) {
        details = ` (Optimal: ${Math.round(snap.params.otsu_val)})`;
      } else if (snap.op_key === 'segment_kmeans' && snap.params.k !== undefined) {
        details = ` (K=${snap.params.k})`;
      }
    }
    return `${idx + 1}. ${baseLabel}${details}`;
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 custom-scrollbar min-h-[140px] items-center">
      {snapshots && snapshots.length > 0 ? (
        snapshots.map((snap, idx) => {
          const title = getSnapshotTitle(snap, idx);
          return (
            <div
              key={idx}
              className="flex-shrink-0 w-36 bg-dark-surface rounded-lg border border-dark-border overflow-hidden group/snap relative cursor-zoom-in"
              onClick={() => openLightbox({ src: snap.image, title: title, subtitle: `${t('pipeline.step')} ${idx + 1}` })}
            >
              <div className="h-24 bg-black/50 flex items-center justify-center p-1 relative">
                <img src={snap.image} alt={title} className="max-h-full max-w-full object-contain transition-transform group-hover/snap:scale-105" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/snap:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <span className="text-white text-[10px] bg-black/50 px-2 py-0.5 rounded">{t('pipeline.zoom_hint')}</span>
                </div>
              </div>
              <div className="p-2 text-center text-[10px] text-slate-300 border-t border-dark-border font-medium break-words bg-dark-surface z-10">
                {title}
              </div>
            </div>
          );
        })
      ) : (
        <div className="w-full text-center text-slate-500 text-sm italic py-8">
          {t('pipeline.empty')}
        </div>
      )}
    </div>
  );
}
