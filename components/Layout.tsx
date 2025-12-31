import React, { useState, useEffect, useRef } from 'react';
import { Bell, MapPin, Phone, Menu, X, Globe, ChevronDown, Activity, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageRoutes } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { districts } from '../services/mockData';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();
  const { notifications, unreadCount, markAllAsRead } = useData(); // Use dynamic data
  const { showToast } = useToast();
  
  // State
  const [currentLocation, setCurrentLocation] = useState<string>(t.locationFinding);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Location Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  // Update "Finding Location..." text when language changes
  useEffect(() => {
    if (!isManualLocation && (currentLocation === 'Location finding...' || currentLocation === 'অবস্থান নির্ণয় হচ্ছে...')) {
        setCurrentLocation(t.locationFinding);
    }
  }, [language, t.locationFinding, isManualLocation, currentLocation]);

  // Automatic Location Tracking
  useEffect(() => {
    let watchId: number;

    const success = (position: GeolocationPosition) => {
        if (!isManualLocation) {
             setCurrentLocation(t.dhakaBangladesh); 
        }
    };

    const error = (err: GeolocationPositionError) => {
        if (isManualLocation) return;
        setCurrentLocation(t.dhakaBangladesh);
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, timeout: 15000 });
        watchId = navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true });
    } else {
        if (!isManualLocation) {
            setCurrentLocation("GPS Not Supported");
        }
    }

    return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [t, language, isManualLocation]); 

  // Force update default location string when language changes (if in auto mode)
  useEffect(() => {
      if (!isManualLocation) {
          setCurrentLocation(t.dhakaBangladesh);
      }
  }, [language, t.dhakaBangladesh, isManualLocation]);


  // Smooth Refresh
  const handleRefreshApp = () => {
      navigate(PageRoutes.HOME);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleManualLocationRefresh = () => {
      setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
      if (selectedDistrict && selectedUpazila) {
          setCurrentLocation(`${selectedUpazila}, ${selectedDistrict}`);
          setIsManualLocation(true);
          setShowLocationModal(false);
          showToast(language === 'bn' ? "লোকেশন আপডেট হয়েছে" : "Location updated", 'success');
      } else if (selectedDistrict) {
          setCurrentLocation(`${selectedDistrict}, Bangladesh`);
          setIsManualLocation(true);
          setShowLocationModal(false);
          showToast(language === 'bn' ? "লোকেশন আপডেট হয়েছে" : "Location updated", 'success');
      }
  };

  const isHome = location.pathname === PageRoutes.HOME;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">
      {/* Header */}
      <header className="bg-[#0A2540] text-white pt-4 pb-2 px-4 sticky top-0 z-50 rounded-b-2xl shadow-lg">
        <div className="flex justify-between items-center mb-3">
            {/* Unique Logo - Shield + Pulse */}
            <button 
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none group" 
              onClick={handleRefreshApp}
              title={language === 'bn' ? "হোম এ যান" : "Go to Home"}
            >
                <div className="relative">
                    <div className="bg-[#2ECC71] p-2 rounded-xl transform rotate-3 transition-transform group-hover:rotate-0">
                        <ShieldCheck size={22} className="text-[#0A2540]" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-[#0A2540]">
                        <Activity size={10} className="text-red-500" />
                    </div>
                </div>
                <div className="text-left">
                    <h1 className="text-2xl font-black tracking-tight leading-none font-['Hind_Siliguri']">
                        {t.appName} <span className="text-[#2ECC71] text-lg">.</span>
                    </h1>
                    <p className="text-[10px] text-gray-300 opacity-90 tracking-wide font-medium">{t.tagline}</p>
                </div>
            </button>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-[#1a3b5c] border border-[#2c4e70] px-2.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c4e70] transition-colors shadow-sm"
               >
                 <Globe size={14} className="text-[#2ECC71]" />
                 {language === 'bn' ? 'EN' : 'BN'}
               </button>
               
               {/* Notification Bell */}
               <div className="relative">
                   <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 hover:bg-[#1a3b5c] rounded-full transition-colors ${showNotifications ? 'bg-[#1a3b5c]' : ''}`}
                   >
                      <Bell size={22} className={unreadCount > 0 ? 'animate-swing' : ''} />
                      {unreadCount > 0 && (
                          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0A2540] animate-pulse"></span>
                      )}
                   </button>
                   
                   {/* Notification Dropdown */}
                   {showNotifications && (
                       <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl text-gray-800 z-[60] overflow-hidden animate-fade-in border border-gray-100 ring-1 ring-black/5">
                           <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                               <h3 className="font-bold text-sm text-gray-700">{t.notifications} <span className="text-xs bg-gray-200 px-1.5 rounded-full">{unreadCount}</span></h3>
                               <button onClick={markAllAsRead} className="text-xs text-[#0A2540] hover:underline font-medium">{t.markRead}</button>
                           </div>
                           <div className="max-h-60 overflow-y-auto custom-scrollbar">
                               {notifications.length > 0 ? (
                                   notifications.map(n => (
                                       <div key={n.id} className={`p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40 border-l-4 border-l-blue-500' : ''}`}>
                                           <div className="flex justify-between items-start mb-1">
                                               <h4 className="text-xs font-bold text-gray-800">{n.title}</h4>
                                               <span className="text-[10px] text-gray-400">{n.time}</span>
                                           </div>
                                           <p className="text-xs text-gray-600 leading-snug">{n.message}</p>
                                       </div>
                                   ))
                               ) : (
                                   <div className="p-6 text-center text-gray-400 text-xs">{t.noNotifications}</div>
                               )}
                           </div>
                       </div>
                   )}
                   {showNotifications && (
                       <div className="fixed inset-0 z-[55]" onClick={() => setShowNotifications(false)}></div>
                   )}
               </div>
            </div>
        </div>
        
        {/* Location Bar */}
        <button 
            onClick={handleManualLocationRefresh}
            className="flex items-center justify-between bg-[#132f4d] py-2 px-4 rounded-xl w-full hover:bg-[#1a3b5c] transition-all border border-[#1e4266] shadow-inner group"
        >
            <div className="flex items-center gap-2 text-xs truncate">
                <div className="bg-[#2ECC71]/10 p-1 rounded-full">
                    <MapPin size={12} className="text-[#2ECC71]" />
                </div>
                <span className="opacity-90 font-medium tracking-wide group-hover:text-white text-gray-200">
                    {currentLocation}
                </span>
            </div>
            <div className="text-gray-400 group-hover:text-white transition-colors">
                <ChevronDown size={14} />
            </div>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto scroll-smooth bg-gray-50">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-bold text-gray-500 flex items-center gap-1 hover:text-[#0A2540] transition-colors pl-1"
          >
            ← {t.back}
          </button>
        )}
        {children}
      </main>

      {/* Floating 999 Button */}
      <div className="fixed bottom-6 right-6 z-50 md:absolute md:bottom-6 md:right-6">
        <button 
            onClick={() => navigate(PageRoutes.EMERGENCY)}
            className="group flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-xl hover:bg-red-700 hover:scale-110 transition-all duration-300 animate-bounce-slow border-4 border-white ring-2 ring-red-200"
            aria-label="Emergency Call"
        >
            <Phone size={28} className="fill-current" />
            <span className="absolute -top-2 -right-2 bg-[#0A2540] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                999
            </span>
        </button>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
          <div className="fixed inset-0 z-[60] bg-[#0A2540]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
                  <button onClick={() => setShowLocationModal(false)} className="absolute top-4 right-4 text-gray-400 p-1 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                  
                  <h3 className="text-lg font-bold text-[#0A2540] mb-6 flex items-center gap-2">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <MapPin className="text-[#0A2540]" size={20} />
                      </div>
                      {language === 'bn' ? 'অবস্থান নির্বাচন করুন' : 'Select Location'}
                  </h3>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                              {language === 'bn' ? 'জেলা' : 'District'}
                          </label>
                          <select 
                              value={selectedDistrict} 
                              onChange={(e) => {
                                  setSelectedDistrict(e.target.value);
                                  setSelectedUpazila("");
                              }}
                              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-shadow appearance-none"
                          >
                              <option value="">{language === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                              {Object.keys(districts).sort().map((dist) => (
                                  <option key={dist} value={dist}>{dist}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                              {language === 'bn' ? 'উপজেলা/থানা' : 'Upazila/Thana'}
                          </label>
                          <select 
                              value={selectedUpazila} 
                              onChange={(e) => setSelectedUpazila(e.target.value)}
                              disabled={!selectedDistrict}
                              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540] disabled:opacity-50 disabled:bg-gray-100 transition-shadow appearance-none"
                          >
                              <option value="">{language === 'bn' ? 'উপজেলা নির্বাচন করুন' : 'Select Upazila'}</option>
                              {selectedDistrict && districts[selectedDistrict]?.map((upazila) => (
                                  <option key={upazila} value={upazila}>{upazila}</option>
                              ))}
                          </select>
                      </div>

                      <button 
                          onClick={handleSaveLocation}
                          disabled={!selectedDistrict}
                          className="w-full bg-[#0A2540] text-white py-3.5 rounded-xl font-bold mt-2 disabled:opacity-50 hover:bg-[#0f365d] active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                      >
                          {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Layout;