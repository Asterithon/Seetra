import React from 'react';
import Slider from '../../../components/ui/Slider';
import Toggle from '../../../components/ui/Toggle';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../context/LanguageContext';

export default function OperationsSidebar({ params, updateParam, updateGlobal }) {
  const { t } = useLanguage();

  const isGrayscaleForced = 
    params.spasial.edgeType !== 'none' ||
    params.thinning.type !== 'none' ||
    (params.segmentasi.type !== 'none' && params.segmentasi.type !== 'kmeans') ||
    params.global.binarize;

  const isBinarizeForced = params.thinning.type !== 'none';

  return (
    <div className="lg:col-span-1 space-y-4 pr-2 h-full">
      {/* Global Settings */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.global_settings')}</h3>
        <Toggle 
          label={t('ops.grayscale_mode')} 
          checked={params.global.grayscale} 
          onChange={(val) => updateGlobal('grayscale', val)} 
          disabled={isGrayscaleForced}
        />
        {isGrayscaleForced && (
          <div className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2.5 py-1.5 rounded-lg border border-yellow-500/20 mb-3 flex items-start gap-1">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{t('ops.grayscale_mode_auto_notice')}</span>
          </div>
        )}
        <Toggle 
          label={t('ops.binarize_mode')} 
          checked={params.global.binarize} 
          onChange={(val) => updateGlobal('binarize', val)} 
          disabled={isBinarizeForced}
        />
        {isBinarizeForced && (
          <div className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2.5 py-1.5 rounded-lg border border-yellow-500/20 mb-1 flex items-start gap-1">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{t('ops.binarize_mode_auto_notice')}</span>
          </div>
        )}
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
            { value: 'sobel', label: t('ops.edge.sobel') + ' (3x3)' },
            { value: 'prewitt', label: t('ops.edge.prewitt') + ' (3x3)' },
            { value: 'roberts', label: t('ops.edge.roberts') + ' (2x2)' },
            { value: 'laplacian', label: t('ops.edge.laplacian') + ' (3x3)' },
            { value: 'canny', label: t('ops.edge.canny') }
          ]} 
        />
        {params.spasial.edgeType === 'canny' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Slider label={t('ops.canny_low')} value={params.spasial.cannyLow} min={0} max={255} defaultValue={50} onChange={(val) => updateParam('spasial', 'cannyLow', val)} onReset={() => updateParam('spasial', 'cannyLow', 50)} />
            <Slider label={t('ops.canny_high')} value={params.spasial.cannyHigh} min={0} max={255} defaultValue={150} onChange={(val) => updateParam('spasial', 'cannyHigh', val)} onReset={() => updateParam('spasial', 'cannyHigh', 150)} />
          </div>
        )}
      </div>

      {/* Morfologi & Penipisan (Thinning) */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.morphology_thinning')}</h3>
        <Select 
          label={t('ops.morph_type')} 
          value={params.morfologi.type} 
          onChange={(val) => updateParam('morfologi', 'type', val)}
          options={[
            { value: 'none', label: t('ops.morph.none') },
            { value: 'dilate', label: t('ops.morph.dilate') },
            { value: 'erode', label: t('ops.morph.erode') },
            { value: 'open', label: t('ops.morph.open') },
            { value: 'close', label: t('ops.morph.close') }
          ]} 
        />
        {params.morfologi.type !== 'none' && (
          <Slider 
            label={t('ops.kernel_size')} 
            value={params.morfologi.kernelSize} 
            min={3} 
            max={15} 
            step={2} 
            defaultValue={3} 
            onChange={(val) => updateParam('morfologi', 'kernelSize', val)} 
            onReset={() => updateParam('morfologi', 'kernelSize', 3)} 
          />
        )}
        <Select 
          label={t('ops.thinning_type')} 
          value={params.thinning.type} 
          onChange={(val) => updateParam('thinning', 'type', val)}
          options={[
            { value: 'none', label: t('ops.thinning.none') },
            { value: 'standard', label: t('ops.thinning.standard') },
            { value: 'zhang_suen', label: t('ops.thinning.zhang_suen') }
          ]} 
        />
      </div>

      {/* Segmentasi Citra */}
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('ops.segmentation')}</h3>
        <Select 
          label={t('ops.seg_type')} 
          value={params.segmentasi.type} 
          onChange={(val) => updateParam('segmentasi', 'type', val)}
          options={[
            { value: 'none', label: t('ops.seg.none') },
            { value: 'threshold', label: t('ops.seg.threshold') },
            { value: 'adaptive', label: t('ops.seg.adaptive') },
            { value: 'otsu', label: t('ops.seg.otsu') },
            { value: 'kmeans', label: t('ops.seg.kmeans') }
          ]} 
        />
        
        {params.segmentasi.type === 'threshold' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Slider 
              label={t('ops.seg_thresh_val')} 
              value={params.segmentasi.threshVal} 
              min={0} 
              max={255} 
              defaultValue={128} 
              onChange={(val) => updateParam('segmentasi', 'threshVal', val)} 
              onReset={() => updateParam('segmentasi', 'threshVal', 128)} 
            />
            <Select 
              label={t('ops.seg_thresh_mode')} 
              value={params.segmentasi.threshMode} 
              onChange={(val) => updateParam('segmentasi', 'threshMode', val)}
              options={[
                { value: 'binary', label: 'BINARY' },
                { value: 'binary_inv', label: 'BINARY_INV' },
                { value: 'trunc', label: 'TRUNC' },
                { value: 'tozero', label: 'TOZERO' },
                { value: 'tozero_inv', label: 'TOZERO_INV' }
              ]} 
            />
          </div>
        )}

        {params.segmentasi.type === 'adaptive' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Select 
              label={t('ops.seg_adaptive_method')} 
              value={params.segmentasi.method} 
              onChange={(val) => updateParam('segmentasi', 'method', val)}
              options={[
                { value: 'mean', label: t('ops.seg_adaptive_mean') },
                { value: 'gaussian', label: t('ops.seg_adaptive_gaussian') }
              ]} 
            />
            <Slider 
              label={t('ops.seg_block_size')} 
              value={params.segmentasi.blockSize} 
              min={3} 
              max={31} 
              step={2} 
              defaultValue={3} 
              onChange={(val) => updateParam('segmentasi', 'blockSize', val)} 
              onReset={() => updateParam('segmentasi', 'blockSize', 3)} 
            />
            <Slider 
              label={t('ops.seg_const_c')} 
              value={params.segmentasi.constC} 
              min={-20} 
              max={20} 
              defaultValue={2} 
              onChange={(val) => updateParam('segmentasi', 'constC', val)} 
              onReset={() => updateParam('segmentasi', 'constC', 2)} 
            />
          </div>
        )}

        {params.segmentasi.type === 'otsu' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Toggle 
              label={t('ops.seg_use_gaussian')} 
              checked={params.segmentasi.useGaussian} 
              onChange={(val) => updateParam('segmentasi', 'useGaussian', val)} 
            />
            {params.segmentasi.useGaussian && (
              <Slider 
                label={t('ops.seg_gaussian_size')} 
                value={params.segmentasi.gaussianSize} 
                min={3} 
                max={15} 
                step={2} 
                defaultValue={5} 
                onChange={(val) => updateParam('segmentasi', 'gaussianSize', val)} 
                onReset={() => updateParam('segmentasi', 'gaussianSize', 5)} 
              />
            )}
          </div>
        )}

        {params.segmentasi.type === 'kmeans' && (
          <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border animate-slide-up">
            <Slider 
              label={t('ops.seg_clusters')} 
              value={params.segmentasi.clusters} 
              min={1} 
              max={10} 
              defaultValue={3} 
              onChange={(val) => updateParam('segmentasi', 'clusters', val)} 
              onReset={() => updateParam('segmentasi', 'clusters', 3)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
