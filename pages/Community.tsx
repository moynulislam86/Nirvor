import React, { useState } from 'react';
import { Users, MapPin, Heart, Calendar, Droplets, Gift, Phone, Search, X, CheckCircle, Clock, Navigation, User, Globe, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { CommunityEvent, CommunityItem } from '../types';

const Community: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const currentData = data[language];
  
  const [activeTab, setActiveTab] = useState<'volunteers' | 'blood' | 'donation' | 'events'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Modal State
  const [selectedHelper, setSelectedHelper] = useState<CommunityItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);

  // Filter Logic
  const filterHelpers = (type: string) => {
      return currentData.communityHelpers.filter(item => 
          item.type === type &&
          (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (item.bloodGroup && item.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())))
      );
  };

  const filterEvents = () => {
      return currentData.communityEvents.filter(event => 
          (event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           event.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedDistrict ? event.district === selectedDistrict : true)
      );
  };

  const activeItems = activeTab === 'events' ? filterEvents() : filterHelpers(activeTab === 'volunteers' ? 'volunteer' : activeTab === 'blood' ? 'blood' : 'donation');

  // Districts for Filter
  const districts = Array.from(new Set(currentData.communityEvents.map(e => e.district))).sort();

  return (
    <div className="animate-fade-in space-y-5 pb-10 relative">
      {/* Header */}
      <div className="bg-cyan-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <Users size={64} className="absolute -right-6 -bottom-6 text-white/20" />
          <h2 className="text-2xl font-bold flex items-center gap-2">
              {t.commTitle}
          </h2>
          <p className="opacity-90 text-sm mt-1">{t.commSubtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200 rounded-xl overflow-x-auto">
        <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${activeTab === 'events' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}
        >
            <Calendar size={14} />
            {t.tabEvents}
        </button>
        <button 
            onClick={() => setActiveTab('volunteers')}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${activeTab === 'volunteers' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500'}`}
        >
            <Users size={14} />
            {t.tabVolunteers}
        </button>
        <button 
            onClick={() => setActiveTab('blood')}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${activeTab === 'blood' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
        >
            <Droplets size={14} />
            {t.tabBlood}
        </button>
        <button 
            onClick={() => setActiveTab('donation')}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${activeTab === 'donation' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
        >
            <Gift size={14} />
            {t.tabDonation}
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                  type="text" 
                  placeholder={t.searchJobs} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
               {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
          </div>

          {/* District Filter (Only for Events) */}
          {activeTab === 'events' && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                   <button 
                      onClick={() => setSelectedDistrict('')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${!selectedDistrict ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                   >
                       {t.allDistricts}
                   </button>
                   {districts.map(d => (
                       <button 
                          key={d}
                          onClick={() => setSelectedDistrict(d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedDistrict === d ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                       >
                           {d}
                       </button>
                   ))}
              </div>
          )}
      </div>

      {/* Content List */}
      <div className="space-y-3">
          {activeTab === 'events' ? (
              // Events List
              (activeItems as CommunityEvent[]).length > 0 ? (
                  (activeItems as CommunityEvent[]).map((event) => (
                      <div 
                        key={event.id} 
                        onClick={() => setSelectedEvent(event)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                                      {event.type.toUpperCase()}
                                  </span>
                                  <h4 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{event.title}</h4>
                              </div>
                              <div className="text-center bg-gray-50 p-1.5 rounded-lg min-w-[50px]">
                                  <span className="block text-xs font-bold text-gray-500">{event.date.split(',')[0]}</span>
                                  <span className="block text-sm font-black text-purple-600">{event.date.split(' ')[2]}</span>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {event.district}
                              </div>
                          </div>
                      </div>
                  ))
              ) : <div className="text-center text-gray-400 py-10">No events found.</div>
          ) : (
              // Helpers/Donors List
              (activeItems as CommunityItem[]).length > 0 ? (
                  (activeItems as CommunityItem[]).map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedHelper(item)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                      item.type === 'blood' ? 'bg-red-500' : 
                                      item.type === 'donation' ? 'bg-green-500' : 'bg-cyan-500'
                                  }`}>
                                      {item.name[0]}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-800 flex items-center gap-1">
                                          {item.name}
                                          {item.verified && <CheckCircle size={12} className="text-blue-500" />}
                                      </h4>
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                          <MapPin size={10} />
                                          {item.location}
                                      </p>
                                  </div>
                              </div>
                              {item.bloodGroup && (
                                  <span className="bg-red-100 text-red-600 font-bold px-2 py-1 rounded text-xs">
                                      {item.bloodGroup}
                                  </span>
                              )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400">
                               {item.lastActive && <span>{t.lastActive}: {item.lastActive}</span>}
                               {item.totalHelped && <span>• {t.totalHelped}: {item.totalHelped}</span>}
                          </div>
                      </div>
                  ))
              ) : <div className="text-center text-gray-400 py-10">No results found.</div>
          )}
      </div>

      {/* --- EVENT MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 p-1 bg-gray-100 rounded-full"><X size={20}/></button>
                
                <div className="mb-4">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {selectedEvent.type.toUpperCase()}
                    </span>
                    <h2 className="text-xl font-bold text-gray-800 mt-2">{selectedEvent.title}</h2>
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                        <Calendar size={18} className="text-purple-500 mt-0.5" />
                        <div>
                            <p className="font-bold text-gray-800">{selectedEvent.date}</p>
                            <p>{selectedEvent.time}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                        <MapPin size={18} className="text-purple-500 mt-0.5" />
                        <div>
                            <p className="font-bold text-gray-800">{selectedEvent.location}</p>
                            <p className="text-xs">{selectedEvent.district}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">{t.eventDetails}</h4>
                        <p className="leading-relaxed bg-white border border-gray-100 p-3 rounded-xl">
                            {selectedEvent.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">{t.organizer}</h4>
                        <div className="flex items-center gap-2">
                             <User size={16} />
                             <span>{selectedEvent.organizer}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <a 
                            href={`tel:${selectedEvent.contact}`}
                            className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700"
                        >
                            <Phone size={16} /> {t.contact}
                        </a>
                        <button 
                             onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`, '_blank')}
                             className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                        >
                            <Navigation size={16} /> {t.getDirections}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- HELPER MODAL --- */}
      {selectedHelper && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSelectedHelper(null)} className="absolute top-4 right-4 text-gray-400 p-1 bg-gray-100 rounded-full"><X size={20}/></button>
                
                <div className="flex flex-col items-center mb-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl text-white mb-3 ${
                        selectedHelper.type === 'blood' ? 'bg-red-500' : 
                        selectedHelper.type === 'donation' ? 'bg-green-500' : 'bg-cyan-500'
                    }`}>
                        {selectedHelper.name[0]}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-1 text-center">
                        {selectedHelper.name}
                        {selectedHelper.verified && <CheckCircle size={18} className="text-blue-500" />}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {selectedHelper.location}
                    </p>
                </div>

                <div className="space-y-4 text-sm">
                    {selectedHelper.bloodGroup && (
                        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
                             <span className="text-gray-500 text-xs block">Blood Group</span>
                             <span className="text-xl font-black text-red-600">{selectedHelper.bloodGroup}</span>
                        </div>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-gray-600 text-center leading-relaxed">
                            "{selectedHelper.description}"
                        </p>
                    </div>

                    {/* Donation Bank Info */}
                    {selectedHelper.donationDetails && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                <CreditCard size={16} /> Donation Info
                            </h4>
                            <p className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                {selectedHelper.donationDetails}
                            </p>
                            <button 
                                onClick={() => navigator.clipboard.writeText(selectedHelper.donationDetails || '')}
                                className="mt-2 text-xs text-green-600 font-bold underline"
                            >
                                Copy Details
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between text-xs text-gray-500 px-2">
                        <span>{t.lastActive}: <strong>{selectedHelper.lastActive || 'N/A'}</strong></span>
                        <span>{t.totalHelped}: <strong>{selectedHelper.totalHelped || 0} {t.people}</strong></span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <a 
                            href={`tel:${selectedHelper.contact}`}
                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white transition-colors ${
                                selectedHelper.type === 'blood' ? 'bg-red-600 hover:bg-red-700' : 
                                selectedHelper.type === 'donation' ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'
                            }`}
                        >
                            <Phone size={18} /> {t.contact}
                        </a>
                        
                        {selectedHelper.website && (
                             <a 
                                href={selectedHelper.website}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                            >
                                <Globe size={18} /> {t.visitSite}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Community;