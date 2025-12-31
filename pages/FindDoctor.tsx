import React, { useState } from 'react';
import { Stethoscope, Search, MapPin, Phone, Clock, GraduationCap, X, Briefcase, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { districts } from '../services/mockData';

const FindDoctor: React.FC = () => {
  const { language, t } = useLanguage();
  const { data } = useData();
  const currentData = data[language];

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique specialties
  const specialties = Array.from(new Set(currentData.doctors.map(d => d.specialty))).sort();

  // Filter Logic
  const filteredDoctors = currentData.doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict ? doctor.district === selectedDistrict : true;
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;

    return matchesSearch && matchesDistrict && matchesSpecialty;
  });

  return (
    <div className="animate-fade-in space-y-5 pb-10">
       {/* Header */}
       <div className="bg-teal-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <Stethoscope size={64} className="absolute -right-6 -bottom-6 text-white/20" />
          <h2 className="text-2xl font-bold flex items-center gap-2">
              {t.findDoctorTitle}
          </h2>
          <p className="opacity-90 text-sm mt-1">{t.findDoctorSubtitle}</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
          {/* Search */}
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                  type="text" 
                  placeholder={t.searchDoctorPlaceholder} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
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

          <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors ${showFilters ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-200 text-gray-700'}`}
              >
                  <Filter size={16} /> Filters
              </button>
              
              {/* Quick Specialty Chips (Scrollable) */}
              <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2">
                  <button 
                      onClick={() => setSelectedSpecialty('')}
                      className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${!selectedSpecialty ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                      {t.allSpecialties}
                  </button>
                  {specialties.slice(0, 5).map(spec => (
                      <button 
                          key={spec}
                          onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? '' : spec)}
                          className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${selectedSpecialty === spec ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                          {spec}
                      </button>
                  ))}
              </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in-down">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">{t.district}</label>
                      <select 
                          value={selectedDistrict} 
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50"
                      >
                          <option value="">{t.allDistricts}</option>
                          {Object.keys(districts).sort().map(dist => (
                              <option key={dist} value={dist}>{dist}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">{t.specialty}</label>
                      <select 
                          value={selectedSpecialty} 
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50"
                      >
                          <option value="">{t.allSpecialties}</option>
                          {specialties.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                          ))}
                      </select>
                  </div>
              </div>
          )}
      </div>

      {/* Results */}
      <div className="space-y-4">
          {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-4 border-b border-gray-50 flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-teal-600 border border-teal-100">
                              {doc.name.charAt(0)}
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-800 text-lg">{doc.name}</h3>
                              <p className="text-teal-600 text-sm font-semibold">{doc.specialty} {t.specialty}</p>
                              <p className="text-gray-500 text-xs mt-1">{doc.designation}</p>
                          </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                              <GraduationCap size={16} className="text-gray-400 mt-0.5 shrink-0" />
                              <p className="text-sm text-gray-600">{doc.degrees}</p>
                          </div>
                          <div className="flex items-start gap-3">
                              <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                              <div className="text-sm">
                                  <p className="text-gray-800 font-medium">{doc.hospital}</p>
                                  <p className="text-gray-500 text-xs">{doc.district}</p>
                              </div>
                          </div>
                          {doc.visitingHours && (
                               <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                   <Clock size={16} className="text-orange-400 shrink-0" />
                                   <span>{t.visitingHours}: {doc.visitingHours}</span>
                               </div>
                          )}
                      </div>

                      <div className="p-3 bg-gray-50 flex items-center gap-3 border-t border-gray-100">
                           {doc.fee && (
                               <div className="flex-1 text-center border-r border-gray-200">
                                   <p className="text-xs text-gray-400 font-bold uppercase">{t.fee}</p>
                                   <p className="text-sm font-bold text-gray-800">{doc.fee}</p>
                               </div>
                           )}
                           <a 
                             href={`tel:${doc.phone}`}
                             className="flex-[2] bg-teal-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors"
                           >
                               <Phone size={16} /> {t.call}
                           </a>
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-center py-10 text-gray-400">
                  <Stethoscope size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="font-bold">No doctors found</p>
                  <p className="text-sm">Try changing filters</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default FindDoctor;