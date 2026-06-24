import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const CASE_REGISTRY = [
  {
    id: 'yellow_teeth'
  }
];

export default function StudyCaseSidebar({ caseId, setCaseId, yellowPercentage }) {
  const { t } = useLanguage();
  const activeCase = CASE_REGISTRY.find(c => c.id === caseId) || CASE_REGISTRY[0];

  const getCaseLabel = (id) => t(`study.${id}.label`);
  const getCaseDescription = (id) => t(`study.${id}.desc`);
  const getCaseDetails = (id) => [
    t(`study.${id}.param_1`),
    t(`study.${id}.param_2`),
    t(`study.${id}.param_3`),
    t(`study.${id}.param_4`),
  ];

  return (
    <div className="lg:col-span-1 space-y-4 pr-2 h-full">
      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
        <h3 className="font-semibold text-white mb-4 border-b border-dark-border pb-2">{t('study.select')}</h3>
        <div className="relative">
          <select 
            value={caseId} 
            onChange={(e) => setCaseId(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
          >
            {CASE_REGISTRY.map(c => (
              <option key={c.id} value={c.id}>{getCaseLabel(c.id)}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border space-y-4 animate-fade-in">
        <h3 className="font-semibold text-white border-b border-dark-border pb-2">{t('study.desc_title')}</h3>
        <p className="text-sm text-slate-300 leading-relaxed text-justify">
          {getCaseDescription(activeCase.id)}
        </p>
        
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 mb-2">{t('study.params_title')}</p>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
            {getCaseDetails(activeCase.id).map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      {yellowPercentage && caseId === 'yellow_teeth' && (
        <div className="bg-dark-bg/60 p-4 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
          <h3 className="font-semibold text-yellow-500 mb-2 border-b border-yellow-500/20 pb-2">{t('study.analysis_title')}</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-3xl font-bold text-white">{yellowPercentage}%</span>
            <span className="text-xs text-yellow-200/80 mt-1">{t('study.yellow_pct')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
