import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ArrowRight, User, Mail, Phone, ExternalLink } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

export const AgencyChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! Welcome to SR STUDIO (Sharp Root Studio). I'm your AI assistant. How can I help you today? Feel free to ask about our web development, AI calling agents, branding, or project timelines.",
      timestamp: 'Just now',
      quickActions: [
        { label: '🌐 Web Development', action: () => handleSendPreset('Tell me about your Website Development services') },
        { label: '📞 AI Calling Agents', action: () => handleSendPreset('How do your AI Calling Agents work?') },
        { label: '⚙️ AI Automation', action: () => handleSendPreset('What AI solutions and automation do you build?') },
        { label: '🚀 Start a Project', action: () => handleSendPreset('How do I start a project with SR Studio?') },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSendPreset = (queryText: string) => {
    handleProcessUserMessage(queryText);
  };

  const handleProcessUserMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Query Matching Logic
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = '';
      let actions: { label: string; action: () => void }[] | undefined = undefined;

      if (lower.includes('website') || lower.includes('web') || lower.includes('development') || lower.includes('frontend')) {
        botResponse = "We build high-performance, responsive websites using modern stacks like React, Next.js, Vite, and Tailwind CSS. We optimize for Core Web Vitals (99+ score), responsive fluidity across all screens, bespoke animations, and integrated SEO & GEO schema.";
        actions = [
          {
            label: 'View Services Section',
            action: () => {
              setIsOpen(false);
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: 'Inquire on Pricing',
            action: () => handleSendPreset('What is the estimated cost or process for a website?'),
          },
        ];
      } else if (lower.includes('calling') || lower.includes('voice') || lower.includes('call') || lower.includes('phone') || lower.includes('agent')) {
        botResponse = "Our AI Calling Agents are ultra-low-latency (<400ms), 24/7 autonomous voice assistants. They answer customer calls, qualify leads, schedule appointments directly to your calendar, and sync notes to your CRM with zero human intervention.";
        actions = [
          {
            label: 'Request Voice Demo',
            action: () => {
              setIsOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
        ];
      } else if (lower.includes('ai') || lower.includes('automation') || lower.includes('workflow')) {
        botResponse = "We engineer intelligent automation pipelines connecting CRMs, webhook queues, LLMs, and databases. We eliminate repetitive operational tasks and build custom autonomous assistants tailored specifically to your business operations.";
        actions = [
          {
            label: 'Explore AI Workflows',
            action: () => {
              setIsOpen(false);
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
        ];
      } else if (lower.includes('brand') || lower.includes('design') || lower.includes('logo') || lower.includes('identity')) {
        botResponse = "Our Branding & Creative Design discipline crafts distinctive visual identities, multi-tier design systems, custom vector logos, typography scales, and high-impact digital collateral that make your business stand out.";
        actions = [
          {
            label: 'View Portfolio',
            action: () => {
              setIsOpen(false);
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
        ];
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('rate') || lower.includes('pricing') || lower.includes('how much')) {
        botResponse = "Every SR Studio project is 100% custom-tailored to your exact business objectives and scope. We do not use cookie-cutter packages. We provide a transparent, milestone-based proposal within 24 hours of your inquiry.";
        actions = [
          {
            label: 'Submit Project Details',
            action: () => {
              setIsOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: 'Email Directly',
            action: () => {
              window.location.href = 'mailto:sharprootstudio@gmail.com?subject=Project%20Pricing%20Inquiry';
            },
          },
        ];
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('talk') || lower.includes('start')) {
        botResponse = "You can start a project right now by submitting the brief form on this website, or by emailing us directly at sharprootstudio@gmail.com. We respond to all inquiries within 24 hours!";
        actions = [
          {
            label: 'Open Contact Form',
            action: () => {
              setIsOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: 'Send Email',
            action: () => {
              window.location.href = 'mailto:sharprootstudio@gmail.com?subject=New%20Project%20Vision';
            },
          },
        ];
      } else if (lower.includes('process') || lower.includes('timeline') || lower.includes('how long') || lower.includes('steps')) {
        botResponse = "We follow an agile 4-step framework: 01 Discover (goals & scope) → 02 Strategize (wireframes & architecture) → 03 Create (design, code & QA) → 04 Launch & Grow (CDN deployment & SEO/GEO optimization). Most builds take 2–4 weeks.";
        actions = [
          {
            label: 'View Process Section',
            action: () => {
              setIsOpen(false);
              document.querySelector('#process')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
        ];
      } else {
        botResponse = "Thank you for reaching out! SR Studio specializes in premium website development, custom branding, voice calling AI, and workflow automation. Would you like to schedule a project consultation, or send details to our team?";
        actions = [
          {
            label: 'Email sharprootstudio@gmail.com',
            action: () => {
              window.location.href = 'mailto:sharprootstudio@gmail.com';
            },
          },
          {
            label: 'Go to Contact Form',
            action: () => {
              setIsOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            },
          },
        ];
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleProcessUserMessage(input);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-[#17191C]/95 hover:bg-[#24272B] text-[#F5F1EB] p-3.5 sm:px-5 sm:py-3.5 rounded-full border border-[#F07835]/40 shadow-[0_4px_25px_rgba(240,120,53,0.35)] hover:shadow-[0_6px_35px_rgba(240,120,53,0.55)] transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xl"
            aria-label="Open SR Studio AI Chat"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#F07835] flex items-center justify-center text-white shadow-md">
              <Bot size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#17191C] rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#F5F1EB] tracking-wide flex items-center gap-1.5">
                SR Studio AI
                <Sparkles size={11} className="text-[#FFAD76]" />
              </span>
              <span className="text-[10px] text-[#A5A5A5]">
                Ask questions or book
              </span>
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#F07835] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#17191C]">
                1
              </span>
            )}
          </button>
        ) : null}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[560px] max-h-[85vh] bg-[#17191C]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#1D2024] px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17191C] p-1 border border-[#F07835]/40 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                <img src="/logo.png" alt="SR Studio" className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(240,120,53,0.4)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#F5F1EB] flex items-center gap-1.5">
                  SR Studio AI Assistant
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="text-[11px] text-[#A5A5A5]">
                  Instant Inquiries & Project Guidance
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#A5A5A5] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-[#24272B] border border-white/10 flex items-center justify-center text-[#F07835] flex-shrink-0 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#F07835] text-white rounded-tr-xs shadow-md shadow-[#F07835]/20 font-medium'
                        : 'bg-[#24272B] text-[#F5F1EB] border border-white/10 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                <span className="text-[10px] text-[#737373] mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Action Pills if available */}
                {msg.quickActions && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 pl-9 max-w-[95%]">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={qa.action}
                        className="text-[11px] font-medium bg-[#1D2024] hover:bg-[#F07835]/20 hover:text-[#FFAD76] text-[#A5A5A5] border border-white/10 hover:border-[#F07835]/40 px-3 py-1.5 rounded-full transition-colors cursor-pointer text-left flex items-center gap-1.5"
                      >
                        <span>{qa.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-[#A5A5A5] text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#24272B] border border-white/10 flex items-center justify-center text-[#F07835]">
                  <Bot size={15} />
                </div>
                <div className="bg-[#24272B] px-3.5 py-2.5 rounded-2xl rounded-tl-xs border border-white/10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07835] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07835] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07835] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-[#1D2024] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about SR Studio..."
              className="flex-1 bg-[#17191C] border border-white/10 rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#F5F1EB] placeholder-[#737373] focus:outline-none focus:border-[#F07835] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-[#F07835] hover:bg-[#d96726] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

