import React from 'react';
import { Accessibility, Heart, Phone, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const Senior: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const currentData = data[language];

  return (
    <div className="animate-fade-in space-y-6">
       <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <Accessibility size={20} />
            {t.seniorTitle}
        </h3>
        <p className="text-sm text-amber-700 mt-1">
            {t.seniorSubtitle}
        </p>
      </div>

      {/* Emergency Priority */}
      <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
              <h4 className="font-bold text-gray-800">{t.priorityAmb}</h4>
              <p className="text-xs text-gray-500">{t.prioritySub}</p>
          </div>
          <a href="tel:16263" className="bg-red-500 text-white p-3 rounded-full shadow-lg animate-pulse">
              <Phone size={20} />
          </a>
      </div>

      {/* Government Benefits */}
      <div>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-amber-600" />
              {t.govtBenefits}
          </h3>
          <div className="space-y-3">
              {currentData.seniorServices.map((service, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">{service.title}</h4>
                      <ul className="space-y-2">
                          {service.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  {step.text}
                              </li>
                          ))}
                      </ul>
                  </div>
              ))}
          </div>
      </div>

      {/* Health Tips */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
              <Heart size={20} />
              <h4 className="font-bold">{t.dailyCare}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
              {t.careText}
          </p>
      </div>
    </div>
  );
};

export default Senior;