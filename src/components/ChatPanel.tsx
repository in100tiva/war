import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { playSound } from '../lib/audio';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface ChatPanelProps {
  roomId: Id<'gameRooms'>;
  userId: Id<'users'>;
  isCollapsed?: boolean;
  onToggle?: () => void;
  position?: 'fixed' | 'inline';
}

export function ChatPanel({ roomId, userId, isCollapsed = false, onToggle, position = 'fixed' }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessagesLength = useRef(0);

  const messages = useQuery(api.chat.getMessages, { roomId, limit: 100 }) || [];
  const sendMessage = useMutation(api.chat.send);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    if (messagesEndRef.current && !isCollapsed) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Notify new messages
    if (messages.length > prevMessagesLength.current && isCollapsed) {
      playSound.notification();
    }
    prevMessagesLength.current = messages.length;
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

  const unreadCount = isCollapsed ? messages.length : 0;

  if (isCollapsed) {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className={cn(
          "relative shadow-lg transition-all hover:scale-105",
          position === 'fixed' ? "fixed bottom-4 right-4 z-40" : ""
        )}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="warning"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
          >
            {Math.min(unreadCount, 99)}
          </Badge>
        )}
      </Button>
    );
  }

  const containerClass = position === 'fixed'
    ? "fixed bottom-4 right-4 w-80 z-40"
    : "w-full h-full";

  return (
    <Card className={cn(containerClass, "flex flex-col", position === 'fixed' && "max-h-[450px]")}>
      <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-rose-400" />
          Chat da Sala
        </CardTitle>
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <ScrollArea className={cn("flex-1 px-4", position === 'fixed' ? "h-[280px]" : "h-full")}>
          <div className="space-y-3 py-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircle className="h-10 w-10 text-white/20 mb-2" />
                <p className="text-white/40 text-sm">Nenhuma mensagem ainda</p>
                <p className="text-white/30 text-xs">Seja o primeiro a dizer ola!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="group">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-semibold text-sm flex items-center gap-1"
                      style={{ color: msg.playerColor }}
                    >
                      {msg.user?.name || 'Desconhecido'}
                      {msg.user?.isAI && (
                        <Bot className="h-3 w-3 text-white/40" />
                      )}
                    </span>
                    <span className="text-white/30 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm break-words leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="p-3 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              maxLength={500}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || !message.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
