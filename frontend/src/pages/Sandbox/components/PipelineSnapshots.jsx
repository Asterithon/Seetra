import React from 'react';
import { useLightbox } from '../../../context/LightboxContext';

export default function PipelineSnapshots({ snapshots }) {
  const { openLightbox } = useLightbox();

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 custom-scrollbar min-h-[140px] items-center">
      {snapshots && snapshots.length > 0 ? (
        snapshots.map((snap, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-36 bg-dark-surface rounded-lg border border-dark-border overflow-hidden group/snap relative cursor-zoom-in"
            onClick={() => openLightbox({ src: snap.image, title: snap.title, subtitle: `Pipeline Step ${idx + 1}` })}
          >
            <div className="h-24 bg-black/50 flex items-center justify-center p-1 relative">
              <img src={snap.image} alt={snap.title} className="max-h-full max-w-full object-contain transition-transform group-hover/snap:scale-105" />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/snap:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                <span className="text-white text-[10px] bg-black/50 px-2 py-0.5 rounded">🔍 Perbesar</span>
              </div>
            </div>
            <div className="p-2 text-center text-[10px] text-slate-300 border-t border-dark-border font-medium break-words bg-dark-surface z-10">
              {snap.title}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full text-center text-slate-500 text-sm italic py-8">
          Unggah gambar untuk melihat snapshot setiap tahap proses operasi secara individu.
        </div>
      )}
    </div>
  );
}
