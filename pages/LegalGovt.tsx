import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ScrollText, Building2, Search, X, Globe, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { PageRoutes, GuideItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const LegalGovt: React.FC = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isLegal = location.pathname === PageRoutes.LEGAL;
  const guideData: GuideItem[] = isLegal ? data[language].legalGuides : data[language].govtGuides;

  const filteredData = guideData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.steps.some(step => step.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in pb-10">
      <div className={`mb-6 p-6 rounded-2xl text-white shadow-lg ${isLegal ? 'bg-blue-600' : 'bg-orange-600'}`}>
        <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
                {isLegal ? <ScrollText size={24} /> : <Building2 size={24} />}
            </div>
            <h2 className="text-2xl font-bold">{isLegal ? t.legalTitle : t.govtTitle}</h2>
        </div>
        <p className="opacity-90 text-sm">
            {isLegal ? t.legalSubtitle : t.govtSubtitle}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
              type="text" 
              placeholder={isLegal ? t.searchLegal : t.searchGovt} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm focus:ring-blue-500"
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

      <div className="space-y-3">
        {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
                <ExpandableCard key={index} item={item} colorClass={isLegal ? 'text-blue-600' : 'text-orange-600'} visitText={t.visitWebsite} />
            ))
        ) : (
            <div className="text-center text-gray-400 py-10">
                No results found.
            </div>
        )}
      </div>
    </div>
  );
};

const ExpandableCard: React.FC<{item: GuideItem, colorClass: string, visitText: string}> = ({ item, colorClass, visitText }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-800">{item.title}</span>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 bg-gray-50 border-t border-gray-100">
                    <ul className="space-y-3 mt-3">
                        {item.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-gray-600">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${colorClass} bg-opacity-10 flex items-center justify-center font-bold text-xs border border-current`}>
                                    {idx + 1}
                                </span>
                                <span className="pt-0.5">{step.text}</span>
                            </li>
                        ))}
                    </ul>
                    {item.website && (
                        <a 
                            href={item.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border transition-colors ${colorClass.includes('blue') ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'}`}
                        >
                            <Globe size={16} />
                            {visitText} <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default LegalGovt;