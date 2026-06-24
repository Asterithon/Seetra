import React from 'react';
import Slider from '../../../components/ui/Slider';
import Toggle from '../../../components/ui/Toggle';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../context/LanguageContext';

export default function OperationsSidebar({ params, updateParam, updateGlobal }) {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-1 space-y-4 pr-2 h-full">
      {/* Global Settings */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.global_settings')}</h3>
        <Toggle 
          label={t('ops.grayscale_mode')} 
          checked={params.global.grayscale} 
          onChange={(val) => updateGlobal('grayscale', val)} 
        />
      </div>

      {/* Geometri */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.geometry')}</h3>
        <Slider label={t('ops.translate_x')} value={params.geometri.transX} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('geometri', 'transX', val)} onReset={() => updateParam('geometri', 'transX', 0)} />
        <Slider label={t('ops.translate_y')} value={params.geometri.transY} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('geometri', 'transY', val)} onReset={() => updateParam('geometri', 'transY', 0)} />
        <Slider label={t('ops.rotation')} value={params.geometri.rotasi} min={-180} max={180} defaultValue={0} onChange={(val) => updateParam('geometri', 'rotasi', val)} onReset={() => updateParam('geometri', 'rotasi', 0)} />
        <Slider label={t('ops.scaling')} value={params.geometri.scaling} min={0.1} max={3.0} step={0.1} defaultValue={1.0} onChange={(val) => updateParam('geometri', 'scaling', val)} onReset={() => updateParam('geometri', 'scaling', 1.0)} />
        <Select 
          label={t('ops.flipping')} 
          value={params.geometri.flip} 
          onChange={(val) => updateParam('geometri', 'flip', val)}
          options={[
            { value: 'none', label: t('ops.flip.none') },
            { value: 'horizontal', label: t('ops.flip.horizontal') },
            { value: 'vertical', label: t('ops.flip.vertical') }
          ]} 
        />
      </div>

      {/* Titik */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.point')}</h3>
        <Slider label={t('ops.brightness')} value={params.titik.brightness} min={-100} max={100} defaultValue={0} onChange={(val) => updateParam('titik', 'brightness', val)} onReset={() => updateParam('titik', 'brightness', 0)} />
        <Slider label={t('ops.contrast')} value={params.titik.contrast} min={0.5} max={3.0} step={0.1} defaultValue={1.0} onChange={(val) => updateParam('titik', 'contrast', val)} onReset={() => updateParam('titik', 'contrast', 1.0)} />
        <Slider label={t('ops.threshold')} value={params.titik.threshold} min={0} max={255} defaultValue={128} onChange={(val) => updateParam('titik', 'threshold', val)} onReset={() => updateParam('titik', 'threshold', 128)} />
        <Toggle label={t('ops.negation')} checked={params.titik.negasi} onChange={(val) => updateParam('titik', 'negasi', val)} />
      </div>

      {/* Spasial */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.spatial')}</h3>
        <Select 
          label={t('ops.mean')} 
          value={params.spasial.meanSize} 
          onChange={(val) => updateParam('spasial', 'meanSize', Number(val))}
          options={[{value: 3, label: '3x3'}, {value: 5, label: '5x5'}, {value: 7, label: '7x7'}, {value: 9, label: '9x9'}]} 
        />
        <Select 
          label={t('ops.median')} 
          value={params.spasial.medianSize} 
          onChange={(val) => updateParam('spasial', 'medianSize', Number(val))}
          options={[{value: 3, label: '3x3'}, {value: 5, label: '5x5'}, {value: 7, label: '7x7'}, {value: 9, label: '9x9'}]} 
        />
        <Select 
          label={t('ops.edge')} 
          value={params.spasial.edgeType} 
          onChange={(val) => updateParam('spasial', 'edgeType', val)}
          options={[
            { value: 'none', label: t('ops.edge.none') },
            { value: 'sobel', label: 'Sobel (3x3)' },
            { value: 'prewitt', label: 'Prewitt (3x3)' },
            { value: 'canny', label: 'Canny' }
          ]} 
        />
        {params.spasial.edgeType === 'canny' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Slider label={t('ops.canny_low')} value={params.spasial.cannyLow} min={0} max={255} defaultValue={50} onChange={(val) => updateParam('spasial', 'cannyLow', val)} onReset={() => updateParam('spasial', 'cannyLow', 50)} />
            <Slider label={t('ops.canny_high')} value={params.spasial.cannyHigh} min={0} max={255} defaultValue={150} onChange={(val) => updateParam('spasial', 'cannyHigh', val)} onReset={() => updateParam('spasial', 'cannyHigh', 150)} />
          </div>
        )}
      </div>
    </div>
  );
}
