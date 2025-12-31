import React, { useState } from 'react';
import { Baby, Shield, Phone, AlertCircle, Stethoscope, Copy, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const WomenChild: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const currentData = data[language];
  const [activeTab, setActiveTab] = useState<'safety' | 'doctors'>('safety');

  return (
    <div className="animate-fade-in space-y-6">
        <div className="bg-pink-500 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/20 rounded-full"></div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Baby size={28} />
                {t.wcTitle}
            </h2>
            <p className="opacity-90 text-sm mt-1">{t.wcSubtitle}</p>
        </div>

        {/* Emergency Hotlines */}
        <div className="grid grid-cols-2 gap-3">
            <a href="tel:109" className="bg-pink-50 border border-pink-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-pink-100 transition-colors">
                <div className="bg-pink-100 p-3 rounded-full">
                    <Phone size={24} className="text-pink-600" />
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-pink-700">109</span>
                    <span className="text-xs text-pink-600">{t.wcHelpline}</span>
                </div>
            </a>
            <a href="tel:999" className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                 <div className="bg-red-100 p-3 rounded-full">
                    <Shield size={24} className="text-red-600" />
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-red-700">999</span>
                    <span className="text-xs text-red-600">{t.policeEmergency}</span>
                </div>
            </a>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-xl">
             <button 
                onClick={() => setActiveTab('safety')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'safety' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
            >
                <AlertCircle size={16} />
                {t.safetyRights}
            </button>
            <button 
                onClick={() => setActiveTab('doctors')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'doctors' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
            >
                <Stethoscope size={16} />
                {t.specialists}
            </button>
        </div>

        {/* Safety Guide */}
        {activeTab === 'safety' && (
            <div className="animate-fade-in">
                <div className="space-y-3">
                    {currentData.womenSafety.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-pink-400">
                            <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Specialists */}
        {activeTab === 'doctors' && (
            <div className="animate-fade-in space-y-3">
                 {currentData.womenSpecialists?.map((doc, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                         <div className="bg-pink-100 p-3 rounded-lg flex items-center justify-center h-fit">
                             <Stethoscope size={24} className="text-pink-600" />
                         </div>
                         <div className="flex-1">
                             <h4 className="font-bold text-gray-800">{doc.name}</h4>
                             <p className="text-xs text-pink-600 font-semibold mb-1">
                                 {doc.specialty === 'gynecologist' ? t.gynecologist : t.pediatrician}
                             </p>
                             <div className="text-xs text-gray-500 space-y-1 mb-3">
                                 <p className="flex items-center gap-1"><MapPin size={10} /> {doc.hospital}, {doc.location}</p>
                             </div>
                             <div className="flex gap-2">
                                 <a href={`tel:${doc.phone}`} className="flex-1 bg-pink-500 text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-pink-600">
                                     <Phone size={12} /> {t.call}
                                 </a>
                                 <button 
                                     onClick={() => navigator.clipboard.writeText(doc.phone)}
                                     className="px-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200"
                                 >
                                     <Copy size={14} />
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
        )}
    </div>
  );
};

export default WomenChild;