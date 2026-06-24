import { useState, useEffect, useRef } from 'react';
import BlendOperationsSidebar from './BlendOperationsSidebar';
import BlendMathMatrixDisplay from '../components/BlendMathMatrixDisplay';
import { SingleHistogram, RgbHistogram, HsvHistogram } from '../components/HistogramDisplay';

const DEFAULT_STATE = {
  op_type: 'aritmatika',
  operation: 'add',
  grayscale: false,
};

export default function BlendImageProcess() {
  const [params, setParams] = useState(DEFAULT_STATE);
  
  const [inputFile1, setInputFile1] = useState(null);
  const [inputUrl1, setInputUrl1] = useState(null);
  const [inputInfo1, setInputInfo1] = useState(null);

  const [inputFile2, setInputFile2] = useState(null);
  const [inputUrl2, setInputUrl2] = useState(null);
  const [inputInfo2, setInputInfo2] = useState(null);
  
  const [resultData, setResultData] = useState({
    image: null,
    image1_preview: null,
    image2_preview: null,
    math_data: null,
    histogram: null
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleResetAll = () => setParams(DEFAULT_STATE);
  
  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e, index) => {
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
      
      const info = {
        name: file.name,
        width: img.width,
        height: img.height,
        size: (file.size / 1024).toFixed(2) + ' KB'
      };

      if (index === 1) {
        setInputFile1(file);
        setInputUrl1(url);
        setInputInfo1(info);
      } else {
        setInputFile2(file);
        setInputUrl2(url);
        setInputInfo2(info);
      }
    };
    img.src = url;
  };

  // Debounced processing
  useEffect(() => {
    if (!inputFile1 || !inputFile2) return;

    const processImage = async () => {
      setIsProcessing(true);
      setErrorMsg('');
      
      const formData = new FormData();
      formData.append('image1', inputFile1);
      formData.append('image2', inputFile2);
      formData.append('params', JSON.stringify(params));

      try {
        const response = await fetch('http://127.0.0.1:5000/api/process/blend', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setResultData({
            image: data.data.processed_image,
            image1_preview: data.data.image1_preview,
            image2_preview: data.data.image2_preview,
            math_data: data.data.math_data,
            histogram: data.data.histogram
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

    const timeoutId = setTimeout(() => {
      processImage();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [inputFile1, inputFile2, params]);

  const renderInputBlock = (num, inputUrl, inputInfo, fileInputRef, previewResized) => (
    <div className="flex flex-col bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden shadow-lg h-full relative group">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileChange(e, num)} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />
      <div className="p-3 bg-dark-surface/80 border-b border-dark-border flex justify-between items-center z-10">
        <span className="text-sm font-medium text-slate-300">Gambar {num}</span>
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
            <img src={previewResized || inputUrl} alt={`Input ${num}`} className="w-full h-full object-contain" />
            
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-semibold text-white truncate max-w-[80%]">{inputInfo?.name}</p>
              <p className="text-slate-300 text-sm mt-1">{inputInfo?.width}x{inputInfo?.height} px</p>
              <p className="text-slate-400 text-xs mt-1">{inputInfo?.size}</p>
              {previewResized && (
                <span className="mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-[10px] rounded">
                  Auto-Resized (Cover)
                </span>
              )}
            </div>
          </div>
          {/* Histograms */}
          {params.op_type === 'logika' || params.grayscale ? (
            <SingleHistogram data={num === 1 ? resultData.histogram?.hist_1 : resultData.histogram?.hist_2} label="GRAYSCALE" />
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <RgbHistogram data={num === 1 ? resultData.histogram?.hist_1?.rgb : resultData.histogram?.hist_2?.rgb} />
              <HsvHistogram data={num === 1 ? resultData.histogram?.hist_1?.hsv : resultData.histogram?.hist_2?.hsv} />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-surface/30 transition-colors"
        >
          <svg className="h-16 w-16 text-slate-500 mb-4 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-400 font-medium text-center">Unggah Gambar {num}<br/><span className="text-xs font-normal">Format: JPG, PNG, WEBP</span></p>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Blend Image Process</h2>
        <button 
          onClick={handleResetAll}
          className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
        >
          Reset Seluruh Operasi
        </button>
      </div>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Info Notice about auto-resize */}
      {inputFile1 && inputFile2 && (inputInfo1?.width !== inputInfo2?.width || inputInfo1?.height !== inputInfo2?.height) && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200/90 text-sm flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>
            Dimensi gambar berbeda. Sistem secara otomatis menyesuaikan (menyamakan ukuran) kedua gambar tanpa merusak rasio (seperti CSS object-fit cover). Bagian gambar yang berlebih mungkin terpotong.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <BlendOperationsSidebar 
          params={params} 
          updateParam={updateParam} 
        />

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto min-h-[350px]">
            
            {renderInputBlock(1, inputUrl1, inputInfo1, fileInputRef1, resultData.image1_preview)}
            {renderInputBlock(2, inputUrl2, inputInfo2, fileInputRef2, resultData.image2_preview)}

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
                    {params.op_type === 'logika' || params.grayscale ? (
                      <SingleHistogram data={resultData.histogram?.hist_after} label="GRAYSCALE" />
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <RgbHistogram data={resultData.histogram?.hist_after?.rgb} />
                        <HsvHistogram data={resultData.histogram?.hist_after?.hsv} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-dark-surface border-t-primary rounded-full animate-spin mb-4 opacity-20"></div>
                    <p className="text-slate-500 text-sm text-center">Membutuhkan dua gambar<br/>untuk memproses blend</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-semibold text-tertiary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Proses Matematika (Pusat Gambar 9x9)
            </h3>
            <BlendMathMatrixDisplay mathData={resultData.math_data} />
          </div>

        </div>
      </div>
    </div>
  );
}
