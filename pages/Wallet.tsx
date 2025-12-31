import React, { useState } from 'react';
import { Wallet as WalletIcon, Plus, Trash2, CreditCard, ShieldCheck, X, CheckCircle, Loader2, Landmark } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';
import { LinkedAccount } from '../types';

const Wallet: React.FC = () => {
  const { t } = useLanguage();
  const { balance, accounts, addMoney, addAccount, removeAccount } = useWallet();

  // UI State
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [newAccountProvider, setNewAccountProvider] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');

  const getProviderColor = (provider: string) => {
      switch(provider) {
          case 'bKash': return 'bg-[#e2136e]';
          case 'Nagad': return 'bg-[#f6921e]';
          case 'Rocket': return 'bg-[#8c3494]';
          case 'Upay': return 'bg-[#0081c7]';
          case 'Visa': return 'bg-blue-600';
          case 'City Bank': return 'bg-red-700';
          default: return 'bg-gray-600';
      }
  };

  const resetForms = () => {
      setAmount('');
      setSelectedSource('');
      setNewAccountProvider('');
      setNewAccountNumber('');
      setSuccessMsg(null);
      setLoading(false);
  };

  const handleAddMoney = () => {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !selectedSource) return;
      
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
          addMoney(Number(amount));
          setLoading(false);
          setSuccessMsg(t.addMoneySuccess);
          setTimeout(() => {
              setShowAddMoneyModal(false);
              resetForms();
          }, 1500);
      }, 2000);
  };

  const handleAddAccount = () => {
      if (!newAccountProvider || !newAccountNumber) return;

      setLoading(true);
      // Simulate API Call
      setTimeout(() => {
          const newAcc: LinkedAccount = {
              id: Date.now().toString(),
              type: ['Visa', 'Mastercard', 'City Bank'].includes(newAccountProvider) ? 'bank' : 'mfs',
              provider: newAccountProvider,
              number: newAccountNumber
          };
          addAccount(newAcc);
          setLoading(false);
          setSuccessMsg(t.accountAdded);
          setTimeout(() => {
              setShowAddAccountModal(false);
              resetForms();
          }, 1500);
      }, 1500);
  };

  const deleteAccount = (id: string) => {
      if (confirm('Are you sure you want to remove this account?')) {
          removeAccount(id);
      }
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
       {/* Balance Card */}
       <div className="bg-fuchsia-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transition-all hover:scale-[1.01]">
            <div className="relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <WalletIcon size={28} />
                    {t.walletTitle}
                </h2>
                <p className="opacity-90 text-sm mt-1">{t.walletSubtitle}</p>
                <div className="mt-6">
                    <p className="text-sm opacity-80">{t.balance}</p>
                    <h1 className="text-4xl font-bold">৳ {balance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</h1>
                </div>
            </div>
            <div className="absolute right-[-30px] bottom-[-30px] opacity-20">
                <WalletIcon size={160} />
            </div>
       </div>

       {/* Actions */}
       <div className="flex gap-4">
           <button 
                onClick={() => setShowAddMoneyModal(true)}
                className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-fuchsia-50 active:scale-95 transition-all cursor-pointer"
            >
               <div className="bg-fuchsia-100 p-3 rounded-full text-fuchsia-600">
                   <Plus size={24} />
               </div>
               <span className="font-bold text-gray-700 text-sm">{t.addMoney}</span>
           </button>
            <button className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer">
               <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                   <ShieldCheck size={24} />
               </div>
               <span className="font-bold text-gray-700 text-sm">Statements</span>
           </button>
       </div>

       {/* Linked Accounts */}
       <div>
           <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-gray-700">{t.linkedAccounts}</h3>
           </div>
           
           <div className="space-y-3">
               {accounts.map(acc => (
                   <div key={acc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                       <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${getProviderColor(acc.provider)}`}>
                               {acc.provider[0]}
                           </div>
                           <div>
                               <p className="font-bold text-gray-800">{acc.provider}</p>
                               <p className="text-xs text-gray-500">{acc.number}</p>
                           </div>
                       </div>
                       <button onClick={() => deleteAccount(acc.id)} className="text-gray-300 hover:text-red-500 p-2">
                           <Trash2 size={18} />
                       </button>
                   </div>
               ))}
               
               <button 
                onClick={() => setShowAddAccountModal(true)}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all"
               >
                   <Plus size={18} /> {t.addNew}
               </button>
           </div>
       </div>

       {/* --- ADD MONEY MODAL --- */}
       {showAddMoneyModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    <button onClick={() => {setShowAddMoneyModal(false); resetForms();}} className="absolute top-4 right-4 text-gray-400"><X size={24}/></button>
                    
                    {!successMsg ? (
                        <>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t.addMoney}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.enterAmount}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-800"
                                            placeholder="500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.selectSource}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => setSelectedSource('bank')}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedSource === 'bank' ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700' : 'border-gray-200'}`}
                                        >
                                            <Landmark size={20} />
                                            <span className="text-xs font-bold">{t.bankTransfer}</span>
                                        </button>
                                        <button 
                                            onClick={() => setSelectedSource('card')}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedSource === 'card' ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700' : 'border-gray-200'}`}
                                        >
                                            <CreditCard size={20} />
                                            <span className="text-xs font-bold">{t.cardPayment}</span>
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddMoney}
                                    disabled={loading || !amount || !selectedSource}
                                    className="w-full bg-fuchsia-600 text-white py-3 rounded-xl font-bold text-sm mt-2 flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : t.confirmPayment}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">{successMsg}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t.balance}: ৳{balance}</p>
                        </div>
                    )}
                </div>
            </div>
       )}

       {/* --- ADD ACCOUNT MODAL --- */}
       {showAddAccountModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    <button onClick={() => {setShowAddAccountModal(false); resetForms();}} className="absolute top-4 right-4 text-gray-400"><X size={24}/></button>
                    
                    {!successMsg ? (
                        <>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t.addNew}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.selectProvider}</label>
                                    <select 
                                        value={newAccountProvider}
                                        onChange={(e) => setNewAccountProvider(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white"
                                    >
                                        <option value="">Select</option>
                                        <option value="bKash">bKash</option>
                                        <option value="Nagad">Nagad</option>
                                        <option value="Rocket">Rocket</option>
                                        <option value="City Bank">City Bank</option>
                                        <option value="Visa">Visa Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.enterAccount}</label>
                                    <input 
                                        type="text" 
                                        value={newAccountNumber}
                                        onChange={(e) => setNewAccountNumber(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm"
                                        placeholder="Account / Card Number"
                                    />
                                </div>
                                <button 
                                    onClick={handleAddAccount}
                                    disabled={loading || !newAccountProvider || !newAccountNumber}
                                    className="w-full bg-[#0A2540] text-white py-3 rounded-xl font-bold text-sm mt-2 flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : t.save}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">{successMsg}</h3>
                        </div>
                    )}
                </div>
            </div>
       )}
    </div>
  );
};

export default Wallet;