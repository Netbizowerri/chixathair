
import React, { useState, useRef, useEffect } from 'react';
import { getHairAdvice } from '../services/geminiService';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: "Welcome to Chixat Hair. I am your personal stylist, here to help you select the perfect piece from Edna's collection. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const advice = await getHairAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', content: advice || "I am currently adjusting my mirror. Please ask me again!" }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 h-[85vh] flex flex-col animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand/5 border border-brand/20 px-6 py-2 rounded-full text-brand text-[10px] font-black uppercase tracking-widest mb-6">
          <Sparkles className="w-3 h-3" /> Chixat Intelligence Suite
        </div>
        <h1 className="text-4xl font-bold italic">House Stylist</h1>
        <p className="text-gray-500 mt-2 font-medium">Expert advice on maintenance, textures, and bespoke styles.</p>
      </div>

      <div className="flex-grow bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
        {/* Chat window */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar bg-[#fcfbf7]/30"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-black' : 'bg-brand'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
              </div>
              <div className={`max-w-[75%] px-6 py-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center shadow-lg">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-brand/30 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-brand/60 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-brand rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How do I maintain Edna's silk bundles?..."
              className="w-full bg-gray-50 border border-gray-100 pl-8 pr-16 py-5 rounded-2xl focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all font-medium text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-3 p-4 bg-brand text-white rounded-xl hover:bg-brand-dark disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[9px] text-center text-gray-400 mt-6 font-bold uppercase tracking-[0.3em]">Bespoke consultations by Edna's Virtual Team.</p>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
