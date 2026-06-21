export default function StudyCaseProcess() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-secondary">Study Case: Yellow Teeth Detection</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Panel: Description & Fixed Pipeline */}
        <div className="lg:col-span-1 space-y-4 h-full pr-2">
          
          <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-white mb-2">Deskripsi Kasus</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Mendeteksi tingkat kekuningan pada gigi menggunakan segmentasi warna (Color Masking).
            </p>

            <h4 className="font-medium text-secondary mb-2 mt-6">Tahapan Pipeline Tetap:</h4>
            <ol className="list-decimal list-inside text-sm text-slate-400 space-y-2">
              <li>Konversi RGB ke HSV</li>
              <li>Deteksi area putih/gigi</li>
              <li>Masking area kekuningan</li>
              <li>Perhitungan persentase</li>
            </ol>
          </div>

          <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Hasil Analisis</h3>
            <div className="flex flex-col items-center justify-center p-4 bg-dark-surface rounded-lg">
              <span className="text-4xl font-bold text-yellow-400 mb-2">0%</span>
              <span className="text-xs text-slate-400">Tingkat Kekuningan</span>
            </div>
          </div>
        </div>

        {/* Center/Right Panel: Canvas and Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Block */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-80">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Gambar Input</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-surface/30 transition-colors group">
                <svg className="h-12 w-12 text-slate-500 mb-3 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium text-center">Unggah foto gigi<br/>(Format: JPG, PNG)</p>
              </div>
            </div>

            {/* Output Block */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-80 relative">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center">
                <span className="text-sm font-medium text-secondary">Visualisasi Masking</span>
                <span className="text-xs text-secondary/70 animate-pulse">Menunggu gambar...</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-dark-surface border-t-secondary rounded-full animate-spin mb-4 opacity-20"></div>
                <p className="text-slate-500 text-sm text-center">Area di luar gigi akan menjadi grayscale,<br/>area kekuningan akan disorot warna.</p>
              </div>
            </div>
            
          </div>

          {/* Pipeline Snapshot */}
          <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Tahapan Deteksi (Fixed Snapshot)
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar">
              <div className="flex-shrink-0 w-32 bg-dark-surface rounded-lg border border-dark-border overflow-hidden">
                <div className="h-24 bg-dark-bg flex items-center justify-center text-xs text-slate-600">HSV</div>
                <div className="p-2 text-center text-xs text-slate-300 border-t border-dark-border">1. RGB to HSV</div>
              </div>
              <div className="flex-shrink-0 w-32 bg-dark-surface rounded-lg border border-dark-border overflow-hidden">
                <div className="h-24 bg-dark-bg flex items-center justify-center text-xs text-slate-600">Mouth Mask</div>
                <div className="p-2 text-center text-xs text-slate-300 border-t border-dark-border">2. Deteksi Gigi</div>
              </div>
              <div className="flex-shrink-0 w-32 bg-dark-surface rounded-lg border border-dark-border overflow-hidden">
                <div className="h-24 bg-dark-bg flex items-center justify-center text-xs text-slate-600">Yellow Mask</div>
                <div className="p-2 text-center text-xs text-slate-300 border-t border-dark-border">3. Masking Warna</div>
              </div>
            </div>
          </div>

          {/* Proses Matematika */}
          <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-tertiary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Proses Matematika (Masking)
            </h3>
            <div className="bg-dark-surface rounded-lg p-4 font-mono text-xs text-slate-400 overflow-x-auto">
              <p className="text-slate-500 mb-2">// Kondisi HSV Threshold untuk Warna Kuning:</p>
              <p>Lower Bound: [20, 100, 100]</p>
              <p>Upper Bound: [30, 255, 255]</p>
              <br/>
              <p className="text-secondary">Pixel (H: 25, S: 150, V: 200) --&gt; Masuk Rentang --&gt; Yellow Mask = 1</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
