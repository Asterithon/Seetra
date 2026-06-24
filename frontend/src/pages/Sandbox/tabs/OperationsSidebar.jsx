import React from 'react';
import Slider from '../../../components/ui/Slider';
import Toggle from '../../../components/ui/Toggle';
import Select from '../../../components/ui/Select';

export default function OperationsSidebar({ params, updateParam, updateGlobal }) {
  return (
    <div className="lg:col-span-1 space-y-4 pr-2 h-full">
      {/* Global Settings */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Global Settings</h3>
        <Toggle 
          label="Grayscale Mode" 
          checked={params.global.grayscale} 
          onChange={(val) => updateGlobal('grayscale', val)} 
        />
      </div>

      {/* Geometri */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Operasi Geometri</h3>
        <Slider label="Translasi X (px)" value={params.geometri.transX} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('geometri', 'transX', val)} onReset={() => updateParam('geometri', 'transX', 0)} />
        <Slider label="Translasi Y (px)" value={params.geometri.transY} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('geometri', 'transY', val)} onReset={() => updateParam('geometri', 'transY', 0)} />
        <Slider label="Rotasi Sudut (°)" value={params.geometri.rotasi} min={-180} max={180} defaultValue={0} onChange={(val) => updateParam('geometri', 'rotasi', val)} onReset={() => updateParam('geometri', 'rotasi', 0)} />
        <Slider label="Scaling (x)" value={params.geometri.scaling} min={0.1} max={3.0} step={0.1} defaultValue={1.0} onChange={(val) => updateParam('geometri', 'scaling', val)} onReset={() => updateParam('geometri', 'scaling', 1.0)} />
        <Select 
          label="Flipping" 
          value={params.geometri.flip} 
          onChange={(val) => updateParam('geometri', 'flip', val)}
          options={[
            { value: 'none', label: 'Tidak Aktif' },
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertikal' }
          ]} 
        />
      </div>

      {/* Titik */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Operasi Titik</h3>
        <Slider label="Brightness" value={params.titik.brightness} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('titik', 'brightness', val)} onReset={() => updateParam('titik', 'brightness', 0)} />
        <Slider label="Contrast" value={params.titik.contrast} min={0.5} max={3.0} step={0.1} defaultValue={1.0} onChange={(val) => updateParam('titik', 'contrast', val)} onReset={() => updateParam('titik', 'contrast', 1.0)} />
        <Slider label="Thresholding" value={params.titik.threshold} min={0} max={255} defaultValue={128} onChange={(val) => updateParam('titik', 'threshold', val)} onReset={() => updateParam('titik', 'threshold', 128)} />
        <Toggle label="Negasi" checked={params.titik.negasi} onChange={(val) => updateParam('titik', 'negasi', val)} />
      </div>

      {/* Spasial */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">Operasi Spasial</h3>
        <Select 
          label="Smoothing - Mean Filter" 
          value={params.spasial.meanSize} 
          onChange={(val) => updateParam('spasial', 'meanSize', Number(val))}
          options={[{value: 3, label: '3x3'}, {value: 5, label: '5x5'}, {value: 7, label: '7x7'}, {value: 9, label: '9x9'}]} 
        />
        <Select 
          label="Smoothing - Median Filter" 
          value={params.spasial.medianSize} 
          onChange={(val) => updateParam('spasial', 'medianSize', Number(val))}
          options={[{value: 3, label: '3x3'}, {value: 5, label: '5x5'}, {value: 7, label: '7x7'}, {value: 9, label: '9x9'}]} 
        />
        <Select 
          label="Edge Detection Mode" 
          value={params.spasial.edgeType} 
          onChange={(val) => updateParam('spasial', 'edgeType', val)}
          options={[
            { value: 'none', label: 'Tidak Aktif' },
            { value: 'sobel', label: 'Sobel (3x3)' },
            { value: 'prewitt', label: 'Prewitt (3x3)' },
            { value: 'canny', label: 'Canny' }
          ]} 
        />
        {params.spasial.edgeType === 'canny' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Slider label="Canny Low Threshold" value={params.spasial.cannyLow} min={0} max={255} defaultValue={50} onChange={(val) => updateParam('spasial', 'cannyLow', val)} onReset={() => updateParam('spasial', 'cannyLow', 50)} />
            <Slider label="Canny High Threshold" value={params.spasial.cannyHigh} min={0} max={255} defaultValue={150} onChange={(val) => updateParam('spasial', 'cannyHigh', val)} onReset={() => updateParam('spasial', 'cannyHigh', 150)} />
          </div>
        )}
      </div>
    </div>
  );
}
