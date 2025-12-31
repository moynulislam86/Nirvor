import React, { useState, useEffect } from 'react';
import { Phone, Share2, ShieldAlert, Flame, Ambulance, Siren, MapPin, X, Users, UserPlus, Save, HelpCircle, Building2, Search, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { districts, localHelplines } from '../services/mockData';

const Emergency: React.FC = () => {
  const { t, language } = useLanguage();
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Family Contact State
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [savedContact, setSavedContact] = useState<{name: string, number: string} | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Decision Assistant State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionStep, setDecisionStep] = useState<'type' | 'result'>('type');
  const [decisionResult, setDecisionResult] = useState<{title: string, action: string, number: string, color: string} | null>(null);

  // Smart Location Share State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locShareStep, setLocShareStep] = useState<'who' | 'where'>('who');
  const [shareTarget, setShareTarget] = useState<'family' | 'police' | 'fire' | null>(null);
  const [shareDistrict, setShareDistrict] = useState('');
  const [shareUpazila, setShareUpazila] = useState('');

  // Local Directory State
  const [dirDistrict, setDirDistrict] = useState('');
  const [dirUpazila, setDirUpazila] = useState('');

  useEffect(() => {
    // Load saved contact
    const saved = localStorage.getItem('nirvor_family_contact');
    if (saved) {
        setSavedContact(JSON.parse(saved));
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Code 1: PERMISSION_DENIED
          if (error.code === 1) {
              // Gracefully handle denied permission (coords remain null)
              return; 
          }
          console.error(`Emergency GPS Error (${error.code}): ${error.message}`);
        }
      );
    }
  }, []);

  useEffect(() => {
    let timer: any;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      window.location.href = 'tel:999';
      setCountdown(null); // Reset after call triggered
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const initiateCall = () => {
    setCountdown(3);
  };

  const cancelCall = () => {
    setCountdown(null);
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const saveContact = () => {
      if (contactName && contactNumber) {
          const contact = { name: contactName, number: contactNumber };
          localStorage.setItem('nirvor_family_contact', JSON.stringify(contact));
          setSavedContact(contact);
          setIsEditingContact(false);
      }
  };

  // --- Smart Location Logic ---
  const handleSmartLocationShare = () => {
      // Step 1: Who to share with?
      setShowLocationModal(true);
      setLocShareStep('who');
      setShareDistrict('');
      setShareUpazila('');
  };

  const processShare = () => {
      if (!coords) {
          alert(language === 'bn' 
            ? "আপনার লোকেশন পাওয়া যাচ্ছে না। দয়া করে জিপিএস চালু করুন অথবা ম্যানুয়ালি লিখুন।"
            : "GPS Coordinates not found. Please enable GPS.");
          return;
      }

      let targetNumber = '';
      
      if (shareTarget === 'family') {
          if (savedContact) {
              targetNumber = savedContact.number;
          } else {
              alert(language === 'bn' ? "পারিবারিক নাম্বার সেভ করা নেই।" : "No family contact saved.");
              return;
          }
      } else if (shareTarget === 'police' || shareTarget === 'fire') {
          // Look up local number
          const localData = localHelplines[shareUpazila] || localHelplines["Gulshan"]; // Fallback to Gulshan for demo
          if (shareTarget === 'police') targetNumber = localData.police;
          if (shareTarget === 'fire') targetNumber = localData.fire;
      }

      const text = `HELP! Emergency at: https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
      const smsLink = `sms:${targetNumber}?body=${encodeURIComponent(text)}`;
      window.location.href = smsLink;
      setShowLocationModal(false);
  };

  // AI Decision Logic
  const handleDecision = (type: 'medical' | 'fire' | 'police' | 'unknown') => {
      setDecisionStep('result');
      switch(type) {
          case 'medical':
              setDecisionResult({
                  title: t.medicalIssue,
                  action: "Keep patient safe and call ambulance.",
                  number: "104",
                  color: "text-green-600 bg-green-50"
              });
              break;
          case 'fire':
               setDecisionResult({
                  title: t.fireIssue,
                  action: "Move to safety immediately.",
                  number: "105",
                  color: "text-orange-600 bg-orange-50"
              });
              break;
          case 'police':
               setDecisionResult({
                  title: t.crimeIssue,
                  action: "Hide or go to public place.",
                  number: "999",
                  color: "text-blue-600 bg-blue-50"
              });
              break;
          case 'unknown':
               setDecisionResult({
                  title: t.unknownIssue,
                  action: "Explain situation to operator.",
                  number: "999",
                  color: "text-red-600 bg-red-50"
              });
              break;
      }
  };

  // Helper for Directory
  const getDirectoryData = () => {
      if (!dirUpazila) return null;
      return localHelplines[dirUpazila] || {
          police: "017........", // Generic fallback
          fire: "017........",
          uno: "017........",
          hospital: "017........"
      };
  };
  const dirData = getDirectoryData();

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      {/* Countdown Modal */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-center text-white animate-fade-in">
           <div className="text-center">
             <div className="text-8xl font-black mb-4 animate-ping">{countdown}</div>
             <p className="text-2xl font-bold mb-8">{t.calling}</p>
             <button 
              onClick={cancelCall}
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-gray-100"
             >
               <X size={24} />
               {t.cancel}
             </button>
           </div>
        </div>
      )}

      {/* Decision Assistant Modal */}
      {showDecisionModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                  <button onClick={() => {setShowDecisionModal(false); setDecisionStep('type');}} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
                  {decisionStep === 'type' ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <HelpCircle className="text-indigo-600" />
                            {t.whatHappened}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => handleDecision('medical')} className="p-4 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 hover:bg-green-100 text-left">{t.medicalIssue}</button>
                            <button onClick={() => handleDecision('fire')} className="p-4 rounded-xl bg-orange-50 text-orange-700 font-bold border border-orange-200 hover:bg-orange-100 text-left">{t.fireIssue}</button>
                            <button onClick={() => handleDecision('police')} className="p-4 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 text-left">{t.crimeIssue}</button>
                            <button onClick={() => handleDecision('unknown')} className="p-4 rounded-xl bg-gray-50 text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 text-left">{t.unknownIssue}</button>
                        </div>
                      </>
                  ) : (
                      <div className="text-center">
                          <div className={`p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 ${decisionResult?.color}`}>
                              <Phone size={40} className="fill-current" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{decisionResult?.title}</h3>
                          <p className="text-gray-600 mb-6">{decisionResult?.action}</p>
                          <button onClick={() => window.location.href = `tel:${decisionResult?.number}`} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 animate-pulse">{t.call} ({decisionResult?.number})</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- SMART LOCATION SHARE MODAL --- */}
      {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                  <button onClick={() => setShowLocationModal(false)} className="absolute top-4 right-4 text-gray-400"><X size={24}/></button>
                  
                  <h3 className="text-xl font-bold text-[#0A2540] mb-2 flex items-center gap-2">
                      <Share2 size={20} className="text-red-500" />
                      {language === 'bn' ? 'লোকেশন পাঠান' : 'Share Location'}
                  </h3>

                  {locShareStep === 'who' && (
                      <div className="space-y-4 mt-4">
                          <p className="text-sm text-gray-500">{language === 'bn' ? 'কাকে পাঠাতে চান?' : 'Who do you want to alert?'}</p>
                          <button onClick={() => { setShareTarget('family'); processShare(); }} className="w-full p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 hover:bg-indigo-100 transition-colors">
                              <div className="bg-indigo-200 p-2 rounded-full text-indigo-700"><Users size={20}/></div>
                              <div className="text-left"><h4 className="font-bold text-indigo-900">{t.familyContacts}</h4><p className="text-xs text-indigo-600">{savedContact ? savedContact.name : "Not Saved"}</p></div>
                          </button>
                          <button onClick={() => { setShareTarget('police'); setLocShareStep('where'); }} className="w-full p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3 hover:bg-blue-100 transition-colors">
                              <div className="bg-blue-200 p-2 rounded-full text-blue-700"><Siren size={20}/></div>
                              <div className="text-left"><h4 className="font-bold text-blue-900">{language === 'bn' ? 'নিকটস্থ থানা' : 'Nearest Police'}</h4><p className="text-xs text-blue-600">Select Area</p></div>
                          </button>
                          <button onClick={() => { setShareTarget('fire'); setLocShareStep('where'); }} className="w-full p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-3 hover:bg-orange-100 transition-colors">
                              <div className="bg-orange-200 p-2 rounded-full text-orange-700"><Flame size={20}/></div>
                              <div className="text-left"><h4 className="font-bold text-orange-900">{language === 'bn' ? 'ফায়ার সার্ভিস' : 'Fire Service'}</h4><p className="text-xs text-orange-600">Select Area</p></div>
                          </button>
                      </div>
                  )}

                  {locShareStep === 'where' && (
                      <div className="space-y-4 mt-4">
                          <p className="text-sm text-gray-500">{language === 'bn' ? 'আপনার বর্তমান এলাকা নির্বাচন করুন:' : 'Select your current area:'}</p>
                          <select value={shareDistrict} onChange={(e) => { setShareDistrict(e.target.value); setShareUpazila(''); }} className="w-full p-3 rounded-xl border border-gray-200 text-sm">
                              <option value="">{t.district}</option>
                              {Object.keys(districts).sort().map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <select value={shareUpazila} onChange={(e) => setShareUpazila(e.target.value)} disabled={!shareDistrict} className="w-full p-3 rounded-xl border border-gray-200 text-sm disabled:bg-gray-100">
                              <option value="">{t.upazila}</option>
                              {shareDistrict && districts[shareDistrict]?.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                          <button onClick={processShare} disabled={!shareUpazila} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:bg-red-700">
                              <Send size={18} /> {language === 'bn' ? 'SMS পাঠান' : 'Send SMS'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Header Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex justify-between items-center">
        <div>
            <h3 className="font-bold text-red-700 flex items-center gap-2">
                <ShieldAlert size={20} />
                {t.emergencyTitle}
            </h3>
            <p className="text-sm text-red-600 mt-1">{t.emergencySubtitle}</p>
        </div>
        <button onClick={() => setShowDecisionModal(true)} className="bg-white text-red-600 text-xs px-3 py-1.5 rounded-full font-bold border border-red-200 shadow-sm flex items-center gap-1 hover:bg-red-50">
            <HelpCircle size={14} /> {t.whatToDo}
        </button>
      </div>

      {/* Main Call Button 999 */}
      <button onClick={initiateCall} className="w-full bg-gradient-to-br from-red-600 to-red-700 text-white py-6 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all border-4 border-white ring-4 ring-red-100 relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
        <div className="bg-white/20 p-4 rounded-full animate-pulse relative z-10">
            <Phone size={40} className="fill-current" />
        </div>
        <div className="text-center leading-none relative z-10">
            <span className="text-4xl font-black tracking-widest block">999</span>
            <span className="text-xs bg-red-900/40 px-3 py-0.5 rounded-full inline-block mt-2 border border-red-400/30">{t.nationalEmergency}</span>
        </div>
      </button>

      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => handleCall('104')} className="bg-white border border-[#2ECC71]/30 hover:bg-[#2ECC71]/5 p-4 rounded-2xl flex flex-col items-center gap-2 text-green-700 shadow-sm transition-all active:scale-95 text-center">
            <div className="bg-[#2ECC71]/10 p-3 rounded-full"><Ambulance size={24} className="text-[#2ECC71]" /></div>
            <span className="font-bold text-sm">{t.ambulance}</span>
        </button>
        <button onClick={() => handleCall('105')} className="bg-white border border-orange-100 hover:bg-orange-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-orange-700 shadow-sm transition-all active:scale-95 text-center">
             <div className="bg-orange-100 p-3 rounded-full"><Flame size={24} /></div>
            <span className="font-bold text-sm">{t.fire}</span>
        </button>
         <button onClick={() => handleCall('100')} className="bg-white border border-blue-100 hover:bg-blue-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-blue-700 shadow-sm transition-all active:scale-95 text-center">
             <div className="bg-blue-100 p-3 rounded-full"><Siren size={24} /></div>
            <span className="font-bold text-sm">{t.police}</span>
        </button>
        {/* Share Location Button - Updated */}
        <button onClick={handleSmartLocationShare} className="bg-[#0A2540] text-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full"></div>
             <div className="bg-white/20 p-3 rounded-full"><Share2 size={24} /></div>
            <span className="font-bold text-sm">{t.shareLocation}</span>
        </button>
      </div>

      {/* Family Contact Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Users size={18} /> {t.familyContacts}</h3>
              <button onClick={() => setIsEditingContact(true)} className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded flex items-center gap-1">
                  {savedContact ? t.change : t.add}
              </button>
          </div>
          {isEditingContact ? (
              <div className="space-y-2">
                  <input type="text" placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full p-2 rounded border text-sm" />
                  <input type="tel" placeholder="Mobile Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full p-2 rounded border text-sm" />
                  <button onClick={saveContact} className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-bold flex items-center justify-center gap-2"><Save size={16} /> {t.save}</button>
              </div>
          ) : savedContact ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                  <div><p className="font-bold text-gray-800">{savedContact.name}</p><p className="text-xs text-gray-500">{savedContact.number}</p></div>
                  <div className="flex gap-2">
                      <button onClick={() => handleCall(savedContact.number)} className="p-2 bg-green-100 text-green-700 rounded-full"><Phone size={18} /></button>
                  </div>
              </div>
          ) : <p className="text-sm text-gray-500 italic">{t.noContact}</p>}
      </div>

      {/* --- NEW SECTION: Local Emergency Directory --- */}
      <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-bold text-[#0A2540] mb-4 flex items-center gap-2 text-lg">
              <Building2 size={22} className="text-[#2ECC71]" />
              {language === 'bn' ? 'লোকাল হেল্পলাইন ডিরেক্টরি' : 'Local Emergency Directory'}
          </h3>
          
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3">
                  <select value={dirDistrict} onChange={(e) => { setDirDistrict(e.target.value); setDirUpazila(''); }} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold">
                      <option value="">{t.district}</option>
                      {Object.keys(districts).sort().map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={dirUpazila} onChange={(e) => setDirUpazila(e.target.value)} disabled={!dirDistrict} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold disabled:opacity-50">
                      <option value="">{t.upazila}</option>
                      {dirDistrict && districts[dirDistrict]?.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
              </div>

              {dirUpazila ? (
                  <div className="space-y-3 animate-fade-in">
                      {dirData && (
                          <>
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-200 p-2 rounded-full text-blue-700"><Siren size={18}/></div>
                                    <div><p className="text-xs font-bold text-blue-800">Thana (Police)</p><p className="text-sm font-mono text-blue-900">{dirData.police}</p></div>
                                </div>
                                <button onClick={() => handleCall(dirData.police)} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"><Phone size={16}/></button>
                            </div>
                            <div className="flex items-center justify-between bg-orange-50 p-3 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-200 p-2 rounded-full text-orange-700"><Flame size={18}/></div>
                                    <div><p className="text-xs font-bold text-orange-800">Fire Station</p><p className="text-sm font-mono text-orange-900">{dirData.fire}</p></div>
                                </div>
                                <button onClick={() => handleCall(dirData.fire)} className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700"><Phone size={16}/></button>
                            </div>
                            <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-200 p-2 rounded-full text-green-700"><Ambulance size={18}/></div>
                                    <div><p className="text-xs font-bold text-green-800">Hospital</p><p className="text-sm font-mono text-green-900">{dirData.hospital}</p></div>
                                </div>
                                <button onClick={() => handleCall(dirData.hospital)} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"><Phone size={16}/></button>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-200 p-2 rounded-full text-gray-700"><Building2 size={18}/></div>
                                    <div><p className="text-xs font-bold text-gray-800">UNO Office</p><p className="text-sm font-mono text-gray-900">{dirData.uno}</p></div>
                                </div>
                                <button onClick={() => handleCall(dirData.uno)} className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"><Phone size={16}/></button>
                            </div>
                          </>
                      )}
                  </div>
              ) : (
                  <div className="text-center py-6 text-gray-400">
                      <Search size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs">{language === 'bn' ? 'এলাকা নির্বাচন করলে নাম্বার দেখা যাবে' : 'Select an area to see helpline numbers'}</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Emergency;