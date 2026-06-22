import React from 'react';
import Toggle from '../../../../components/ui/Toggle';

export default function BlendOperationsSidebar({ params, updateParam }) {
  const isLogika = params.op_type === 'logika';

  const handleOpTypeChange = (type) => {
    updateParam('op_type', type);
    if (type === 'logika') {
      updateParam('operation', 'and'); // default
    } else {
      updateParam('operation', 'add'); // default
    }
  };

  return (
    <div className="lg:col-span-1 space-y-4 pr-2 h-full">
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Global Settings</h3>
        <div className="relative group/toggle">
          <Toggle 
            label="Grayscale Mode" 
            checked={isLogika ? true : params.grayscale} 
            disabled={isLogika}
            onChange={(val) => !isLogika && updateParam('grayscale', val)} 
          />
          {isLogika && (
            <p className="text-[10px] text-yellow-500/80 mt-2 font-medium">
              * Operasi logika mewajibkan gambar dikonversi menjadi hitam putih (Grayscale).
            </p>
          )}
        </div>
      </div>

      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border space-y-6">
        <div>
          <h3 className="font-semibold text-white mb-3 border-b border-dark-border pb-2">Tipe Operasi</h3>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="radio" 
                name="op_type" 
                value="aritmatika" 
                checked={!isLogika} 
                onChange={() => handleOpTypeChange('aritmatika')}
                className="form-radio text-primary bg-dark-surface border-dark-border focus:ring-primary focus:ring-offset-dark-bg" 
              />
              <span className={`text-sm font-medium transition-colors ${!isLogika ? 'text-primary' : 'text-slate-400 group-hover:text-slate-300'}`}>Aritmatika</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="radio" 
                name="op_type" 
                value="logika" 
                checked={isLogika} 
                onChange={() => handleOpTypeChange('logika')}
                className="form-radio text-secondary bg-dark-surface border-dark-border focus:ring-secondary focus:ring-offset-dark-bg" 
              />
              <span className={`text-sm font-medium transition-colors ${isLogika ? 'text-secondary' : 'text-slate-400 group-hover:text-slate-300'}`}>Logika</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3 border-b border-dark-border pb-2">Pilih Operasi</h3>
          {!isLogika ? (
            <div className="flex flex-col gap-3">
              {[
                { val: 'add', label: 'Tambah (+)' },
                { val: 'subtract', label: 'Kurang (-)' },
                { val: 'multiply', label: 'Kali (x)' },
                { val: 'divide', label: 'Bagi (/)' },
              ].map(op => (
                <label key={op.val} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="operation" 
                    value={op.val} 
                    checked={params.operation === op.val} 
                    onChange={() => updateParam('operation', op.val)}
                    className="form-radio text-primary bg-dark-surface border-dark-border focus:ring-primary focus:ring-offset-dark-bg" 
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{op.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-in">
              {[
                { val: 'and', label: 'AND (&)' },
                { val: 'or', label: 'OR (|)' },
                { val: 'xor', label: 'XOR (^)' },
              ].map(op => (
                <label key={op.val} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="operation" 
                    value={op.val} 
                    checked={params.operation === op.val} 
                    onChange={() => updateParam('operation', op.val)}
                    className="form-radio text-secondary bg-dark-surface border-dark-border focus:ring-secondary focus:ring-offset-dark-bg" 
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{op.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
