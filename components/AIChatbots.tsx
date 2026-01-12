
import React, { useState, useRef, useEffect } from 'react';
import { getBotResponse } from '../geminiService';
import { BOT_CONFIGS } from '../constants';
import { ChatMessage } from '../types';
import { Part } from '@google/genai';

const AIChatbots: React.FC = () => {
  const [activeBot, setActiveBot] = useState<keyof typeof BOT_CONFIGS>('academic');
  
  // Persistent messages state
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('lasusphere_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure dates are restored as Date objects
        Object.keys(parsed).forEach(botKey => {
          parsed[botKey] = parsed[botKey].map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
        });
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved chats", e);
      }
    }
    return {
      academic: [{ role: 'model', content: "Hello! I'm your Academic Advisor. How can I help with your studies today?", timestamp: new Date() }],
      career: [{ role: 'model', content: "Hi there! I'm your Career Counselor. Looking for internship advice or career path guidance?", timestamp: new Date() }],
      finance: [{ role: 'model', content: "Welcome! I'm your Personal Finance bot. Let's talk about budgeting and savings.", timestamp: new Date() }],
    };
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ name: string; type: string; data: string }[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Save chats whenever messages update
  useEffect(() => {
    localStorage.setItem('lasusphere_chats', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeBot, loading]);

  const clearChat = () => {
    if (!window.confirm("Are you sure you want to clear this conversation history?")) return;
    
    const initialGreetings: Record<string, string> = {
      academic: "Hello! I'm your Academic Advisor. History cleared.",
      career: "Hi there! I'm your Career Counselor. History cleared.",
      finance: "Welcome! I'm your Personal Finance bot. History cleared.",
    };

    setMessages(prev => ({
      ...prev,
      [activeBot]: [{ 
        role: 'model', 
        content: initialGreetings[activeBot], 
        timestamp: new Date() 
      }]
    }));
  };

  const handleSend = async (audioData?: { data: string; mimeType: string }) => {
    const textToSend = input.trim();
    if (!textToSend && !audioData && pendingFiles.length === 0) return;
    if (loading) return;

    let displayContent = textToSend || (audioData ? "[Voice Message]" : "[Attached Files]");
    const attachments: Part[] = [];

    // Add files to Gemini parts
    pendingFiles.forEach(file => {
      attachments.push({
        inlineData: {
          data: file.data.split(',')[1],
          mimeType: file.type
        }
      });
    });

    // Add audio to Gemini parts
    if (audioData) {
      attachments.push({
        inlineData: {
          data: audioData.data,
          mimeType: audioData.mimeType
        }
      });
    }

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: displayContent, 
      timestamp: new Date() 
    };

    const currentBotMessages = [...messages[activeBot], userMessage];
    setMessages(prev => ({ ...prev, [activeBot]: currentBotMessages }));
    setInput('');
    setPendingFiles([]);
    setLoading(true);

    const history = currentBotMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await getBotResponse(
      activeBot, 
      textToSend || "Please process the attached media.", 
      history.slice(-6, -1),
      attachments
    );
    
    const botMessage: ChatMessage = { role: 'model', content: response, timestamp: new Date() };
    setMessages(prev => ({
      ...prev,
      [activeBot]: [...prev[activeBot], botMessage]
    }));
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fixed: Explicitly type 'file' as File to resolve "Property 'name' does not exist on type 'unknown'"
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setPendingFiles(prev => [...prev, { name: file.name, type: file.type, data: base64 }]);
      };
      // Fixed: Explicit type helps ensure 'file' is recognized as a Blob for readAsDataURL
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Fixed: Explicitly type event to resolve inference issues with .data.size
      mediaRecorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = (reader.result as string).split(',')[1];
          handleSend({ data: base64Data, mimeType: 'audio/webm' });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          {(Object.keys(BOT_CONFIGS) as Array<keyof typeof BOT_CONFIGS>).map(key => (
            <button
              key={key}
              onClick={() => setActiveBot(key)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all border ${
                activeBot === key 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{BOT_CONFIGS[key].icon}</span>
              <span className="font-semibold">{BOT_CONFIGS[key].name}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={clearChat}
          className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-rose-100 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Current Chat
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {messages[activeBot].map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className={`text-[10px] mt-2 font-medium ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-3xl rounded-tl-none flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {pendingFiles.length > 0 && (
          <div className="px-8 py-2 flex flex-wrap gap-2 bg-gray-50 border-t border-gray-100">
            {pendingFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm animate-fadeIn">
                <span className="text-[10px] font-bold text-gray-600 truncate max-w-[150px]">{file.name}</span>
                <button 
                  onClick={() => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[24px] border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-2xl transition-all"
              title="Upload File"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileUpload}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? "Recording audio..." : `Ask the ${BOT_CONFIGS[activeBot].name}...`}
              disabled={isRecording}
              className="flex-1 bg-transparent px-2 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={`p-3 rounded-2xl transition-all ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-100' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-white'
              }`}
              title="Hold to record audio"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>

            <button
              onClick={() => handleSend()}
              disabled={loading || isRecording}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-3 font-medium uppercase tracking-widest">
            {isRecording ? "Release to Send Voice Message" : "Hold Microphone to Record • Supports Files & Voice"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbots;
