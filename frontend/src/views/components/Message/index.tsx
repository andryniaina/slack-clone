import { Message as MessageType } from '../../../data/dtos/message';
import avatar from '../../../assets/images/avatar.png';
import clsx from 'clsx';
import { formatTime } from '../../../utils/date';

interface MessageProps {
  message: MessageType;
  isFirstInGroup?: boolean;
  isFirstOfDay?: boolean;
}

export function Message({ message, isFirstInGroup = true, isFirstOfDay = false }: MessageProps) {
  const date = new Date(message.createdAt);
  const formattedTime = formatTime(date);

  return (
    <div className={clsx(
      "px-[20px] hover:bg-[#F8F8F8] group transition-colors duration-100",
      isFirstInGroup ? "mt-[10px]" : "mt-0",
      isFirstOfDay && "mt-0"
    )}>
      <div className="flex items-start group min-h-[20px] -ml-[3px]">
        <div className="w-[36px] flex-shrink-0 mt-[1px]">
          {isFirstInGroup && (
            <img
              src={message.sender.avatar || avatar}
              alt={message.sender.username || message.sender.email}
              className="w-[36px] h-[36px] rounded-[4px] object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 pl-[10px] -mt-[1px]">
          {isFirstInGroup && (
            <div className="flex items-baseline mb-[1px] select-none">
              <span className="font-bold text-[15px] text-[#1D1C1D] leading-[1.46668] hover:underline cursor-pointer">
                {message.sender.username || message.sender.email}
              </span>
              <span className="text-[12px] text-[#616061] font-normal ml-[8px] leading-[1.46668] select-none">
                {formattedTime}
              </span>
            </div>
          )}
          <div className="text-[15px] text-[#1D1C1D] leading-[1.46668] break-words whitespace-pre-wrap overflow-hidden">
            <span className="inline-block max-w-[calc(100%-32px)]">
              {message.content}
              {message.isEdited && (
                <span className="text-[12px] text-[#616061] ml-[6px] font-normal select-none inline-block">(modifié)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 