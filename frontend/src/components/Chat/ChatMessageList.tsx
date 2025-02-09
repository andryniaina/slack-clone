import { useEffect, useRef } from 'react';
import { Message as MessageType } from '../../data/dtos/message';
import { Message } from '../Message';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { formatDateHeader } from '../../utils/date';

interface ChatMessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Défiler vers le bas lorsque les messages changent (nouveaux messages, chargement initial, etc.)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
        <p className="text-[15px]">Aucun message dans ce canal</p>
      </div>
    );
  }

  // Sort messages by date first (oldest to newest)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Group sorted messages by date
  const messagesByDate = sortedMessages.reduce((groups, message) => {
    const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, MessageType[]>);

  // Get dates in chronological order (oldest first)
  const sortedDates = Object.keys(messagesByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white ml-2">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col pr-4 [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:bg-[#00000033] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-[#00000055]">
        <div className="flex-1" />
        <div>
          {sortedDates.map((date, dateIndex) => (
            <div key={date}>
              <div className="px-4 py-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[#DDDDDD]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[12px] font-medium text-[#616061] capitalize">
                      {formatDateHeader(date)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {messagesByDate[date].map((message, index) => {
                  const isFirstInGroup =
                    index === 0 ||
                    messagesByDate[date][index - 1].sender._id !== message.sender._id ||
                    new Date(message.createdAt).getTime() -
                      new Date(messagesByDate[date][index - 1].createdAt).getTime() >
                      5 * 60 * 1000;

                  return (
                    <Message
                      key={message._id}
                      message={message}
                      isFirstInGroup={isFirstInGroup}
                      isFirstOfDay={index === 0}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 