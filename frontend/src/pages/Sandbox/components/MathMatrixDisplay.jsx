import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

export default function MathMatrixDisplay({ mathData }) {
  const [selectedPixel, setSelectedPixel] = useState(null);
  const { t } = useLanguage();

  if (!mathData) {
    return (
      <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-500 overflow-x-auto min-h-[100px]">
        {t('math.waiting')}
      </div>
    );
  }

  const formatFormula = (formula) => {
    if (typeof formula === 'string' && formula.startsWith('formula.')) {
      return t(formula);
    }
    return formula;
  };

  return (
    <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[100px]">
      <div className="flex flex-col gap-6">
        <p className="text-slate-500">{t('math.hint')}</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Before */}
          <div>
            <p className="text-secondary font-semibold mb-2">{t('math.original')}</p>
            <div className="grid grid-cols-9 gap-[1px] max-w-fit bg-dark-border p-[1px]">
              {mathData.matrix_before.map((row, r) =>
                row.map((val, c) => {
                  const valAfter = mathData.matrix_after[r][c];
                  const isSelected = selectedPixel?.r === r && selectedPixel?.c === c;
                  return (
                    <div
                      key={`b-${r}-${c}`}
                      onClick={() => setSelectedPixel({ r, c, valBefore: val, valAfter: valAfter })}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors ${isSelected ? 'bg-secondary/40 border border-secondary text-white' : 'bg-dark-bg hover:bg-dark-surface'
                        }`}
                      title={`Original: ${val}`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* After */}
          <div>
            <p className="text-primary font-semibold mb-2">{t('math.processed')}</p>
            <div className="grid grid-cols-9 gap-[1px] max-w-fit bg-dark-border p-[1px]">
              {mathData.matrix_after.map((row, r) =>
                row.map((val, c) => {
                  const valBefore = mathData.matrix_before[r][c];
                  const isSelected = selectedPixel?.r === r && selectedPixel?.c === c;
                  return (
                    <div
                      key={`a-${r}-${c}`}
                      onClick={() => setSelectedPixel({ r, c, valBefore: valBefore, valAfter: val })}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors ${isSelected ? 'bg-primary/40 border border-primary text-white' : 'bg-dark-bg hover:bg-primary/20'
                        }`}
                      title={`Hasil: ${val}`}
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
          <div className="p-4 bg-dark-bg border border-tertiary/30 rounded-lg animate-fade-in mt-2">
            <div className="flex items-center space-x-4 mb-4 border-b border-dark-border pb-3">
              <div>
                <span className="text-slate-500">{t('math.pixel_target')}</span> [{selectedPixel.r}, {selectedPixel.c}]
              </div>
              <div className="text-lg">
                <span className="text-secondary font-bold">{selectedPixel.valBefore}</span>
                <span className="text-slate-500 mx-3">→</span>
                <span className="text-primary font-bold">{selectedPixel.valAfter}</span>
              </div>
            </div>

            <p className="text-tertiary font-semibold mb-2">{t('math.formula_title')}</p>
            <div className="space-y-1.5 pl-2 border-l-2 border-tertiary/50">
              {mathData.formulas.map((f, idx) => (
                <p key={idx} className="text-slate-300 text-[11px]"><span className="text-slate-500 mr-2">[{idx + 1}]</span> {formatFormula(f)}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
