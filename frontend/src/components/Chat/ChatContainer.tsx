import { ReactNode } from 'react';
import { Channel } from '../../data/dtos/channel';
import { Message } from '../../data/dtos/message';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useTypingStatus } from '../../hooks/message';
import { User } from '../../data/dtos/user';

interface ChatContainerProps {
  channel: Channel | null;
  messages: Message[];
  isLoadingMessages: boolean;
  onSendMessage: (content: string) => void;
  headerRightContent?: ReactNode;
  selectedUser?: User | null;
}

export function ChatContainer({
  channel,
  messages,
  isLoadingMessages,
  onSendMessage,
  headerRightContent,
  selectedUser
}: ChatContainerProps) {
  const { setTyping } = useTypingStatus(channel?._id || undefined);

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            {selectedUser ? 
              "Sélectionnez un utilisateur pour commencer à discuter" :
              "Sélectionnez un canal pour commencer à discuter"
            }
          </h2>
          <p className="text-gray-500">
            {selectedUser ?
              "Choisissez un utilisateur dans la liste de gauche pour voir les messages" :
              "Choisissez un canal dans la liste de gauche pour voir les messages"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader 
        channel={channel}
        rightContent={headerRightContent}
        selectedUser={selectedUser}
      />
      
      <ChatMessageList 
        messages={messages}
        isLoading={isLoadingMessages}
      />
      
      <ChatInput 
        onSendMessage={onSendMessage}
        onTyping={setTyping}
      />
    </div>
  );
} 