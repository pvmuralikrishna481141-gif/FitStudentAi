import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { startFitnessChat } from '../services/gemini';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!chatRef.current) {
      chatRef.current = await startFitnessChat();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = await startFitnessChat();
      }
      const result = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: result.text || '' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-brand-600 text-white p-4 rounded-full shadow-xl hover:bg-brand-700 transition-all z-50 flex items-center gap-2 group"
      >
        <MessageCircle size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
          Expert Advice
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-brand-600 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Fitness & Nutrition Expert</h3>
                  <p className="text-[10px] text-brand-100 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-brand-600">
                    <Bot size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-800">How can I help you today?</p>
                    <p className="text-xs text-zinc-500">Ask about workouts, meal prep, or nutrition.</p>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-zinc-100 text-zinc-600' : 'bg-brand-100 text-brand-600'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-tr-none' 
                        : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                    }`}>
                      <div className="markdown-body prose prose-sm max-w-none">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 flex-row">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none">
                      <Loader2 size={16} className="animate-spin text-zinc-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-zinc-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
