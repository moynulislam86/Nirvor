import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineData } from '../services/mockData';
import { fetchFromFirestore } from '../services/firestoreService';
import { AppData, Notification } from '../types';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

interface DataContextType {
    data: AppData;
    isLoading: boolean;
    notifications: Notification[];
    unreadCount: number;
    refreshData: () => Promise<void>;
    broadcastNotification: (title: string, message: string) => void;
    markAllAsRead: () => void;
}

// Initial state uses the imported mockData as a safe fallback
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [data, setData] = useState<AppData>(offlineData as unknown as AppData);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { showToast } = useToast();
    const { language } = useLanguage();

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    const loadData = async () => {
        let hasLocalData = false;

        // 1. Try local storage (Hive equivalent for Web)
        try {
            const local = localStorage.getItem('nirvor_offline_data');
            if (local) {
                const parsedData = JSON.parse(local);
                if (parsedData && parsedData.bn && parsedData.en) {
                    setData(parsedData);
                    hasLocalData = true;
                    setIsLoading(false); // Show local data immediately
                }
            }
        } catch (e) {
            console.error("Local storage read error", e);
        }

        // 2. Try network sync (Firestore)
        try {
            const cloudData = await fetchFromFirestore();
            if (cloudData) {
                setData(cloudData);
                localStorage.setItem('nirvor_offline_data', JSON.stringify(cloudData));
                localStorage.setItem('nirvor_last_sync', new Date().toISOString());
                console.log("Data synced with Firestore");
            }
        } catch (e) {
            console.warn("Sync failed - using offline data", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Load initial notifications based on language
    useEffect(() => {
        if (data && data[language]) {
            // Merge existing state with language specific static data to avoid duplicates if needed
            // For simplicity, we initialize with static data if empty
            if (notifications.length === 0) {
                 setNotifications(data[language].notifications || []);
            }
        }
    }, [data, language]);

    // Function to trigger a new notification throughout the app
    const broadcastNotification = (title: string, message: string) => {
        const newNote: Notification = {
            id: Date.now().toString(),
            title,
            message,
            time: 'Just now',
            read: false
        };

        setNotifications(prev => [newNote, ...prev]);
        
        // 1. Show Popup Toast
        showToast(`${title}: ${message}`, 'info');

        // 2. Play Sound
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio play failed (interaction needed)"));
        } catch (e) {
            console.error("Sound error", e);
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ 
            data, 
            isLoading, 
            refreshData: loadData,
            notifications,
            unreadCount,
            broadcastNotification,
            markAllAsRead
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};