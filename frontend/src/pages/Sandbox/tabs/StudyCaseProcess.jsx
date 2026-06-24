import { useState, useEffect, useRef } from 'react';
import StudyCaseSidebar from './StudyCaseSidebar';
import MathMatrixDisplay from '../components/MathMatrixDisplay';
import { RgbHistogram, HsvHistogram } from '../components/HistogramDisplay';

export default function StudyCaseProcess() {
  const [caseId, setCaseId] = useState('yellow_teeth');
  
  const [inputFile, setInputFile] = useState(null);
  const [inputUrl, setInputUrl] = useState(null);
  const [inputInfo, setInputInfo] = useState(null);
  
  const [resultData, setResultData] = useState({
    image: null,
    snapshots: [],
    math_data: null,
    histogram: null,
    yellow_percentage: null
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    const url = URL.createObjectURL(file);
    
    const img = new Image();
    img.onload = () => {
      if (img.width > 3840 || img.height > 2160) {
        alert("Peringatan: Resolusi gambar melebihi 4K (3840x2160).");
        URL.revokeObjectURL(url);
        return;
      }
      
      setInputInfo({
        name: file.name,
        width: img.width,
        height: img.height,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
      setInputFile(file);
      setInputUrl(url);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!inputFile) return;

    const processImage = async () => {
      setIsProcessing(true);
      setErrorMsg('');
      
      const formData = new FormData();
      formData.append('image', inputFile);
      formData.append('case_id', caseId);

      try {
        const response = await fetch('http://127.0.0.1:5000/api/process/studycase', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setResultData({
            image: data.data.processed_image,
            snapshots: data.data.snapshots || [],
            math_data: data.data.math_data,
            histogram: data.data.histogram,
            yellow_percentage: data.data.yellow_percentage
          });
        } else {
          setErrorMsg(data.error || 'Terjadi kesalahan saat memproses gambar');
        }
      } catch (err) {
        setErrorMsg('Gagal terhubung ke server OpenCV');
      } finally {
        setIsProcessing(false);
      }
    };

    // Minor debounce, though not stringently needed for select since it changes rarely
    const timeoutId = setTimeout(() => {
      processImage();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputFile, caseId]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Study Case Process</h2>
      </div>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        
        <StudyCaseSidebar 
          caseId={caseId} 
          setCaseId={setCaseId} 
          yellowPercentage={resultData.yellow_percentage}
        />

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto min-h-[400px]">
            
            {/* Input Block */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-full relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center z-10">
                <span className="text-sm font-medium text-slate-300">Gambar Awal</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs bg-dark-bg border border-dark-border px-2 py-1 rounded hover:text-primary transition-colors"
                >
                  Unggah Baru
                </button>
              </div>
              
              {inputUrl ? (
                <div className="flex-1 flex flex-col w-full h-full p-2 bg-black/40 relative">
                  <div className="flex-1 min-h-0 relative">
                    <img src={inputUrl} alt="Input" className="w-full h-full object-contain" />
                    
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-semibold text-white truncate max-w-[80%]">{inputInfo?.name}</p>
                      <p className="text-slate-300 text-sm mt-1">{inputInfo?.width}x{inputInfo?.height} px</p>
                      <p className="text-slate-400 text-xs mt-1">{inputInfo?.size}</p>
                    </div>
                  </div>
                  {/* Histograms for Input */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <RgbHistogram data={resultData.histogram?.rgb_before} />
                    <HsvHistogram data={resultData.histogram?.hsv_before} />
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-surface/30 transition-colors"
                >
                  <svg className="h-16 w-16 text-slate-500 mb-4 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400 font-medium text-center">Unggah Gambar<br/><span className="text-xs font-normal">Format: JPG, PNG, WEBP</span></p>
                </div>
              )}
            </div>

            {/* Output Block */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-full relative group">
              <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center z-10">
                <span className="text-sm font-medium text-primary">Hasil Akhir</span>
                {isProcessing && <span className="text-xs text-primary/70 animate-pulse">Memproses...</span>}
              </div>
              
              <div className="flex-1 flex flex-col w-full h-full p-2 bg-black/40 relative">
                {resultData.image ? (
                  <>
                    <div className="flex-1 min-h-0 relative">
                      <img src={resultData.image} alt="Result" className={`w-full h-full object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-30' : 'opacity-100'}`} />
                      
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-dark-surface border-t-primary rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {/* Histograms for Output */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <RgbHistogram data={resultData.histogram?.rgb_after} />
                      <HsvHistogram data={resultData.histogram?.hsv_after} />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-slate-500 text-sm text-center">Menunggu input gambar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshots & Math Process (Below Images) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pipeline Snapshots */}
        <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
          <h3 className="font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Pipeline Snapshot
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-2 snap-x">
            {resultData.snapshots && resultData.snapshots.length > 0 ? (
              resultData.snapshots.map((snap, idx) => (
                <div key={idx} className="flex-shrink-0 w-32 snap-center group">
                  <div className="h-32 bg-black/40 rounded-lg border border-dark-border overflow-hidden mb-2 relative">
                    <img src={snap.image} alt={snap.title} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium text-center break-words leading-tight">
                    {snap.title}
                  </p>
                </div>
              ))
            ) : (
              <div className="w-full h-32 flex items-center justify-center text-slate-500 text-xs border border-dashed border-dark-border rounded-lg">
                Snapshots akan muncul di sini
              </div>
            )}
          </div>
        </div>

        {/* Math Matrix */}
        <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
          <h3 className="font-semibold text-tertiary mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Proses Matematika (Pusat Gambar 9x9)
          </h3>
          <MathMatrixDisplay mathData={resultData.math_data} />
        </div>

      </div>

    </div>
  );
}
