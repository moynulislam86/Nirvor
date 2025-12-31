import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle size={20} className="text-green-500" />;
          case 'error': return <AlertCircle size={20} className="text-red-500" />;
          case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
          default: return <Info size={20} className="text-blue-500" />;
      }
  };

  const getBorderColor = (type: string) => {
      switch(type) {
          case 'success': return 'border-green-200 bg-green-50';
          case 'error': return 'border-red-200 bg-red-50';
          case 'warning': return 'border-amber-200 bg-amber-50';
          default: return 'border-blue-200 bg-blue-50';
      }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in-down transition-all ${getBorderColor(toast.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
            <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">{toast.message}</p>
            <button 
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};