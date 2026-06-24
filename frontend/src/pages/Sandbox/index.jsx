import { useState, useEffect } from 'react';
import SingleImageProcess from './tabs/SingleImageProcess';
import BlendImageProcess from './tabs/BlendImageProcess';
import StudyCaseProcess from './tabs/StudyCaseProcess';
import { LightboxProvider } from '../../context/LightboxContext';
import ImageLightbox from '../../components/ui/ImageLightbox';

const TABS = [
  { id: 'single', label: 'Single Image Process' },
  { id: 'blend', label: 'Blend Image Process' },
  { id: 'studycase', label: 'Study Case Process' },
];

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState('single');

  // Test backend connection on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('%c[Seetra Backend Status]', 'color: #4ade80; font-weight: bold;', data.message);
      })
      .catch(err => {
        console.error('%c[Seetra Backend Error]', 'color: #f87171; font-weight: bold;', 'Gagal terhubung ke backend server. Pastikan Flask sedang berjalan di port 5000.');
      });
  }, []);

  return (
    <LightboxProvider>
      <ImageLightbox />
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Tab Navigation - Responsive */}
        <div className="mb-6">
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-dark-surface border border-dark-border text-slate-200 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop/Tablet Buttons */}
          <div className="hidden md:flex space-x-1 p-1 bg-dark-surface/80 backdrop-blur-md rounded-xl border border-dark-border overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-border/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Content Area */}
        <div className="backdrop-blur-xl bg-dark-surface/40 border border-dark-border rounded-2xl p-6 min-h-[600px] flex-grow">
          {activeTab === 'single' && <SingleImageProcess />}
          {activeTab === 'blend' && <BlendImageProcess />}
          {activeTab === 'studycase' && <StudyCaseProcess />}
        </div>
      </div>
    </div>
    </LightboxProvider>
  );
}
