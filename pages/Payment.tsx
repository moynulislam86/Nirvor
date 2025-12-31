import React, { useState } from 'react';
import { CreditCard, Smartphone, Zap, Droplets, Flame, Wifi, Tv, Building2, ChevronRight, AlertCircle, Wallet, History, Download, X, CheckCircle, Loader2, Lock, MessageSquare, MapPin, Copy, Phone, FileText, TrainFront, BusFront, ExternalLink, Globe, Ticket, ArrowLeft, Mail, MessageSquareText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { districts } from '../services/mockData';
import { Transaction } from '../types';

interface ServiceProvider {
  name: string;
  helpline: string;
}

// Providers Data
const serviceProviders: Record<string, ServiceProvider[]> = {
    "Mobile Recharge": [
      { name: "Grameenphone", helpline: "121" },
      { name: "Robi", helpline: "121" },
      { name: "Banglalink", helpline: "121" },
      { name: "Teletalk", helpline: "121" },
      { name: "Airtel", helpline: "121" },
      { name: "Skitto", helpline: "121" }
    ],
    "Electricity": [
      { name: "BPDB (Palli Bidyut) Prepaid", helpline: "16200" },
      { name: "BPDB (Palli Bidyut) Postpaid", helpline: "16200" },
      { name: "DESCO (Dhaka) Prepaid", helpline: "16120" },
      { name: "DESCO (Dhaka) Postpaid", helpline: "16120" },
      { name: "DPDC (Dhaka) Prepaid", helpline: "16116" },
      { name: "DPDC (Dhaka) Postpaid", helpline: "16116" },
      { name: "WZPDCL (West Zone)", helpline: "16117" },
      { name: "NESCO (North Zone)", helpline: "16603" },
      { name: "BREB", helpline: "02-8900331" }
    ],
    "Gas": [
      { name: "Titas Gas (Non-Metered)", helpline: "16496" },
      { name: "Titas Gas (Metered)", helpline: "16496" },
      { name: "Karnaphuli Gas (KGDCL)", helpline: "02-333314511" },
      { name: "Jalalabad Gas (JGTDSL)", helpline: "0821-717274" },
      { name: "Sundarban Gas", helpline: "02-55138753" },
      { name: "Pashchimanchal Gas (PGCL)", helpline: "0751-63829" },
      { name: "Bakhrabad Gas (BGDCL)", helpline: "081-68858" }
    ],
    "Water": [
      { name: "Dhaka WASA", helpline: "16162" },
      { name: "Chattogram WASA", helpline: "09612-500600" },
      { name: "Khulna WASA", helpline: "041-762233" },
      { name: "Rajshahi WASA", helpline: "0721-772186" }
    ],
    "Internet": [
      { name: "Link3", helpline: "16335" },
      { name: "Amber IT", helpline: "09611-999111" },
      { name: "Carnival Internet", helpline: "09666-777888" },
      { name: "Dot Internet", helpline: "16755" },
      { name: "Sam Online", helpline: "09666-775577" },
      { name: "KS Network", helpline: "09606-555555" },
      { name: "Triangle", helpline: "09666-770770" },
      { name: "Mazeda Networks", helpline: "09613-334455" },
      { name: "Circle Network", helpline: "16439" },
      { name: "Antaranga Dot Com", helpline: "09611-800800" }
    ],
    "TV": [
      { name: "Akash DTH", helpline: "16442" },
      { name: "Bengal Digital", helpline: "16543" },
      { name: "Jadoo Digital", helpline: "16568" },
      { name: "Bumbye Digital", helpline: "09613-300300" }
    ],
    "City Services": [
      { name: "DNCC (Dhaka North) Tax", helpline: "16106" },
      { name: "DSCC (Dhaka South) Tax", helpline: "09611-100200" },
      { name: "Chattogram City Corp", helpline: "02-333336585" },
      { name: "Gazipur City Corp", helpline: "09678-777222" },
      { name: "Narayanganj City Corp", helpline: "02-7645853" },
      { name: "Sylhet City Corp", helpline: "0821-716480" }
    ]
};

const Payment: React.FC = () => {
  const { t, language } = useLanguage();
  const { transactions, addTransaction, accounts } = useWallet();
  const { showToast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");

  // --- Payment Flow State ---
  const [activeService, setActiveService] = useState<string | null>(null);
  const [isTicketService, setIsTicketService] = useState(false);
  const [ticketProviders, setTicketProviders] = useState<{name: string, url: string, description?: string}[]>([]);
  const [ticketStep, setTicketStep] = useState<'list' | 'payment' | 'success'>('list');
  const [trxID, setTrxID] = useState('');
  
  // Steps: Input -> Confirm -> Method -> Gateway (Select Account -> OTP -> PIN) -> Success
  const [step, setStep] = useState<'input' | 'confirm' | 'method' | 'gateway_account_select' | 'gateway_number' | 'gateway_otp' | 'gateway_pin' | 'success'>('input');
  
  const [provider, setProvider] = useState("");
  const [activeProviderHelpline, setActiveProviderHelpline] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  
  // Gateway State
  const [gatewayNumber, setGatewayNumber] = useState("");
  const [gatewayOtp, setGatewayOtp] = useState("");
  const [gatewayPin, setGatewayPin] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showPdfFeedback, setShowPdfFeedback] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Data for Tickets
  const trainList = [
    { name: "Bangladesh Railway (E-Ticket)", url: "https://eticket.railway.gov.bd/", description: "Official Railway Site" },
    { name: "Sonar Bangla Express", url: "https://eticket.railway.gov.bd/", description: "Dhaka-Chittagong" },
    { name: "Subarna Express", url: "https://eticket.railway.gov.bd/", description: "Dhaka-Chittagong" },
    { name: "Parabat Express", url: "https://eticket.railway.gov.bd/", description: "Dhaka-Sylhet" },
    { name: "Sundarban Express", url: "https://eticket.railway.gov.bd/", description: "Dhaka-Khulna" },
    { name: "Silkcity Express", url: "https://eticket.railway.gov.bd/", description: "Dhaka-Rajshahi" }
  ];

  const busList = [
    { name: "Shohoz (Aggregator)", url: "https://www.shohoz.com/bus-tickets", description: "Hanif, Nabil, etc." },
    { name: "BusBD", url: "https://busbd.com.bd/", description: "Ticket Aggregator" },
    { name: "Jatri", url: "https://ticket.jatri.co/", description: "Ticket Aggregator" },
    { name: "Green Line", url: "https://greenlinebd.com/", description: "Official Site" },
    { name: "Ena Transport", url: "https://enatransport.net/", description: "Official Site" },
    { name: "Shyamoli Paribahan", url: "https://shyamoliparibahan.com/", description: "Official Site" },
    { name: "Desh Travels", url: "https://deshtravelsbd.com/", description: "Official Site" },
    { name: "Saintmartin Paribahan", url: "https://saintmartinparibahan.com.bd/", description: "Official Site" },
    { name: "S.R Travels", url: "https://srtravelsbd.com/", description: "Official Site" }
  ];

  const mapServiceKey = (key: string) => {
      if (key === t.mobileRecharge) return "Mobile Recharge";
      if (key === t.elecBill) return "Electricity";
      if (key === t.gasBill) return "Gas";
      if (key === t.waterBill) return "Water";
      if (key === t.internetBill) return "Internet";
      if (key === t.tvBill) return "TV";
      if (key === t.cityServices) return "City Services";
      return "Electricity";
  };

  const getPlaceholder = (serviceKey: string) => {
      switch(serviceKey) {
          case "Mobile Recharge": return "01XXXXXXXXX";
          case "Electricity": return "Meter No (e.g., 1234567)";
          case "Gas": return "Customer Code";
          case "Water": return "WASA Account No";
          case "Internet": return "Client ID / User ID";
          case "TV": return "Subscriber ID";
          default: return "Account Number";
      }
  };

  const getWalletColor = (provider: string) => {
      switch(provider) {
          case 'bKash': return 'bg-[#e2136e]';
          case 'Nagad': return 'bg-[#f6921e]';
          case 'Rocket': return 'bg-[#8c3494]';
          case 'Upay': return 'bg-[#0081c7]';
          default: return 'bg-gray-500';
      }
  };

  const getGatewayTheme = (method: string) => {
       switch(method) {
          case 'bKash': return 'bg-[#e2136e]';
          case 'Nagad': return 'bg-[#f6921e]';
          case 'Rocket': return 'bg-[#8c3494]';
          case 'Upay': return 'bg-[#0081c7]';
          default: return 'bg-gray-700';
      }
  };

  // --- Payment Functions ---
  const openPaymentModal = (serviceName: string, isTicket: boolean = false, providers: any[] = []) => {
      if (!selectedDistrict || !selectedUpazila) {
          showToast(t.locationRequired, 'warning');
          return;
      }
      setActiveService(serviceName);
      setIsTicketService(isTicket);
      setTicketStep('list');
      setTrxID('');
      
      // Override providers if it's Ticket
      if (serviceName === t.trainTicket) {
          setTicketProviders(trainList);
      } else if (serviceName === t.busTicket) {
          setTicketProviders(busList);
      } else {
          setTicketProviders(providers);
      }

      setStep('input');
      setProvider("");
      setActiveProviderHelpline("");
      setAccountNumber("");
      setAmount("");
      setError(null);
      setGatewayNumber("");
      setGatewayOtp("");
      setGatewayPin("");
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedName = e.target.value;
      setProvider(selectedName);
      const serviceKey = activeService ? mapServiceKey(activeService) : "";
      const providers = serviceProviders[serviceKey] || [];
      const found = providers.find(p => p.name === selectedName);
      setActiveProviderHelpline(found ? found.helpline : "");
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleDownloadReceipt = () => {
      setIsDownloading(true);
      setTimeout(() => {
          setIsDownloading(false);
          setShowPdfFeedback(true);
          setTimeout(() => setShowPdfFeedback(false), 3000);
      }, 2000);
  };

  const validateInput = () => {
      if (!provider || !accountNumber) {
          setError(t.errorGeneric);
          return false;
      }
      if (mapServiceKey(activeService!) === "Mobile Recharge" && accountNumber.length !== 11) {
          setError(t.errorMobile);
          return false;
      }
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          setError(t.errorAmount);
          return false;
      }
      setError(null);
      return true;
  };

  const handleReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateInput()) {
          setStep('confirm');
      }
  };

  // Gateway Simulation Logic
  const startGateway = (method: string) => {
      setSelectedMethod(method);
      // Check for saved accounts
      const savedAccounts = accounts.filter(a => a.provider === method);
      if (savedAccounts.length > 0) {
          setStep('gateway_account_select');
      } else {
          setGatewayNumber("");
          setStep('gateway_number');
      }
  };

  const selectSavedAccount = (number: string) => {
      setGatewayNumber(number);
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setStep('gateway_otp');
      }, 1000);
  };

  const useAnotherAccount = () => {
      setGatewayNumber("");
      setStep('gateway_number');
  };

  const submitGatewayNumber = () => {
      if(gatewayNumber.length !== 11) {
          showToast("Invalid mobile number", 'error');
          return;
      }
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setStep('gateway_otp');
      }, 1500);
  };

  const submitGatewayOtp = () => {
      if(gatewayOtp.length !== 4) return;
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setStep('gateway_pin');
      }, 1500);
  };

  const submitGatewayPin = () => {
      if(gatewayPin.length < 4) return;
      
      // Network Check Simulation
      if (!navigator.onLine) {
          showToast(language === 'bn' ? "নেটওয়ার্ক কানেকশন এরর" : "Network connection error", 'error');
          return;
      }

      setIsProcessing(true);
      
      // Simulate API call with potential random error
      setTimeout(() => {
          setIsProcessing(false);
          
          // 10% Chance of failure simulation
          if (Math.random() < 0.1) {
              showToast(language === 'bn' ? "পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Payment failed. Please try again.", 'error');
              return;
          }

          const newTxn: Transaction = {
              id: 'TXN' + Math.floor(Math.random() * 1000000),
              service: activeService || '',
              provider: provider,
              amount: amount,
              date: new Date().toLocaleString(),
              method: selectedMethod,
              recipient: accountNumber,
              status: 'Success'
          };
          addTransaction(newTxn);
          setStep('success');
      }, 2000);
  };

  // Ticket Manual Payment Simulation
  const handleTicketPayment = () => {
      if (!trxID) return;
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setTicketStep('success');
      }, 2000);
  };

  const closeReader = () => {
      setActiveService(null);
      setStep('input');
      setIsProcessing(false);
      setIsTicketService(false);
      setTicketStep('list');
  };

  const currentServiceKey = activeService ? mapServiceKey(activeService) : "";
  const currentProviders = activeService ? serviceProviders[currentServiceKey] : [];

  return (
    <div className="animate-fade-in space-y-6 pb-20 relative">
      {/* Feedbacks */}
      {showCopyFeedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-[60] animate-fade-in">
              {t.copied}
          </div>
      )}
      {showPdfFeedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm z-[60] animate-fade-in flex items-center gap-2 shadow-lg">
              <CheckCircle size={16} /> {t.pdfSaved}
          </div>
      )}

      <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard size={28} />
                {t.payTitle}
            </h2>
            <p className="opacity-90 text-sm mt-1">{t.paySubtitle}</p>
          </div>
          <Wallet className="absolute right-[-20px] bottom-[-20px] text-emerald-500 opacity-50" size={140} />
      </div>

      {/* Location Selector */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
              <MapPin size={20} />
              <h3>{t.selectDistrict}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                  <select 
                      value={selectedDistrict} 
                      onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setSelectedUpazila("");
                      }}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                      <option value="">{t.selectDistrict}</option>
                      {Object.keys(districts).sort().map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                      ))}
                  </select>
              </div>

              <div className="relative">
                  <select 
                      value={selectedUpazila} 
                      onChange={(e) => setSelectedUpazila(e.target.value)}
                      disabled={!selectedDistrict}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:bg-gray-100 text-sm"
                  >
                      <option value="">{t.selectUpazila}</option>
                      {selectedDistrict && districts[selectedDistrict]?.map((upazila) => (
                          <option key={upazila} value={upazila}>{upazila}</option>
                      ))}
                  </select>
              </div>
          </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { title: t.mobileRecharge, icon: Smartphone, color: "text-emerald-600", bg: "bg-emerald-100" },
              { title: t.elecBill, icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
              { title: t.gasBill, icon: Flame, color: "text-orange-600", bg: "bg-orange-100" },
              { title: t.waterBill, icon: Droplets, color: "text-blue-600", bg: "bg-blue-100" },
              { title: t.internetBill, icon: Wifi, color: "text-purple-600", bg: "bg-purple-100" },
              { title: t.tvBill, icon: Tv, color: "text-pink-600", bg: "bg-pink-100" },
              { title: t.cityServices, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-100" },
              { 
                  title: t.trainTicket, 
                  icon: TrainFront, 
                  color: "text-red-700", 
                  bg: "bg-red-100", 
                  isTicket: true 
              },
              { 
                  title: t.busTicket, 
                  icon: BusFront, 
                  color: "text-green-700", 
                  bg: "bg-green-100", 
                  isTicket: true
              },
          ].map((item, idx) => (
            <button key={idx} onClick={() => openPaymentModal(item.title, item.isTicket)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-95">
                <div className={`${item.bg} p-3 rounded-full ${item.color}`}>
                    <item.icon size={24} />
                </div>
                <span className="font-bold text-gray-700 text-xs text-center">{item.title}</span>
            </button>
          ))}
      </div>

       {/* Detailed Transactions */}
       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-6">
           <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
               <History size={18} />
               {t.recentTrans}
           </h3>
           <div className="space-y-4">
               {transactions.map((txn, i) => (
                   <div 
                        key={i} 
                        onClick={() => setSelectedTransaction(txn)}
                        className="flex flex-col gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0 active:bg-gray-50 rounded p-1 cursor-pointer transition-colors hover:bg-gray-50"
                   >
                       <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getWalletColor(txn.method)}`}>
                                   {txn.method[0]}
                               </div>
                               <div>
                                   <p className="text-sm font-bold text-gray-800">{txn.provider}</p>
                                   <p className="text-xs text-gray-500">{txn.service}</p>
                               </div>
                           </div>
                           <span className="font-bold text-emerald-600 text-sm">৳{txn.amount}</span>
                       </div>
                       
                       <div className="flex justify-between text-[10px] text-gray-400 pl-11">
                           <span>{txn.date}</span>
                           <span className="flex items-center gap-1">
                               {t.status}: <span className="text-green-600 font-bold">{txn.status}</span>
                           </span>
                       </div>
                   </div>
               ))}
           </div>
       </div>

      {/* --- TRANSACTION DETAILS MODAL --- */}
      {selectedTransaction && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl relative shadow-2xl overflow-hidden">
                  <div className="bg-[#0A2540] p-4 text-center relative">
                      <button onClick={() => setSelectedTransaction(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={24}/></button>
                      <div className="text-xs text-white/70 uppercase tracking-widest mb-1">{t.transactionDetails}</div>
                      <h1 className="text-3xl font-bold text-white">৳{selectedTransaction.amount}</h1>
                  </div>
                  
                  {/* Dashed Separator */}
                  <div className="relative h-4 bg-white">
                      <div className="absolute top-[-10px] left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDAgQTEwIDEwIDAgMCAwIDIwIDEwIEwxMCAxMCBMMCAxMCBBMTAgMTAgMCAwIDAgMTAgMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat-x bg-[length:20px_10px] transform rotate-180"></div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                      <div className="text-center mb-6">
                           <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                               <CheckCircle size={12} /> {selectedTransaction.status}
                           </div>
                           <div className="text-gray-500 text-xs mt-2">{selectedTransaction.date}</div>
                      </div>

                      <div className="space-y-4 text-sm">
                          <div className="flex justify-between border-b border-dashed border-gray-200 pb-3">
                              <span className="text-gray-500">{t.recipient}</span>
                              <span className="font-bold text-gray-800 text-right break-all max-w-[60%]">{selectedTransaction.recipient}</span>
                          </div>
                          <div className="flex justify-between border-b border-dashed border-gray-200 pb-3">
                              <span className="text-gray-500">{t.provider}</span>
                              <span className="font-bold text-gray-800">{selectedTransaction.provider}</span>
                          </div>
                          <div className="flex justify-between border-b border-dashed border-gray-200 pb-3">
                              <span className="text-gray-500">{t.transactionId}</span>
                              <span className="font-mono text-gray-800 text-xs bg-gray-50 px-2 py-0.5 rounded">{selectedTransaction.id}</span>
                          </div>
                           <div className="flex justify-between">
                              <span className="text-gray-500">{t.paidVia}</span>
                              <span className="font-bold text-gray-800 flex items-center gap-1">
                                  <span className={`w-2 h-2 rounded-full ${getWalletColor(selectedTransaction.method)}`}></span>
                                  {selectedTransaction.method}
                              </span>
                          </div>
                      </div>

                      <button 
                        onClick={handleDownloadReceipt}
                        disabled={isDownloading}
                        className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70"
                      >
                          {isDownloading ? (
                              <>
                                  <Loader2 className="animate-spin" size={16} /> {t.downloadingPdf}
                              </>
                          ) : (
                              <>
                                  <Download size={16} /> {t.downloadReceipt}
                              </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {activeService && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                  <button onClick={closeReader} className="absolute top-4 right-4 text-gray-400 z-10"><X size={24} /></button>

                  {/* Special Modal for Tickets */}
                  {isTicketService ? (
                      <div className="text-center py-2">
                           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                               {activeService === t.trainTicket ? <TrainFront size={32} className="text-blue-600"/> : <BusFront size={32} className="text-green-600"/>}
                           </div>
                           <h3 className="text-xl font-bold text-gray-800 mb-2">{activeService}</h3>

                           {ticketStep === 'list' && (
                               <div className="animate-fade-in">
                                   <p className="text-gray-600 text-sm mb-6 px-4">
                                       {language === 'bn' 
                                        ? "টিকেট কাটতে নিচের যেকোনো একটি ওয়েবসাইট ভিজিট করুন।"
                                        : "Visit any of the websites below to book tickets."}
                                   </p>

                                   {activeService === t.trainTicket && (
                                       <div className="mb-4 px-4 bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-xs text-yellow-800 text-left">
                                           <strong>Note:</strong> Bangladesh Railway Official Site: <a href="https://eticket.railway.gov.bd/" className="underline font-bold">eticket.railway.gov.bd</a>
                                       </div>
                                   )}
                                   
                                   <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar px-1">
                                       {ticketProviders.map((prov, idx) => (
                                           <a 
                                             key={idx}
                                             href={prov.url} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="w-full bg-white border border-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm flex flex-col items-start px-4 hover:bg-gray-50 hover:border-emerald-500 transition-all shadow-sm group"
                                           >
                                               <div className="flex justify-between w-full items-center">
                                                   <span className="group-hover:text-emerald-600 transition-colors">{prov.name}</span>
                                                   <ExternalLink size={14} className="text-gray-400 group-hover:text-emerald-500" />
                                               </div>
                                               {prov.description && <span className="text-[10px] text-gray-500 font-normal">{prov.description}</span>}
                                           </a>
                                       ))}
                                   </div>

                                   {/* Manual Payment Option */}
                                   <button 
                                       onClick={() => setTicketStep('payment')}
                                       className="w-full bg-[#e2136e] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#c20d5e] transition-colors"
                                   >
                                       <Ticket size={18} /> {t.payReservedTicket}
                                   </button>
                                   
                                   <button onClick={closeReader} className="mt-4 text-gray-500 text-xs underline">{t.cancel}</button>
                               </div>
                           )}

                           {ticketStep === 'payment' && (
                               <div className="animate-fade-in text-left">
                                   <button onClick={() => setTicketStep('list')} className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 font-bold">
                                       <ArrowLeft size={14}/> {t.back}
                                   </button>
                                   
                                   <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">{t.ticketPaymentTitle}</h4>
                                   
                                   {/* Warning Box */}
                                   <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
                                       <p className="text-sm text-orange-800 leading-relaxed font-medium">
                                           {t.ticketPaymentDesc}
                                       </p>
                                   </div>

                                   {/* bKash Payment Section */}
                                   <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
                                       <div className="flex items-center gap-3 mb-4">
                                           <div className="w-10 h-10 bg-[#e2136e] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                               bKash
                                           </div>
                                           <div>
                                               <p className="font-bold text-gray-700 text-sm">Merchant Payment</p>
                                               <div className="flex items-center gap-2">
                                                   <span className="font-mono text-sm">017xxxxxxxx</span>
                                                   <button onClick={() => copyToClipboard('017xxxxxxxx')} className="text-gray-400 hover:text-gray-600"><Copy size={12}/></button>
                                               </div>
                                           </div>
                                       </div>
                                       
                                       <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.enterTrxID}</label>
                                       <input 
                                           type="text" 
                                           value={trxID}
                                           onChange={(e) => setTrxID(e.target.value)}
                                           placeholder="e.g. 9G7SH2..."
                                           className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono uppercase focus:ring-2 focus:ring-[#e2136e] focus:border-transparent outline-none"
                                       />
                                   </div>

                                   <button 
                                       onClick={handleTicketPayment}
                                       disabled={isProcessing || !trxID}
                                       className="w-full bg-[#0A2540] text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                   >
                                       {isProcessing ? <Loader2 className="animate-spin" size={16}/> : t.proceedToPay}
                                   </button>
                               </div>
                           )}

                           {ticketStep === 'success' && (
                               <div className="animate-scale-in text-left">
                                   <div className="text-center mb-6">
                                       <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
                                       <h3 className="text-xl font-bold text-gray-800">{t.paymentSuccess}</h3>
                                   </div>
                                   
                                   <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
                                       <h4 className="font-bold text-green-800 mb-4 border-b border-green-200 pb-2">{t.ticketSuccessTitle}</h4>
                                       <ul className="space-y-4">
                                           <li className="flex gap-3 text-sm text-gray-700">
                                               <FileText size={18} className="text-green-600 shrink-0" />
                                               <span>{t.ticketSuccessList1}</span>
                                           </li>
                                           <li className="flex gap-3 text-sm text-gray-700">
                                               <Mail size={18} className="text-green-600 shrink-0" />
                                               <span>{t.ticketSuccessList2}</span>
                                           </li>
                                           <li className="flex gap-3 text-sm text-gray-700">
                                               <MessageSquareText size={18} className="text-green-600 shrink-0" />
                                               <span>{t.ticketSuccessList3}</span>
                                           </li>
                                       </ul>
                                   </div>

                                   <button onClick={closeReader} className="w-full bg-[#0A2540] text-white py-3 rounded-xl font-bold text-sm">
                                       {t.home}
                                   </button>
                               </div>
                           )}
                      </div>
                  ) : (
                      <>
                        {/* Step 1: Input */}
                        {step === 'input' && (
                            <>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{activeService}</h3>
                                <form onSubmit={handleReview} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.provider}</label>
                                        <select 
                                            required value={provider} onChange={handleProviderChange}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white"
                                        >
                                            <option value="">{t.selectProvider}</option>
                                            {currentProviders?.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                        {activeProviderHelpline && (
                                            <div className="flex items-center justify-between mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-200 p-1 rounded-full text-blue-700">
                                                        <Phone size={12} />
                                                    </div>
                                                    <span className="text-xs text-blue-800 font-semibold">{t.helpline}: {activeProviderHelpline}</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(activeProviderHelpline)}
                                                    className="text-blue-600 p-1 hover:bg-blue-100 rounded"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            {currentServiceKey === "Mobile Recharge" ? t.enterMobile : "Account Number"}
                                        </label>
                                        <div className="relative">
                                            <input 
                                                required type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                                                placeholder={getPlaceholder(currentServiceKey)}
                                                className="w-full p-3 rounded-xl border border-gray-200 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.enterAmount}</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                            <input 
                                                required type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    {error && <div className="text-red-600 text-xs bg-red-50 p-2 rounded flex gap-1"><AlertCircle size={14}/> {error}</div>}
                                    <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm mt-2 flex justify-center items-center gap-2">
                                        {t.payNow} <ChevronRight size={16} />
                                    </button>
                                </form>
                            </>
                        )}
                        
                        {/* Step 2: Confirm Details */}
                        {step === 'confirm' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{t.confirmTitle}</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                                    <div className="flex justify-between text-sm"><span>{t.provider}</span><span className="font-bold">{provider}</span></div>
                                    <div className="flex justify-between text-sm"><span>ID/No</span><span className="font-bold">{accountNumber}</span></div>
                                    <div className="border-t border-gray-200 my-2"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold">{t.total}</span>
                                        <span className="text-lg font-bold text-emerald-700">৳{amount}</span>
                                    </div>
                                </div>
                                <button onClick={() => setStep('method')} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-md flex justify-center items-center gap-2">
                                        {t.selectPaymentMethod} <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Step 3: Select Payment Method */}
                        {step === 'method' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{t.payWith}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {['bKash', 'Nagad', 'Rocket', 'Upay'].map(p => (
                                        <button 
                                            key={p}
                                            onClick={() => startGateway(p)}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all bg-white shadow-sm"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getWalletColor(p)}`}>
                                                {p[0]}
                                            </div>
                                            <span className="font-bold text-gray-700">{p}</span>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setStep('confirm')} className="mt-6 text-gray-500 text-xs w-full">{t.back}</button>
                            </div>
                        )}

                        {/* --- GATEWAY SIMULATION STEPS --- */}

                        {/* Gateway 0: Account Selection (New) */}
                        {step === 'gateway_account_select' && (
                            <div className="animate-fade-in">
                                <div className={`${getGatewayTheme(selectedMethod)} p-4 -mx-6 -mt-6 mb-6 text-white`}>
                                    <h3 className="font-bold text-lg">{selectedMethod} {t.gatewayTitle}</h3>
                                    <p className="text-xs opacity-80">{t.total}: ৳{amount}</p>
                                </div>
                                <h3 className="text-sm font-bold text-gray-700 mb-3">{t.selectProvider}</h3>
                                <div className="space-y-3 mb-4">
                                    {accounts.filter(a => a.provider === selectedMethod).map(acc => (
                                        <button 
                                            key={acc.id}
                                            onClick={() => selectSavedAccount(acc.number)}
                                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between hover:bg-gray-100"
                                        >
                                            <span className="font-bold text-gray-800">{acc.number}</span>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={useAnotherAccount}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                >
                                    Use another account
                                </button>
                                <button onClick={() => setStep('method')} className="mt-4 text-gray-500 text-xs w-full">{t.cancel}</button>
                            </div>
                        )}

                        {/* Gateway 1: Enter Number */}
                        {step === 'gateway_number' && (
                            <div className="animate-fade-in text-center">
                                <div className={`${getGatewayTheme(selectedMethod)} p-4 -mx-6 -mt-6 mb-6 text-white`}>
                                    <h3 className="font-bold text-lg">{selectedMethod} {t.gatewayTitle}</h3>
                                    <p className="text-xs opacity-80">{t.total}: ৳{amount}</p>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4">{t.enterWalletNumber}</p>
                                <input 
                                    type="number" 
                                    value={gatewayNumber}
                                    onChange={(e) => setGatewayNumber(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full p-3 rounded-xl border border-gray-300 text-center text-lg mb-6"
                                />
                                <p className="text-xs text-gray-400 mb-4">{t.agreeTerms}</p>
                                
                                <button 
                                    onClick={submitGatewayNumber}
                                    disabled={isProcessing}
                                    className={`w-full text-white py-3 rounded-xl font-bold text-sm ${getGatewayTheme(selectedMethod)}`}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : t.confirmBtn}
                                </button>
                                <button onClick={() => setStep('method')} className="mt-4 text-gray-500 text-xs w-full">{t.cancel}</button>
                            </div>
                        )}

                        {/* Gateway 2: Enter OTP */}
                        {step === 'gateway_otp' && (
                            <div className="animate-fade-in text-center">
                                <div className={`${getGatewayTheme(selectedMethod)} p-4 -mx-6 -mt-6 mb-6 text-white`}>
                                    <h3 className="font-bold text-lg">{selectedMethod} Verification</h3>
                                </div>
                                
                                <MessageSquare size={32} className="mx-auto text-gray-400 mb-2"/>
                                <p className="text-sm text-gray-600 mb-4">{t.enterGatewayOtp}</p>
                                
                                <input 
                                    type="number" 
                                    value={gatewayOtp}
                                    onChange={(e) => setGatewayOtp(e.target.value)}
                                    placeholder="1 2 3 4"
                                    maxLength={4}
                                    className="w-full p-3 rounded-xl border border-gray-300 text-center text-2xl tracking-[0.5em] mb-6 font-mono"
                                />
                                
                                <button 
                                    onClick={submitGatewayOtp}
                                    disabled={isProcessing || gatewayOtp.length !== 4}
                                    className={`w-full text-white py-3 rounded-xl font-bold text-sm ${getGatewayTheme(selectedMethod)}`}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : t.confirmBtn}
                                </button>
                                <button className="mt-4 text-gray-500 text-xs w-full">{t.resendOtp}</button>
                            </div>
                        )}

                        {/* Gateway 3: Enter PIN */}
                        {step === 'gateway_pin' && (
                            <div className="animate-fade-in text-center">
                                <div className={`${getGatewayTheme(selectedMethod)} p-4 -mx-6 -mt-6 mb-6 text-white`}>
                                    <h3 className="font-bold text-lg">{selectedMethod} Security</h3>
                                </div>
                                
                                <Lock size={32} className="mx-auto text-gray-400 mb-2"/>
                                <p className="text-sm text-gray-600 mb-4">{t.enterGatewayPin}</p>
                                
                                <input 
                                    type="password" 
                                    value={gatewayPin}
                                    onChange={(e) => setGatewayPin(e.target.value)}
                                    placeholder="•••••"
                                    maxLength={5}
                                    className="w-full p-3 rounded-xl border border-gray-300 text-center text-2xl tracking-widest mb-6"
                                />
                                
                                <button 
                                    onClick={submitGatewayPin}
                                    disabled={isProcessing || gatewayPin.length < 4}
                                    className={`w-full text-white py-3 rounded-xl font-bold text-sm ${getGatewayTheme(selectedMethod)}`}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : t.confirmPayment}
                                </button>
                            </div>
                        )}

                        {/* Step 5: Success */}
                        {step === 'success' && (
                            <div className="text-center py-6 animate-scale-in">
                                <CheckCircle size={56} className="text-green-500 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.paymentSuccess}</h3>
                                <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{t.transactionId}</span>
                                        <span className="font-mono font-bold">{transactions[0]?.id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{t.total}</span>
                                        <span className="font-bold text-emerald-600">৳{amount}</span>
                                    </div>
                                </div>
                                <button onClick={closeReader} className="w-full bg-[#0A2540] text-white py-3 rounded-xl font-bold text-sm">{t.home}</button>
                            </div>
                        )}
                      </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Payment;