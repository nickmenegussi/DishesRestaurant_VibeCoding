import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, ChefHat } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useMenu } from "../../../context/MenuContext";
import { cn } from "../../../utils/cn";
import { generateSlug } from "../../../utils/slug";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
}

export function AIChefAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm the AI Chef. I'm currently taking a short break as my recipe book (API Quota) is full. I'll be back to give you delicious recommendations very soon!"
    }
  ]);
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { } = useMenu();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);


  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gray-400 text-white shadow-xl flex items-center justify-center hover:bg-gray-500 transition-colors"
        >
            <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col font-sans",
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      )} style={{ height: '500px' }}>
        
        {/* Header */}
        <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <ChefHat className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-600 text-sm">Chef Assistant</h3>
                    <p className="text-orange-500 text-xs flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Unavailable (Quota)
                    </p>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
            >
                <X className="h-5 w-5" />
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.role === 'user' ? "self-end items-end" : "self-start items-start"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        msg.role === 'user' 
                            ? "bg-primary text-white rounded-br-none" 
                            : "bg-white text-text-main border border-gray-100 rounded-bl-none"
                    )}>
                        {msg.content}
                    </div>

                    {/* Recommendations Cards */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-2 space-y-2 w-full">
                            {msg.recommendations.map(dish => (
                                <div 
                                    key={dish.id}
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/dish/${generateSlug(dish.name)}`);
                                    }}
                                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-primary/30 transition-all flex gap-3 items-center"
                                >
                                    <img src={dish.image} className="w-10 h-10 rounded-lg object-cover" alt={dish.name} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-text-main truncate">{dish.name}</p>
                                        <p className="text-primary text-xs font-bold">${dish.price}</p>
                                    </div>
                                    <div className="px-2 py-1 bg-primary/10 rounded text-xs font-bold text-primary">View</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            {isTyping && (
                <div className="self-start bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
            <form className="flex items-center gap-2">
                <input
                    type="text"
                    disabled
                    placeholder="Chat currently unavailable..."
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed opacity-60 italic"
                />
                <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    className="h-11 w-11 rounded-xl px-0 opacity-50 cursor-not-allowed"
                    disabled
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>

      </div>
    </>
  );
}
