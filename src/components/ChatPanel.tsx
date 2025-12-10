import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { playSound } from '../lib/audio';

interface ChatPanelProps {
  roomId: Id<'gameRooms'>;
  userId: Id<'users'>;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ChatPanel({ roomId, userId, isCollapsed = false, onToggle }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = useQuery(api.chat.getMessages, { roomId, limit: 100 }) || [];
  const sendMessage = useMutation(api.chat.send);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    if (messagesEndRef.current && !isCollapsed) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCollapsed]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ roomId, userId, message: trimmedMessage });
      setMessage('');
      playSound.click();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isCollapsed) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-full shadow-lg z-40 transition-all"
        title="Abrir chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {Math.min(messages.length, 99)}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-gray-900/95 border border-white/10 rounded-lg shadow-xl z-40 flex flex-col max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[150px] max-h-[250px]">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhuma mensagem ainda. Diga ola!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="text-sm">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-semibold"
                  style={{ color: msg.playerColor }}
                >
                  {msg.user?.name || 'Desconhecido'}
                  {msg.user?.isAI && <span className="text-xs text-gray-500 ml-1">(IA)</span>}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-gray-300 break-words">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            maxLength={500}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !message.trim()}
            className="bg-rose-600 hover:bg-rose-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            {isSending ? '...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
