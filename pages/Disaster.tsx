import React from 'react';
import { CloudRain, Wind, AlertTriangle, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Disaster: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in space-y-6">
        <h2 className="text-xl font-bold text-[#0A2540]">{t.disasterTitle}</h2>

        {/* Current Alert Banner */}
        <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 flex gap-3 items-start animate-pulse">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={24} />
            <div>
                <h3 className="font-bold text-amber-800">
                  {language === 'bn' ? "ভারী বৃষ্টির সতর্কতা" : "Heavy Rain Alert"}
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {language === 'bn' ? "আগামী ২৪ ঘন্টায় উপকূলীয় এলাকায় ঝড়ো হাওয়াসহ বৃষ্টির সম্ভাবনা।" : "Chance of rain with gusty winds in coastal areas within 24 hours."}
                </p>
                <p className="text-xs text-amber-600 mt-2 font-mono">{t.weatherSource}</p>
            </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-bold">28°</h1>
                    <p className="text-blue-100 mt-1">{language === 'bn' ? "ঢাকা, মেঘলা আকাশ" : "Dhaka, Cloudy"}</p>
                </div>
                <CloudRain size={64} className="text-blue-100" />
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                    <Wind size={18} />
                    <span className="text-sm">{language === 'bn' ? "বাতাস: ১২ কিমি/ঘন্টা" : "Wind: 12 km/h"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CloudRain size={18} />
                    <span className="text-sm">{language === 'bn' ? "আর্দ্রতা: ৭৮%" : "Humidity: 78%"}</span>
                </div>
            </div>
        </div>

        {/* Emergency Instructions */}
        <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Radio size={18} className="text-purple-600" />
                {language === 'bn' ? "ঘূর্ণিঝড় আশ্রয়কেন্দ্র গাইড" : "Cyclone Shelter Guide"}
            </h3>
            <div className="space-y-3">
                 {(language === 'bn' ? [
                    "ঝড়ের সংকেত ৫ বা তার বেশি হলে আশ্রয়কেন্দ্রে যান।",
                    "শুকনো খাবার ও বিশুদ্ধ পানি সাথে নিন।",
                    "গবাদি পশু নিরাপদ স্থানে রাখুন।",
                    "রেডিওতে আবহাওয়া বার্তা শুনুন।"
                 ] : [
                    "Move to shelter if signal is 5 or higher.",
                    "Take dry food and clean water.",
                    "Keep livestock in safe place.",
                    "Listen to radio for weather updates."
                 ]).map((text, idx) => (
                     <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 items-center">
                         <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                         <p className="text-sm text-gray-600">{text}</p>
                     </div>
                 ))}
            </div>
        </div>
    </div>
  );
};

export default Disaster;