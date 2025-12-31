import { offlineData } from './mockData';
import { AppData } from '../types';

// Simulating Firestore fetch
export const fetchFromFirestore = async (): Promise<AppData> => {
    // In a real scenario, this would use the Firebase SDK:
    // const snapshot = await firestore().collection('appData').doc('v1').get();
    // return snapshot.data() as AppData;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return existing mock data as the "cloud" source for now
    return offlineData as unknown as AppData;
};