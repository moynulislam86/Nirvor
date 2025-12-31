import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Emergency from './pages/Emergency';
import Health from './pages/Health';
import LegalGovt from './pages/LegalGovt';
import Disaster from './pages/Disaster';
import Chatbot from './pages/Chatbot';
import Psychology from './pages/Psychology';
import WomenChild from './pages/WomenChild';
import Jobs from './pages/Jobs';
import Transport from './pages/Transport';
import Senior from './pages/Senior';
import Community from './pages/Community';
import Payment from './pages/Payment';
import FindDoctor from './pages/FindDoctor';
import SplashScreen from './components/SplashScreen';
import { PageRoutes } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider, useData } from './contexts/DataContext';
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './contexts/ToastContext';

// Component to handle simulated updates inside the DataContext
const UpdateSimulator = () => {
    const { broadcastNotification } = useData();
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (hasRun) return;

        // Simulate a system update 5 seconds after app load
        const timer1 = setTimeout(() => {
            broadcastNotification(
                "System Update", 
                "New emergency features added to 'Health' section."
            );
        }, 8000);

        // Simulate a weather alert 15 seconds after app load
        const timer2 = setTimeout(() => {
            broadcastNotification(
                "Weather Alert", 
                "Heavy rain expected in Sylhet region tomorrow."
            );
        }, 20000);

        setHasRun(true);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [broadcastNotification, hasRun]);

    return null;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Splash screen duration: 3 seconds as per final document
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <LanguageProvider>
        <DataProvider>
          <WalletProvider>
            {loading && <SplashScreen />}
            {!loading && (
              <Router>
                <UpdateSimulator />
                <Layout>
                  <Routes>
                    <Route path={PageRoutes.HOME} element={<Home />} />
                    <Route path={PageRoutes.EMERGENCY} element={<Emergency />} />
                    <Route path={PageRoutes.HEALTH} element={<Health />} />
                    <Route path={PageRoutes.LEGAL} element={<LegalGovt />} />
                    <Route path={PageRoutes.GOVT} element={<LegalGovt />} />
                    <Route path={PageRoutes.DISASTER} element={<Disaster />} />
                    <Route path={PageRoutes.CHAT} element={<Chatbot />} />
                    
                    {/* New Routes */}
                    <Route path={PageRoutes.PSYCHOLOGY} element={<Psychology />} />
                    <Route path={PageRoutes.WOMEN_CHILD} element={<WomenChild />} />
                    <Route path={PageRoutes.JOBS} element={<Jobs />} />
                    <Route path={PageRoutes.TRANSPORT} element={<Transport />} />
                    <Route path={PageRoutes.SENIOR} element={<Senior />} />
                    <Route path={PageRoutes.COMMUNITY} element={<Community />} />
                    <Route path={PageRoutes.PAYMENT} element={<Payment />} />
                    <Route path={PageRoutes.FIND_DOCTOR} element={<FindDoctor />} />
                  </Routes>
                </Layout>
              </Router>
            )}
          </WalletProvider>
        </DataProvider>
      </LanguageProvider>
    </ToastProvider>
  );
};

export default App;