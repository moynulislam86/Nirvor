import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  fullWidth?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon: Icon, color, onClick, fullWidth }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-4 shadow-sm border border-gray-100 transition-transform active:scale-95 flex flex-col items-center justify-center gap-3 text-center h-32 bg-white hover:shadow-md ${fullWidth ? 'col-span-2 aspect-auto h-auto py-6' : ''}`}
    >
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={32} className={color.replace('bg-', 'text-')} strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
        {title}
      </h3>
    </button>
  );
};

export default ServiceCard;