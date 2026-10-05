import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getActiveToken } from '../services/api';
import {
  MessageSquareCode,
  Send,
  Loader2,
  Sparkles,
  Plus,
  ArrowRight,
  User,
  Bot,
  Trash2,
  RotateCcw,
  Clock
} from 'lucide-react';

const Chat = () => {
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch Chats list
  const { data: chatsRes, isLoading: chatsLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const res = await api.get('/ai/chats');
      return res.data;
    }
  });

  const chats = chatsRes?.data || [];

  // Fetch Message history for the active conversation
  const { data: activeChatRes, isLoading: msgLoading } = useQuery({
    queryKey: ['chatMessages', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return null;
      const res = await api.get(`/ai/chats/${activeChatId}`);
      return res.data;
    },
    enabled: !!activeChatId
  });

  const activeChat = activeChatRes?.data;
  
  // Sync DB messages to local state when active chat changes
  useEffect(() => {
    if (activeChat) {
      setLocalMessages(activeChat.messages || []);
      setErrorMsg('');
    } else {
      setLocalMessages([]);
    }
  }, [activeChat]);

  // Keep scroll focused to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, streamingText, isStreaming]);

  // Helper: Custom parsing of basic Markdown (Paragraphs, code blocks with copy features, bulleted lists, simple grids)
  const renderMarkdown = (text) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : 'code';
        const codeContent = match ? match[2] : part.slice(3, -3);

        return (
          <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs text-left">
            <div className="flex justify-between items-center px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 select-none">
              <span>{language.toUpperCase() || 'CODE'}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeContent.trim());
                  // Alert/toast is optional, copy functionality works
                }}
                className="hover:text-white transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-400">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Plain text formatting line by line
      const lines = part.split('\n');
      return (
        <div key={idx} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            // Match table structures
            if (trimmed.startsWith('|')) {
              const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
              const isDivider = cells.every(c => c.startsWith('-'));
              if (isDivider) return null;

              return (
                <div key={lIdx} className="grid grid-flow-col auto-cols-fr gap-2 py-1.5 bg-slate-950/20 border-b border-slate-800 px-2 text-[10px] font-mono">
                  {cells.map((cell, cIdx) => (
                    <span key={cIdx} className="truncate text-slate-300">{cell}</span>
                  ))}
                </div>
              );
            }

            // Bullet points
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <li key={lIdx} className="list-disc list-inside ml-2 text-slate-350 dark:text-slate-300">
                  {parseBold(trimmed.substring(2))}
                </li>
              );
            }

            if (!trimmed) return <div key={lIdx} className="h-2" />;

            return <p key={lIdx}>{parseBold(line)}</p>;
          })}
        </div>
      );
    });
  };

  const parseBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // SSE Stream trigger
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isStreaming) return;

    setErrorMsg('');
    setIsStreaming(true);
    setStreamingText('');

    // Optimistically add User Message
    const userMsg = {
      _id: 'optimistic_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setMessage('');

    try {
      const token = await getActiveToken();
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: activeChatId,
          message: textToSend
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP stream failure: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let finished = false;
      let buffer = '';
      let resolvedChatId = activeChatId;

      while (!finished) {
        const { value, done } = await reader.read();
        if (done) {
          finished = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep partial line

        for (const line of lines) {
          const cleaned = line.trim();
          if (!cleaned || !cleaned.startsWith('data: ')) continue;

          try {
            const payload = JSON.parse(cleaned.substring(6));
            if (payload.event === 'meta') {
              resolvedChatId = payload.chatId;
              setActiveChatId(payload.chatId);
            } else if (payload.event === 'done') {
              finished = true;
            } else if (payload.chunk) {
              setStreamingText((prev) => prev + payload.chunk);
            } else if (payload.error) {
              throw new Error(payload.error);
            }
          } catch (e) {
            // Keep buffer parsing silent for partial streams
          }
        }
      }

      // Finish streaming session
      queryClient.invalidateQueries(['chats']);
      queryClient.invalidateQueries(['chatMessages', resolvedChatId]);
    } catch (error) {
      console.error('Streaming response failure:', error);
      setErrorMsg(error.message || 'Server connection interrupted.');
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  const handleSuggestionClick = (promptText) => {
    handleSendMessage(promptText);
  };

  const handleStartNewChat = () => {
    setActiveChatId(null);
    setLocalMessages([]);
    setStreamingText('');
    setErrorMsg('');
    setMessage('');
  };

  const handleDeleteChat = async (chId, e) => {
    e.stopPropagation(); // Avoid switching active chat
    if (!window.confirm('Delete this conversation?')) return;

    try {
      await api.delete(`/ai/chats/${chId}`);
      queryClient.invalidateQueries(['chats']);
      if (activeChatId === chId) {
        handleStartNewChat();
      }
    } catch (err) {
      console.error('Delete chat fail:', err);
    }
  };

  const handleClearAllChats = async () => {
    if (!window.confirm('Are you sure you want to clear your entire conversation history? This cannot be undone.')) return;

    try {
      await api.delete('/ai/chats');
      queryClient.invalidateQueries(['chats']);
      handleStartNewChat();
    } catch (err) {
      console.error('Clear chats fail:', err);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestions = [
    { title: 'Check Warehouse Warnings', text: 'Give me a summary of my low stock products and auto-restock suggestions.' },
    { title: 'Compile Cash Flow Report', text: 'Analyze my financial cash flow statements and suggest cost savings.' },
    { title: 'Filing Invoices Guidance', text: 'Guide me on how to generate a tax compliant GST invoice.' },
    { title: 'Match Gov Schemes', text: 'What government subsidies or enterprise schemes do I qualify for?' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[78vh] items-stretch">
      {/* Sidebar: Conversations panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full lg:col-span-1 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <MessageSquareCode className="h-4 w-4 text-blue-500" /> Conversations
          </h3>
          <button
            onClick={handleStartNewChat}
            title="Start New Conversation"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-650 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {chats.length > 0 && (
          <button
            onClick={handleClearAllChats}
            className="text-[10px] text-red-500 hover:text-red-600 font-semibold mb-4 text-left hover:underline select-none"
          >
            Clear Conversation History
          </button>
        )}

        {chatsLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-400 italic text-center py-6">No previous conversations.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {chats.map((ch) => {
              const isActive = ch._id === activeChatId;
              return (
                <div
                  key={ch._id}
                  onClick={() => setActiveChatId(ch._id)}
                  className={`group w-full flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                      : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350'
                  }`}
                >
                  <p className="text-xs truncate flex-1 pr-2">{ch.title || 'Untitled Conversation'}</p>
                  <button
                    onClick={(e) => handleDeleteChat(ch._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Area Panel */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full overflow-hidden">
        {/* Messages scrolling container */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {localMessages.length === 0 && !isStreaming ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 my-auto">
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Consult Your Enterprise AI Orchestrator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Submit enterprise queries. The router classifies the category, gathers stock levels, finance P&Ls, and government scheme eligibility, compiling a unified operational analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(sug.text)}
                    className="p-4 border border-slate-150 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 hover:bg-blue-500/5 hover:border-blue-500/25 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                      <span>{sug.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-455 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{sug.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {localMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg._id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                        <Bot className="h-4.5 w-4.5" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[85%] space-y-1">
                      <div className={`p-4 rounded-xl leading-relaxed text-xs shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none text-left'
                          : 'bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-tl-none prose dark:prose-invert max-w-none'
                      }`}>
                        {isUser ? msg.content : renderMarkdown(msg.content)}
                      </div>
                      <span className={`text-[9px] text-slate-400 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <Clock className="h-2.5 w-2.5" /> {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    {isUser && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="h-4.5 w-4.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Incremental SSE stream display */}
              {isStreaming && streamingText && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col max-w-[85%] space-y-1">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl rounded-tl-none text-slate-850 dark:text-slate-200 text-xs leading-relaxed">
                      {renderMarkdown(streamingText)}
                      <span className="inline-block h-3.5 w-1 bg-blue-500 animate-pulse ml-1 align-middle" />
                    </div>
                  </div>
                </div>
              )}

              {/* Loading classified indicator before chunks arrive */}
              {isStreaming && !streamingText && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Classifying query & running multi-agent orchestrator...
                  </div>
                </div>
              )}

              {/* Retry UI if stream encounters error */}
              {errorMsg && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl rounded-tl-none text-xs text-red-650 flex flex-col gap-2">
                    <p className="font-semibold">Stream failed: {errorMsg}</p>
                    <button
                      onClick={() => {
                        const lastUser = [...localMessages].reverse().find(m => m.role === 'user');
                        if (lastUser) {
                          handleSendMessage(lastUser.content);
                        }
                      }}
                      className="flex items-center gap-1.5 self-start px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold shadow-sm transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Retry Message
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Text Input Panel */}
        <form onSubmit={handleFormSubmit} className="flex gap-3 border-t border-slate-100 dark:border-slate-850 pt-4 mt-4">
          <input
            type="text"
            placeholder={isStreaming ? "Wait for AI response to finish..." : "Ask Enterprise AI Orchestrator..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isStreaming}
            className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 text-slate-800 dark:text-slate-200"
          />
          <button
            type="submit"
            disabled={!message.trim() || isStreaming}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
