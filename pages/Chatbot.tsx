import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Search, MessageCircle, FileText, ChevronDown, ChevronUp, Mic, MicOff, Trash2, Zap, ArrowRight, MapPin, Globe, Brain, Volume2, VolumeX } from 'lucide-react';
import { generateAIResponse, generateSpeech, AIMode } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

const Chatbot: React.FC = () => {
  const { t, language } = useLanguage();
  const { data } = useData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'ai' | 'faq'>('ai');
  
  // AI State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  
  // New AI Modes
  const [aiMode, setAiMode] = useState<AIMode>('chat');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initial Greeting if empty
    if (messages.length === 0) {
        setMessages([
            { 
                id: '1', 
                role: 'model', 
                text: t.aiIntro 
            }
        ]);
    }

    // Get Location for Maps Grounding
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, (err) => {
            console.log("Location not available for AI grounding", err);
        });
    }
  }, [language, t.aiIntro]);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FAQ State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Expanded Categories derived from data
  const categories = ['All', ...Array.from(new Set(data[language].faqs.map(f => f.category)))];

  const suggestions = language === 'bn' 
    ? ["জ্বর হলে কি করব?", "কাছের হাসপাতাল কোথায়?", "থানায় জিডি করার নিয়ম", "জরুরি নাম্বার"]
    : ["What to do for fever?", "Nearest hospital?", "How to file GD?", "Emergency numbers"];

  // AI Logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'ai') scrollToBottom();
  }, [messages, activeTab, loading]);

  // Stop Audio on Unmount
  useEffect(() => {
      return () => {
          if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
          }
      };
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Check Network immediately
    if (!navigator.onLine) {
        showToast(language === 'bn' ? "ইন্টারনেট সংযোগ নেই" : "No internet connection", 'error');
        return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Use selected AI Mode
      const response = await generateAIResponse(userMsg.text, language, { mode: aiMode, location: userLocation });
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingMetadata: response.groundingMetadata
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
       const errorText = error.message || t.aiError;
       const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorText,
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      showToast(language === 'bn' ? "মেসেজ পাঠানো যায়নি" : "Failed to send message", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showToast(language === 'bn' ? "ভয়েস ইনপুট সমর্থিত নয়" : "Voice input not supported", 'warning');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      showToast(language === 'bn' ? "কথা বুঝতে পারিনি" : "Could not recognize voice", 'error');
    };

    recognition.start();
  };

  const handlePlayAudio = async (msg: ChatMessage) => {
      if (playingMessageId === msg.id) {
          // Stop logic
          if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
          }
          setPlayingMessageId(null);
          return;
      }

      // If we already have audio data, play it
      if (msg.audioData) {
          playBase64Audio(msg.audioData, msg.id);
          return;
      }

      // Otherwise generate it
      try {
          // Show loading for this message specific audio?
          // For now, assume fast generation.
          const base64 = await generateSpeech(msg.text, language);
          
          // Save to message state to avoid re-fetching
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, audioData: base64 } : m));
          
          playBase64Audio(base64, msg.id);
      } catch (e) {
          showToast(language === 'bn' ? "অডিও জেনারেট ব্যর্থ" : "Audio generation failed", 'error');
      }
  };

  const playBase64Audio = (base64: string, msgId: string) => {
      // Stop previous
      if (audioRef.current) {
          audioRef.current.pause();
      }

      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audioRef.current = audio;
      
      audio.onended = () => setPlayingMessageId(null);
      audio.onplay = () => setPlayingMessageId(msgId);
      audio.onerror = () => {
          setPlayingMessageId(null);
          showToast("Audio error", 'error');
      };

      audio.play().catch(e => {
          console.error("Play error", e);
          setPlayingMessageId(null);
      });
  };

  const clearChat = () => {
      if (confirm(language === 'bn' ? 'চ্যাট মুছে ফেলবেন?' : 'Clear chat history?')) {
          setMessages([{ id: '1', role: 'model', text: t.aiIntro }]);
      }
  };

  const filteredFaqs = data[language].faqs.filter(f => {
    const matchesSearch = f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to render text with bold formatting
  const renderMessageText = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
          }
          return part;
      });
  };

  // Render Grounding Sources (Maps & Search)
  const renderGroundingSources = (metadata: any) => {
      if (!metadata || !metadata.groundingChunks) return null;

      const sources = metadata.groundingChunks.filter((chunk: any) => chunk.web?.uri || chunk.maps?.source?.uri);

      if (sources.length === 0) return null;

      return (
          <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                  <Globe size={10} /> {language === 'bn' ? 'সূত্র ও ম্যাপ:' : 'Sources & Maps:'}
              </p>
              <div className="flex flex-wrap gap-2">
                  {sources.map((chunk: any, i: number) => {
                      // Handle Maps
                      if (chunk.maps?.source?.uri) {
                          return (
                              <a 
                                  key={i} 
                                  href={chunk.maps.source.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 max-w-full truncate"
                              >
                                  <MapPin size={12} />
                                  <span className="truncate max-w-[150px]">{chunk.maps.source.title || 'Google Maps'}</span>
                              </a>
                          );
                      }
                      // Handle Web
                      if (chunk.web?.uri) {
                          return (
                              <a 
                                  key={i} 
                                  href={chunk.web.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 max-w-full truncate"
                              >
                                  <Globe size={12} />
                                  <span className="truncate max-w-[150px]">{chunk.web.title || 'Source'}</span>
                              </a>
                          );
                      }
                      return null;
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      
      {/* Top Toggle */}
      <div className="z-10 px-4 pt-2">
          <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-full shadow-sm border border-gray-100">
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-2 text-xs font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'ai' ? 'bg-[#0A2540] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Sparkles size={14} className={activeTab === 'ai' ? 'text-[#2ECC71]' : ''} />
                {t.aiAssistant}
            </button>
            <button 
                onClick={() => setActiveTab('faq')}
                className={`flex-1 py-2 text-xs font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'faq' ? 'bg-[#0A2540] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <FileText size={14} />
                {t.faq}
            </button>
          </div>
      </div>

      {/* --- AI Chat Section --- */}
      {activeTab === 'ai' && (
          <>
            {/* Mode Selector */}
            <div className="px-4 mt-3 z-10">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {[
                        { id: 'chat', icon: Sparkles, label: language === 'bn' ? 'সাধারণ' : 'Smart' },
                        { id: 'think', icon: Brain, label: language === 'bn' ? 'গভীর চিন্তা' : 'Deep Think' },
                        { id: 'search', icon: Globe, label: language === 'bn' ? 'ইন্টারনেট' : 'Web' },
                        { id: 'maps', icon: MapPin, label: language === 'bn' ? 'ম্যাপ' : 'Maps' },
                        { id: 'fast', icon: Zap, label: language === 'bn' ? 'দ্রুত' : 'Fast' },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setAiMode(mode.id as AIMode)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                                aiMode === mode.id 
                                ? 'bg-[#0A2540] text-white border-[#0A2540]' 
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <mode.icon size={12} className={aiMode === mode.id ? 'text-[#2ECC71]' : ''} />
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 p-4 pb-24 z-0">
                {/* Clear Chat Button */}
                {messages.length > 2 && (
                    <div className="flex justify-center">
                        <button onClick={clearChat} className="text-[10px] text-gray-400 flex items-center gap-1 hover:text-red-500 transition-colors bg-white/50 px-3 py-1 rounded-full">
                            <Trash2 size={10} /> Clear Chat
                        </button>
                    </div>
                )}

                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-scale-in`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white ${msg.role === 'model' ? 'bg-gradient-to-br from-[#0A2540] to-slate-800 text-[#2ECC71]' : 'bg-gray-200 text-gray-600'}`}>
                        {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                    
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm relative group ${
                        msg.role === 'user' 
                        ? 'bg-[#0A2540] text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}`}>
                        {renderMessageText(msg.text)}
                        {msg.role === 'model' && msg.groundingMetadata && renderGroundingSources(msg.groundingMetadata)}
                        
                        {/* Audio Button for Bot Messages */}
                        {msg.role === 'model' && !msg.isError && (
                            <button 
                                onClick={() => handlePlayAudio(msg)}
                                className={`absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${playingMessageId === msg.id ? 'bg-[#2ECC71] text-white shadow-md' : 'text-gray-300 hover:text-gray-500'}`}
                                title="Read Aloud"
                            >
                                {playingMessageId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                        )}
                    </div>
                </div>
                ))}
                
                {/* Loading State with Animation */}
                {loading && (
                    <div className="flex items-end gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0A2540] text-[#2ECC71] flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                            <div className="flex gap-2 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                {aiMode === 'think' && (
                                    <span className="text-[10px] text-gray-400 font-medium ml-1 animate-pulse">Thinking...</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Glassmorphism) */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                {/* Suggestions */}
                {!loading && messages.length < 3 && (
                    <div className="mb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <div className="flex gap-2">
                            {suggestions.map((s, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => sendMessage(s)}
                                    className="bg-white/90 backdrop-blur text-[#0A2540] px-4 py-2 rounded-full text-xs font-bold border border-gray-200 shadow-sm flex items-center gap-1.5 hover:bg-[#0A2540] hover:text-white transition-all active:scale-95"
                                >
                                    <Zap size={12} className="text-[#2ECC71]" />
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={`bg-white/90 backdrop-blur-xl p-2 rounded-[2rem] border border-gray-200 shadow-2xl flex items-center gap-2 transition-all ${isListening ? 'ring-2 ring-red-400' : ''}`}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder={isListening ? (language === 'bn' ? "কথা বলুন..." : "Listening...") : t.typeQuestion}
                        className="flex-1 pl-5 py-3 bg-transparent focus:outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
                    />
                    
                    {/* Voice Button with Pulsing Effect */}
                    <button 
                        onClick={handleVoiceInput}
                        className={`p-3 rounded-full transition-all relative overflow-hidden group ${isListening ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        {isListening && <span className="absolute inset-0 bg-red-400 opacity-20 animate-ping rounded-full"></span>}
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <button 
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        className="bg-[#0A2540] disabled:bg-gray-300 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </div>
          </>
      )}

      {/* --- FAQ Section --- */}
      {activeTab === 'faq' && (
          <div className="flex-1 overflow-y-auto p-4 z-0">
              {/* FAQ Search */}
              <div className="relative mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center">
                      <Search className="ml-4 text-gray-400" size={18} />
                      <input 
                          type="text" 
                          placeholder={t.searchFaq} 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-3 pr-4 py-3.5 bg-transparent focus:outline-none text-sm font-medium"
                      />
                  </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
                  {categories.map((cat) => (
                      <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setOpenFaqIndex(null); }}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                              selectedCategory === cat 
                              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                          {cat === 'All' ? (language === 'bn' ? 'সব' : 'All') : cat}
                      </button>
                  ))}
              </div>

              {/* Accordion List */}
              <div className="space-y-3 pb-6">
                  {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, idx) => (
                          <div 
                            key={idx} 
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openFaqIndex === idx ? 'border-indigo-100 shadow-md ring-1 ring-indigo-50' : 'border-gray-100 shadow-sm'}`}
                          >
                              <button 
                                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                  className="w-full flex items-start justify-between p-4 text-left transition-colors"
                              >
                                  <div className="flex-1 pr-4">
                                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                                          {faq.category}
                                      </span>
                                      <h4 className={`font-bold text-sm ${openFaqIndex === idx ? 'text-[#0A2540]' : 'text-gray-700'}`}>
                                          {faq.question}
                                      </h4>
                                  </div>
                                  <div className={`p-1 rounded-full transition-transform duration-300 ${openFaqIndex === idx ? 'bg-indigo-100 rotate-180' : 'bg-gray-50'}`}>
                                      <ChevronDown size={16} className={openFaqIndex === idx ? 'text-indigo-600' : 'text-gray-400'} />
                                  </div>
                              </button>
                              
                              <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                                  <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed bg-gradient-to-b from-white to-gray-50/50">
                                      {faq.answer}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 opacity-60">
                          <Search size={48} className="text-gray-300 mb-3" />
                          <p className="text-sm font-bold text-gray-500">No results found</p>
                          <p className="text-xs text-gray-400">Try adjusting your search terms</p>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Chatbot;