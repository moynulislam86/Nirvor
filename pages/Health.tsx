import React, { useState } from 'react';
import { Stethoscope, Building, BookOpen, Search, Pill, UserPlus, AlertTriangle, X, Globe, Copy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../types';

const Health: React.FC = () => {
  const { t, language } = useLanguage();
  const { data } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'guide' | 'medicine'>('hospitals');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  const currentData = data[language];

  // Filter Data
  const filteredHospitals = currentData.hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = currentData.healthGuides.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeds = currentData.medicineInfo.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  return (
    <div className="animate-fade-in relative">
        {showCopyFeedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-[60] animate-fade-in">
              {t.copied}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0A2540]">{t.serviceHealth}</h2>
            <button 
                onClick={() => navigate(PageRoutes.FIND_DOCTOR)}
                className="bg-[#2ECC71] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md hover:bg-[#27ae60] transition-colors"
            >
                <UserPlus size={14} />
                {t.callDoctor}
            </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder={t.searchHealth} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71] text-sm"
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X size={16} />
                </button>
            )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            <button 
                onClick={() => setActiveTab('hospitals')}
                className={`flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'hospitals' ? 'bg-[#2ECC71] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
                {t.tabHospital} <span className="text-xs opacity-80">({filteredHospitals.length})</span>
            </button>
            <button 
                 onClick={() => setActiveTab('guide')}
                className={`flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'guide' ? 'bg-[#2ECC71] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
                {t.tabFirstAid} <span className="text-xs opacity-80">({filteredGuides.length})</span>
            </button>
            <button 
                 onClick={() => setActiveTab('medicine')}
                className={`flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'medicine' ? 'bg-[#2ECC71] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
                {t.tabMedicine} <span className="text-xs opacity-80">({filteredMeds.length})</span>
            </button>
        </div>

        {/* Content */}
        <div className="space-y-4 pb-20">
            {activeTab === 'hospitals' && (
                filteredHospitals.length > 0 ? (
                    filteredHospitals.map((h, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <Building size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{h.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${h.type === 'govt' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {h.type === 'govt' ? t.govt : t.private}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{h.address}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button 
                                        onClick={() => copyToClipboard(h.phone)}
                                        className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full font-medium border border-gray-200 hover:bg-gray-100"
                                    >
                                        <Copy size={10} /> {h.phone}
                                    </button>
                                    <a href={`tel:${h.phone}`} className="inline-block text-xs bg-[#2ECC71]/10 text-[#2ECC71] px-3 py-1 rounded-full font-medium border border-[#2ECC71]/20">
                                        {t.call}
                                    </a>
                                    {h.website && (
                                        <a href={h.website} target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium border border-blue-100 flex items-center gap-1">
                                            <Globe size={10} /> Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        <p>{t.searchHealth} Not found.</p>
                    </div>
                )
            )}

            {activeTab === 'guide' && (
                 <div className="space-y-3">
                     {filteredGuides.length > 0 ? filteredGuides.map((guide, i) => (
                         <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                             <div className="flex items-center gap-2 mb-2">
                                 <BookOpen size={20} className="text-[#2ECC71]" />
                                 <h3 className="font-bold text-gray-800">{guide.title}</h3>
                             </div>
                             <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                    <span className="font-semibold text-gray-600 min-w-[50px]">{t.symptoms}</span>
                                    <span className="text-gray-600">{guide.symptoms}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-semibold text-[#2ECC71] min-w-[50px]">{t.action}</span>
                                    <span className="text-gray-800">{guide.action}</span>
                                </div>
                                <div className="mt-2 bg-red-50 p-2 rounded-lg flex gap-2 items-start border border-red-100">
                                    <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-red-600 font-medium">{guide.warning}</span>
                                </div>
                             </div>
                         </div>
                     )) : (
                        <div className="text-center text-gray-400 py-10">
                            <p>No guides found.</p>
                        </div>
                     )}
                 </div>
            )}

            {activeTab === 'medicine' && (
                filteredMeds.length > 0 ? filteredMeds.map((med, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Pill size={18} className="text-[#2ECC71]" />
                            <h3 className="font-semibold text-gray-800">{med.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {med.description}
                        </p>
                    </div>
                )) : (
                    <div className="text-center text-gray-400 py-10">
                        <p>No medicine info found.</p>
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default Health;