import { Message as MessageType } from '../../data/dtos/message';
import { format } from 'date-fns';
import avatar from '../../assets/images/avatar.png';
import clsx from 'clsx';

interface MessageProps {
  message: MessageType;
  isFirstInGroup?: boolean;
}

export function Message({ message, isFirstInGroup = true }: MessageProps) {
  const formattedTime = format(new Date(message.createdAt), 'HH:mm');
  const formattedDate = format(new Date(message.createdAt), 'dd MMMM yyyy');

  return (
    <div className={clsx(
      "px-6 py-1 hover:bg-gray-50 group",
      isFirstInGroup && "mt-3"
    )}>
      {isFirstInGroup && (
        <div className="text-xs text-gray-500 mb-1">
          {formattedDate}
        </div>
      )}
      <div className="flex items-start">
        {isFirstInGroup ? (
          <img
            src={message.sender.avatar || avatar}
            alt={message.sender.username || message.sender.email}
            className="w-9 h-9 rounded mr-2 mt-0.5"
          />
        ) : (
          <div className="w-9 mr-2" />
        )}
        <div className="flex-1 min-w-0">
          {isFirstInGroup && (
            <div className="flex items-center mb-1">
              <span className="font-bold text-gray-900">
                {message.sender.username || message.sender.email}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {formattedTime}
              </span>
            </div>
          )}
          <div className="text-gray-900 whitespace-pre-wrap break-words">
            {message.content}
            {message.isEdited && (
              <span className="text-xs text-gray-500 ml-1">(modifié)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 