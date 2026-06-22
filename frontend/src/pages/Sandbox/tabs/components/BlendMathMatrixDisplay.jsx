import React, { useState } from 'react';

export default function BlendMathMatrixDisplay({ mathData }) {
  const [selectedPixel, setSelectedPixel] = useState(null);

  if (!mathData) {
    return (
      <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-500 overflow-x-auto min-h-[100px]">
        // Menunggu data matriks...
      </div>
    );
  }

  return (
    <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[100px]">
      <div className="flex flex-col gap-6 w-max">
        <p className="text-slate-500">// Klik salah satu sel piksel untuk melihat perhitungan rumusnya secara mendetail.</p>
        
        <div className="flex flex-row gap-6">
          {/* Image 1 */}
          <div>
            <p className="text-secondary font-semibold mb-2">Gambar 1</p>
            <div className="grid grid-cols-9 gap-[1px] max-w-fit bg-dark-border p-[1px]">
              {mathData.matrix_1.map((row, r) => 
                row.map((val, c) => {
                  const isSelected = selectedPixel?.r === r && selectedPixel?.c === c;
                  return (
                    <div 
                      key={`m1-${r}-${c}`} 
                      onClick={() => setSelectedPixel({r, c, val1: val, val2: mathData.matrix_2[r][c], valResult: mathData.matrix_after[r][c]})}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                        isSelected ? 'bg-secondary/40 border border-secondary text-white' : 'bg-dark-bg hover:bg-dark-surface'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center text-slate-500 font-bold text-lg pt-6">
            ?
          </div>

          {/* Image 2 */}
          <div>
            <p className="text-secondary font-semibold mb-2">Gambar 2</p>
            <div className="grid grid-cols-9 gap-[1px] max-w-fit bg-dark-border p-[1px]">
              {mathData.matrix_2.map((row, r) => 
                row.map((val, c) => {
                  const isSelected = selectedPixel?.r === r && selectedPixel?.c === c;
                  return (
                    <div 
                      key={`m2-${r}-${c}`} 
                      onClick={() => setSelectedPixel({r, c, val1: mathData.matrix_1[r][c], val2: val, valResult: mathData.matrix_after[r][c]})}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                        isSelected ? 'bg-secondary/40 border border-secondary text-white' : 'bg-dark-bg hover:bg-dark-surface'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-slate-500 font-bold text-lg pt-6">
            =
          </div>

          {/* Result */}
          <div>
            <p className="text-primary font-semibold mb-2">Hasil Akhir</p>
            <div className="grid grid-cols-9 gap-[1px] max-w-fit bg-dark-border p-[1px]">
              {mathData.matrix_after.map((row, r) => 
                row.map((val, c) => {
                  const isSelected = selectedPixel?.r === r && selectedPixel?.c === c;
                  return (
                    <div 
                      key={`mres-${r}-${c}`} 
                      onClick={() => setSelectedPixel({r, c, val1: mathData.matrix_1[r][c], val2: mathData.matrix_2[r][c], valResult: val})}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/40 border border-primary text-white' : 'bg-dark-bg hover:bg-primary/20'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Math Formulas Display Box */}
        {selectedPixel && (
          <div className="p-4 bg-dark-bg border border-tertiary/30 rounded-lg animate-fade-in mt-2 w-full max-w-2xl">
            <div className="flex items-center space-x-4 mb-4 border-b border-dark-border pb-3">
              <div>
                <span className="text-slate-500">Piksel (x, y):</span> [{selectedPixel.r}, {selectedPixel.c}]
              </div>
              <div className="text-lg flex items-center">
                <span className="text-secondary font-bold">{selectedPixel.val1}</span>
                <span className="text-slate-500 mx-3 text-sm">OP</span>
                <span className="text-secondary font-bold">{selectedPixel.val2}</span>
                <span className="text-slate-500 mx-3">→</span>
                <span className="text-primary font-bold">{selectedPixel.valResult}</span>
              </div>
            </div>
            
            <p className="text-tertiary font-semibold mb-2">Rumus Operasi Berlaku:</p>
            <div className="space-y-1.5 pl-2 border-l-2 border-tertiary/50 whitespace-pre-wrap">
              {mathData.formulas.map((f, idx) => (
                <p key={idx} className="text-slate-300 text-[11px]"><span className="text-slate-500 mr-2">[{idx+1}]</span> {f}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
