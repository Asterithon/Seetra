import { useState } from 'react';
import Toggle from '../../../components/ui/Toggle';

const DEFAULT_STATE = {
  operationType: 'aritmatika', // aritmatika or logika
  aritmatikaOp: 'tambah', // tambah, kurang, kali, bagi
  logikaOp: 'and', // and, or, xor
  grayscale: false,
};

export default function BlendImageProcess() {
  const [params, setParams] = useState(DEFAULT_STATE);

  const handleOperationTypeChange = (type) => {
    setParams(prev => ({
      ...prev,
      operationType: type,
      // Force grayscale if logika
      grayscale: type === 'logika' ? true : false
    }));
  };

  const updateParam = (key, value) => setParams(prev => ({ ...prev, [key]: value }));

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-tertiary">Blend Image Process</h2>
        <button 
          onClick={() => setParams(DEFAULT_STATE)}
          className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
        >
          Reset Operasi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Panel: Operations Sidebar */}
        <div className="lg:col-span-1 space-y-4 h-full pr-2">
          
          <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Jenis Operasi</h3>
            
            <div className="space-y-4 mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="operationType" 
                  checked={params.operationType === 'aritmatika'}
                  onChange={() => handleOperationTypeChange('aritmatika')}
                  className="w-4 h-4 text-primary bg-dark-bg border-dark-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-300">Operasi Aritmatika</span>
              </label>
              
              {params.operationType === 'aritmatika' && (
                <div className="pl-7 space-y-2 animate-slide-up">
                  {['tambah', 'kurang', 'kali', 'bagi'].map(op => (
                    <label key={op} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="aritmatikaOp" 
                        checked={params.aritmatikaOp === op}
                        onChange={() => updateParam('aritmatikaOp', op)}
                        className="w-3.5 h-3.5 text-secondary bg-dark-bg border-dark-border focus:ring-secondary"
                      />
                      <span className="text-xs text-slate-400 capitalize">{op}</span>
                    </label>
                  ))}
                </div>
              )}

              <label className="flex items-center space-x-3 cursor-pointer mt-4">
                <input 
                  type="radio" 
                  name="operationType" 
                  checked={params.operationType === 'logika'}
                  onChange={() => handleOperationTypeChange('logika')}
                  className="w-4 h-4 text-primary bg-dark-bg border-dark-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-300">Operasi Logika</span>
              </label>

              {params.operationType === 'logika' && (
                <div className="pl-7 space-y-2 animate-slide-up">
                  {['and', 'or', 'xor'].map(op => (
                    <label key={op} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="logikaOp" 
                        checked={params.logikaOp === op}
                        onChange={() => updateParam('logikaOp', op)}
                        className="w-3.5 h-3.5 text-secondary bg-dark-bg border-dark-border focus:ring-secondary"
                      />
                      <span className="text-xs text-slate-400 uppercase">{op}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-dark-border">
              <Toggle 
                label="Grayscale Mode" 
                checked={params.grayscale} 
                onChange={(val) => {
                  if (params.operationType !== 'logika') updateParam('grayscale', val);
                }} 
              />
              {params.operationType === 'logika' && (
                <p className="text-[10px] text-yellow-500/80 mt-1 italic">
                  *Operasi Logika mewajibkan konversi ke Grayscale.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Center/Right Panel: Canvas and Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Block 1 */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-64">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Gambar 1</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-surface/30 transition-colors group">
                <svg className="h-10 w-10 text-slate-500 mb-2 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium">Unggah Gambar 1</p>
              </div>
            </div>

            {/* Input Block 2 */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-64">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Gambar 2</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-surface/30 transition-colors group">
                <svg className="h-10 w-10 text-slate-500 mb-2 group-hover:text-tertiary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium">Unggah Gambar 2</p>
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Output Block */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-96 relative">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center">
                <span className="text-sm font-medium text-tertiary">Hasil Blend</span>
                <span className="text-xs text-tertiary/70 animate-pulse">Menunggu gambar...</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-dark-surface border-t-tertiary rounded-full animate-spin mb-4 opacity-20"></div>
                <p className="text-slate-500 text-sm text-center">Hasil perpaduan akan tampil di sini</p>
              </div>
            </div>
          </div>

          {/* Proses Matematika */}
          <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-secondary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Proses Matematika
            </h3>
            <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-400 overflow-x-auto">
              <p className="text-slate-500 mb-2">// Contoh rincian perhitungan akan muncul di sini.</p>
              <p>Pixel(Gambar 1) [op] Pixel(Gambar 2) = Hasil</p>
              <p>120 + 150 = 270 --&gt; <span className="text-tertiary">Clipping: 255</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
