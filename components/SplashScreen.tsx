import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SplashScreen: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-[#0A2540] z-[100] flex flex-col items-center justify-center text-white animate-fade-out delay-2000">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#2ECC71] rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="bg-white p-6 rounded-full shadow-2xl relative z-10">
          <Shield size={64} className="text-[#0A2540] fill-current" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-orange-500 p-2 rounded-full border-4 border-[#0A2540] z-20">
           <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-2 tracking-wide">{t.appName}</h1>
      <p className="text-[#2ECC71] text-lg font-medium tracking-wider">{t.youAreNotAlone}</p>
      
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-400">{t.loading}</span>
      </div>
    </div>
  );
};

export default SplashScreen;