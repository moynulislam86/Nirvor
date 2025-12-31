import React from 'react';
import { Brain, PhoneCall, HeartHandshake, Smile } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const Psychology: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const currentData = data[language];

  return (
    <div className="animate-fade-in space-y-6">
       <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-teal-800 flex items-center gap-2">
            <Brain size={20} />
            {t.psychTitle}
        </h3>
        <p className="text-sm text-teal-700 mt-1">
            {t.psychSubtitle}
        </p>
      </div>

      {/* Hotline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PhoneCall size={32} className="text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t.kanPeteRoi}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.mentalHelpline}</p>
          <a href="tel:01779554391" className="block w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
              {t.callNow}
          </a>
          <p className="text-xs text-gray-400 mt-2">{t.helplineTime}</p>
      </div>

      {/* Tips Section */}
      <div>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Smile size={20} className="text-teal-500" />
              {t.healthyTips}
          </h3>
          <div className="space-y-3">
              {currentData.psychologyTips.map((tip, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-xl">
          <HeartHandshake className="text-gray-500 flex-shrink-0" size={20} />
          <p className="text-xs text-gray-600">
              {t.psychDisclaimer}
          </p>
      </div>
    </div>
  );
};

export default Psychology;