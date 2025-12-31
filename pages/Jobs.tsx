import React, { useState } from 'react';
import { Briefcase, MapPin, Banknote, Search, GraduationCap, Clock, X, Globe, ExternalLink, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const Jobs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'skills'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language } = useLanguage();
  const { data } = useData();
  const currentData = data[language];

  const filteredJobs = currentData.jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = currentData.skillResources.filter(skill => 
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-[#0A2540]">{t.jobsTitle}</h2>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200 rounded-xl mb-4">
        <button 
            onClick={() => { setActiveTab('jobs'); clearSearch(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'jobs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
        >
            <Briefcase size={16} />
            {t.tabJobs}
        </button>
        <button 
            onClick={() => { setActiveTab('skills'); clearSearch(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'skills' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
        >
            <GraduationCap size={16} />
            {t.tabSkills}
        </button>
      </div>
      
       {/* Search Filter */}
       <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder={t.searchJobs} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
             {searchTerm && (
                <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X size={16} />
                </button>
            )}
       </div>

       {/* Results Count */}
       {searchTerm && (
           <div className="px-1 text-xs text-gray-500 font-medium mb-2">
               {activeTab === 'jobs' 
                 ? (language === 'bn' ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` : `Found ${filteredJobs.length} jobs`)
                 : (language === 'bn' ? `${filteredSkills.length} টি রিসোর্স পাওয়া গেছে` : `Found ${filteredSkills.length} resources`)
               }
           </div>
       )}

      {activeTab === 'jobs' && (
          <div className="space-y-3">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-800">{job.title}</h3>
                            <p className="text-sm text-indigo-600 font-medium">{job.company}</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-1 rounded-full font-bold">
                            {job.type}
                        </span>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Banknote size={14} />
                            {job.salary}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        {job.website ? (
                            <a 
                                href={job.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                            >
                                {t.apply} <ExternalLink size={14} />
                            </a>
                        ) : (
                            <button className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                                {t.apply}
                            </button>
                        )}
                        
                        {job.phone && (
                             <a 
                                href={`tel:${job.phone}`}
                                className="px-4 bg-green-50 text-green-600 border border-green-100 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                             >
                                 <Phone size={18} />
                             </a>
                        )}
                    </div>
                </div>
            )) : (
                <div className="text-center text-gray-400 py-10">
                    {language === 'bn' ? 'কোনো চাকরি পাওয়া যায়নি।' : 'No jobs found.'}
                </div>
            )}
          </div>
      )}

      {activeTab === 'skills' && (
          <div className="space-y-3">
              {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                  <div key={skill.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-gray-800">{skill.title}</h3>
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${skill.type === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                               {skill.type === 'online' ? t.online : t.offline}
                           </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mb-2">{skill.provider}</p>
                      <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-50 pt-3">
                          <Clock size={14} />
                          <span>{skill.duration}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                         <button className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100">
                            {t.details}
                        </button>
                        {skill.website && (
                             <a 
                                href={skill.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200"
                             >
                                 <Globe size={18} />
                             </a>
                        )}
                      </div>
                  </div>
              )) : (
                 <div className="text-center text-gray-400 py-10">
                    {language === 'bn' ? 'কোনো রিসোর্স পাওয়া যায়নি।' : 'No resources found.'}
                </div>
              )}
          </div>
      )}
    </div>
  );
};

export default Jobs;