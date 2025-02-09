import { useEffect, useRef } from 'react';
import { Message as MessageType } from '../../data/dtos/message';
import { Message } from '../Message';
import { Loader2 } from 'lucide-react';

interface ChatMessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Aucun message dans ce canal</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => {
        // Check if this message is the first in a group
        const isFirstInGroup =
          index === 0 ||
          messages[index - 1].sender._id !== message.sender._id ||
          new Date(message.createdAt).getTime() -
            new Date(messages[index - 1].createdAt).getTime() >
            5 * 60 * 1000; // 5 minutes gap

        return (
          <Message
            key={message._id}
            message={message}
            isFirstInGroup={isFirstInGroup}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
} 