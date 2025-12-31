import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Siren, HeartPulse, Scale, Building2, 
  CloudRainWind, Briefcase, Car, Brain, 
  Baby, Accessibility, Users, CreditCard, MessageSquareText, Stethoscope
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { PageRoutes } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0A2540]">{t.services}</h2>
        <p className="text-sm text-gray-500">{t.amISafe}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-6">
        {/* Row 1: Core Emergency */}
        <ServiceCard 
          title={t.serviceEmergency} 
          icon={Siren} 
          color="text-red-600 bg-red-600" 
          onClick={() => navigate(PageRoutes.EMERGENCY)} 
        />
        <ServiceCard 
          title={t.serviceHealth} 
          icon={HeartPulse} 
          color="text-[#2ECC71] bg-[#2ECC71]" 
          onClick={() => navigate(PageRoutes.HEALTH)} 
        />

        {/* Row 2: Find Doctor & Special Support */}
        <ServiceCard 
          title={t.serviceFindDoctor} 
          icon={Stethoscope} 
          color="text-teal-600 bg-teal-600" 
          onClick={() => navigate(PageRoutes.FIND_DOCTOR)} 
        />
        <ServiceCard 
          title={t.serviceWomenChild} 
          icon={Baby} 
          color="text-pink-500 bg-pink-500" 
          onClick={() => navigate(PageRoutes.WOMEN_CHILD)} 
        />

        {/* Row 3: Psychology & Legal */}
        <ServiceCard 
          title={t.servicePsychology} 
          icon={Brain} 
          color="text-teal-500 bg-teal-500" 
          onClick={() => navigate(PageRoutes.PSYCHOLOGY)} 
        />
        <ServiceCard 
          title={t.serviceLegal} 
          icon={Scale} 
          color="text-blue-600 bg-blue-600" 
          onClick={() => navigate(PageRoutes.LEGAL)} 
        />
        
        {/* Row 4: Govt & Jobs */}
        <ServiceCard 
          title={t.serviceGovt} 
          icon={Building2} 
          color="text-orange-600 bg-orange-600" 
          onClick={() => navigate(PageRoutes.GOVT)} 
        />
        <ServiceCard 
          title={t.serviceJobs} 
          icon={Briefcase} 
          color="text-indigo-600 bg-indigo-600" 
          onClick={() => navigate(PageRoutes.JOBS)} 
        />

        {/* Row 5: Transport & Payment */}
         <ServiceCard 
          title={t.serviceTransport} 
          icon={Car} 
          color="text-slate-600 bg-slate-600" 
          onClick={() => navigate(PageRoutes.TRANSPORT)} 
        />
         <ServiceCard 
          title={t.servicePayment} 
          icon={CreditCard} 
          color="text-emerald-600 bg-emerald-600" 
          onClick={() => navigate(PageRoutes.PAYMENT)} 
        />

        {/* Row 6: Community & Disaster */}
         <ServiceCard 
          title={t.serviceCommunity} 
          icon={Users} 
          color="text-cyan-600 bg-cyan-600" 
          onClick={() => navigate(PageRoutes.COMMUNITY)} 
        />
        <ServiceCard 
          title={t.serviceDisaster} 
          icon={CloudRainWind} 
          color="text-purple-600 bg-purple-600" 
          onClick={() => navigate(PageRoutes.DISASTER)} 
        />
        
        {/* Row 7: Senior */}
         <ServiceCard 
          title={t.serviceSenior} 
          icon={Accessibility} 
          color="text-amber-600 bg-amber-600" 
          onClick={() => navigate(PageRoutes.SENIOR)} 
        />

        {/* Row 8: AI */}
         <ServiceCard 
          title={t.serviceChat} 
          icon={MessageSquareText} 
          color="text-[#0A2540] bg-[#0A2540]" 
          onClick={() => navigate(PageRoutes.CHAT)}
        />
      </div>
    </div>
  );
};

export default Home;