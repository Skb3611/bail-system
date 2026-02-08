"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Gavel, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: "Hello! I am your Indian Legal Assistant. I can help you understand IPC/CrPC sections, bail eligibility, and legal procedures. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.parts }]
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: history,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: "Sorry, I encountered an error. Please try again later." },
        ]);
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: "Sorry, I encountered a network error. Please check your connection." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        parts: "Chat history cleared. How can I help you now?",
      },
    ]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-xl bg-slate-900 hover:bg-slate-800 transition-all duration-300 z-50 animate-in fade-in zoom-in"
      >
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 ease-in-out flex flex-col items-end",
      isMinimized ? "w-auto" : "w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px]"
    )}>
      <Card className={cn(
        "shadow-2xl border-slate-200 flex flex-col transition-all duration-300 w-full",
        isMinimized ? "h-auto" : "h-[80vh] max-h-[600px]"
      )}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-slate-900 text-white rounded-t-lg shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Gavel className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Legal Assistant</CardTitle>
              {!isMinimized && <p className="text-xs text-slate-300">AI-powered Bail & Law Expert</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-300 hover:text-white hover:bg-white/10"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            {!isMinimized && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-300 hover:text-white hover:bg-white/10"
                onClick={clearChat}
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-300 hover:text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Chat Content */}
        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50">
              <ScrollArea className="h-full px-4 py-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex w-fit max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm break-words",
                        msg.role === "user"
                          ? "ml-auto bg-slate-900 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                      )}
                    >
                      <div className="markdown-content overflow-hidden">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed break-words" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-1" {...props} />,
                            strong: ({node, ...props}) => <span className="font-semibold text-inherit" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          }}
                        >
                          {msg.parts}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="bg-white border border-slate-100 w-max rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Footer */}
            <CardFooter className="p-3 bg-white border-t border-slate-100">
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about IPC sections, bail rules..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 focus-visible:ring-slate-900 border-slate-200"
                    disabled={isLoading}
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-[10px] text-center text-slate-400">
                  AI responses are for informational purposes only and not legal advice.
                </p>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
