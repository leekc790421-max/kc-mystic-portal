import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '../utils/gemini';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';

const SUGGESTED_QUESTIONS = [
  '我的上升摩羯代表什麼？',
  '太陽金牛在第4宮的意義？',
  '馬雅Kin182紅龍的靈魂使命？',
  '2026年我的流年運勢如何？',
  '月亮水瓶如何影響我的情感？',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是 KC Mystic Portal 的占星助手。有任何關於你的命盤、占星或馬雅曆法的問題，都可以問我。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = '用戶正在查看 KC Mystic Portal 網站，對西洋占星和馬雅曆法感興趣。';
      const response = await chatWithGemini(message, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我暫時無法回應。請稍後再試。' 
      }]);
    }

    setIsLoading(false);
  };

  const handleSuggestion = (question) => {
    handleSend(question);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-mystic-violet to-mystic-pink text-white shadow-lg hover:shadow-xl hover:shadow-mystic-violet/30 transition-all flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        {isOpen ? <HiX size={24} /> : <HiChat size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-[340px] sm:w-[380px] h-[500px] glass-strong flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-mystic-violet/20 to-mystic-pink/20">
              <h3 className="font-[family-name:var(--font-display)] text-sm text-mystic-gold">
                占星助手
              </h3>
              <p className="text-xs text-gray-400">Powered by Gemini AI</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-mystic-violet/30 text-white rounded-br-sm'
                        : 'glass text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="glass px-3 py-2 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">試試問：</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(q)}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 hover:bg-mystic-violet/20 hover:text-mystic-gold transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="輸入你的問題..."
                  className="flex-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:border-mystic-gold/50 focus:outline-none placeholder:text-gray-600"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-mystic-violet text-white flex items-center justify-center hover:bg-mystic-violet/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <HiPaperAirplane size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
