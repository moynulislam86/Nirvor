import React, { useState } from 'react';
import { Car, Wrench, Phone, Navigation, Globe, Copy, X, RefreshCw, MapPin, Filter, AlertTriangle, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

const Transport: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const { showToast } = useToast();
  const currentData = data[language];
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  // Traffic State
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'heavy' | 'moderate' | 'clear'>('all');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportLocation, setReportLocation] = useState('');
  const [reportStatus, setReportStatus] = useState('heavy');

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleReportSubmit = () => {
      if (!reportLocation) return;
      showToast(language === 'bn' ? "রিপোর্ট জমা হয়েছে" : "Report submitted", 'success');
      setShowReportForm(false);
      setReportLocation('');
  };

  // Mock Traffic Data
  const trafficUpdates = [
      { 
          id: 1,
          location: "Mohakhali Flyover", 
          status: language === 'bn' ? "তীব্র জ্যাম" : "Heavy Traffic", 
          speed: "5-10 km/h", 
          time: "5 min ago",
          type: "heavy"
      },
      { 
          id: 2,
          location: "Airport Road", 
          status: language === 'bn' ? "ধীরগতি" : "Moderate", 
          speed: "25 km/h", 
          time: "2 min ago",
          type: "moderate"
      },
      { 
          id: 3,
          location: "Mirpur 10 - 12", 
          status: language === 'bn' ? "ফাঁকা" : "Clear", 
          speed: "45 km/h", 
          time: "12 min ago",
          type: "clear"
      },
      { 
          id: 4,
          location: "Bijoy Sarani", 
          status: language === 'bn' ? "থেমে আছে" : "Gridlock", 
          speed: "0 km/h", 
          time: "Just now",
          type: "stuck"
      },
       { 
          id: 5,
          location: "Hanif Flyover", 
          status: language === 'bn' ? "স্বাভাবিক" : "Normal Flow", 
          speed: "60 km/h", 
          time: "8 min ago",
          type: "clear"
      },
      { 
          id: 6,
          location: "Farmgate", 
          status: language === 'bn' ? "তীব্র জ্যাম" : "Heavy Traffic", 
          speed: "10 km/h", 
          time: "15 min ago",
          type: "heavy"
      },
      { 
          id: 7,
          location: "Gulshan 1", 
          status: language === 'bn' ? "ধীরগতি" : "Moderate", 
          speed: "20 km/h", 
          time: "5 min ago",
          type: "moderate"
      },
  ];

  const getStatusColor = (type: string) => {
      switch(type) {
          case 'heavy': return 'bg-red-50 text-red-700 border-red-200';
          case 'stuck': return 'bg-red-100 text-red-900 border-red-300';
          case 'moderate': return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'clear': return 'bg-green-50 text-green-700 border-green-200';
          default: return 'bg-gray-50 text-gray-700';
      }
  };

  const filteredUpdates = trafficUpdates.filter(item => {
      if (trafficFilter === 'all') return true;
      if (trafficFilter === 'heavy') return item.type === 'heavy' || item.type === 'stuck';
      return item.type === trafficFilter;
  });

  return (
    <div className="animate-fade-in space-y-5 relative">
      {showCopyFeedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-[60] animate-fade-in">
              {t.copied}
          </div>
      )}
      <div className="bg-slate-700 p-6 rounded-2xl text-white shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
              <Car size={28} />
              {t.transTitle}
          </h2>
          <p className="opacity-80 text-sm">{t.transSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
          <button className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors group">
              <Wrench size={24} className="text-slate-600 group-hover:text-slate-800" />
              <span className="text-sm font-bold text-gray-700">{t.findGarage}</span>
          </button>
          
          <button 
            onClick={() => setShowTrafficModal(true)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors group relative overflow-hidden"
          >
              <div className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
               <Navigation size={24} className="text-slate-600 group-hover:text-blue-600" />
              <span className="text-sm font-bold text-gray-700">{t.trafficUpdate}</span>
              <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full leading-none">LIVE</span>
          </button>
      </div>

      <div className="space-y-3">
          <h3 className="font-bold text-gray-700">{t.emergencyNumbers}</h3>
          {currentData.transportServices.map((service, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div>
                      <h4 className="font-semibold text-gray-800">{service.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="bg-slate-100 px-1.5 rounded text-slate-700">{service.type}</span>
                          • {service.location}
                      </p>
                  </div>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(service.phone)}
                        className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200"
                        title={t.copy}
                      >
                          <Copy size={18} />
                      </button>
                      <a href={`tel:${service.phone}`} className="bg-slate-100 p-2 rounded-full text-slate-700 hover:bg-slate-200">
                          <Phone size={18} />
                      </a>
                      {service.website && (
                           <a href={service.website} target="_blank" rel="noopener noreferrer" className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-100 border border-blue-100">
                                <Globe size={18} />
                           </a>
                      )}
                  </div>
              </div>
          ))}
      </div>

      {/* Traffic Modal */}
      {showTrafficModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl h-[80vh] flex flex-col">
                  <button onClick={() => setShowTrafficModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><X size={20}/></button>
                  
                  <h3 className="text-lg font-bold text-[#0A2540] mb-4 flex items-center gap-2 flex-shrink-0">
                      <Navigation size={22} className="text-blue-600" />
                      {t.trafficUpdate}
                  </h3>

                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide flex-shrink-0 pb-1">
                      {[
                          { id: 'all', label: language === 'bn' ? 'সব' : 'All' },
                          { id: 'heavy', label: language === 'bn' ? 'জ্যাম' : 'Heavy' },
                          { id: 'moderate', label: language === 'bn' ? 'মোটামুটি' : 'Moderate' },
                          { id: 'clear', label: language === 'bn' ? 'ফাঁকা' : 'Clear' }
                      ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setTrafficFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                                trafficFilter === f.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                              {f.label}
                          </button>
                      ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-medium flex-shrink-0">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Updates (Dhaka)</span>
                      <button onClick={handleRefresh} className={`flex items-center gap-1 text-blue-600 hover:underline ${isRefreshing ? 'opacity-50' : ''}`}>
                          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
                          Refresh
                      </button>
                  </div>

                  <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                      {filteredUpdates.length > 0 ? filteredUpdates.map((item) => (
                          <div key={item.id} className={`p-3 rounded-xl border flex justify-between items-center ${getStatusColor(item.type)}`}>
                              <div>
                                  <h4 className="font-bold text-sm">{item.location}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-semibold px-1.5 py-0.5 bg-white/50 rounded">{item.status}</span>
                                      <span className="text-[10px] opacity-80">{item.speed}</span>
                                  </div>
                              </div>
                              <div className="text-[10px] font-medium opacity-70 whitespace-nowrap ml-2">
                                  {item.time}
                              </div>
                          </div>
                      )) : (
                          <div className="text-center py-10 text-gray-400 text-sm">
                              No updates found for this filter.
                          </div>
                      )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0 space-y-3">
                      {showReportForm ? (
                          <div className="bg-gray-50 p-3 rounded-xl animate-scale-in">
                              <h4 className="text-xs font-bold text-gray-700 mb-2">{language === 'bn' ? 'ট্রাফিক রিপোর্ট করুন' : 'Report Traffic'}</h4>
                              <input 
                                  type="text" 
                                  value={reportLocation}
                                  onChange={(e) => setReportLocation(e.target.value)}
                                  placeholder={language === 'bn' ? 'জায়গার নাম...' : 'Location name...'}
                                  className="w-full p-2 text-xs border rounded-lg mb-2"
                              />
                              <div className="flex gap-2 mb-2">
                                  <button onClick={() => setReportStatus('heavy')} className={`flex-1 py-1 text-xs rounded border ${reportStatus === 'heavy' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white'}`}>Heavy</button>
                                  <button onClick={() => setReportStatus('moderate')} className={`flex-1 py-1 text-xs rounded border ${reportStatus === 'moderate' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white'}`}>Moderate</button>
                                  <button onClick={() => setReportStatus('clear')} className={`flex-1 py-1 text-xs rounded border ${reportStatus === 'clear' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white'}`}>Clear</button>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => setShowReportForm(false)} className="flex-1 py-2 text-xs text-gray-500 font-bold bg-white border rounded-lg">Cancel</button>
                                  <button onClick={handleReportSubmit} className="flex-1 py-2 text-xs text-white font-bold bg-blue-600 rounded-lg">Submit</button>
                              </div>
                          </div>
                      ) : (
                          <div className="flex gap-2">
                              <button 
                                onClick={() => setShowReportForm(true)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                              >
                                  <AlertTriangle size={16} />
                                  {language === 'bn' ? 'রিপোর্ট করুন' : 'Report'}
                              </button>
                              <a 
                                href="https://www.google.com/maps/@23.7806365,90.4193257,12z/data=!5m1!1e1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                              >
                                  <MapPin size={16} />
                                  {language === 'bn' ? 'ম্যাপে দেখুন' : 'View Map'}
                              </a>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Transport;