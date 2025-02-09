import { Hash } from 'lucide-react';
import { Channel } from '../../../data/dtos/channel';

interface SidebarChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onClick: () => void;
}

export function SidebarChannelItem({ channel, isSelected, onClick }: SidebarChannelItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full ${
        isSelected ? 'bg-[#1164A3] text-white' : 'text-white/70 hover:bg-[#350D36]'
      } px-2 py-1 text-sm flex items-center rounded`}
    >
      <Hash size={16} className="mr-2" />
      {channel.name}
    </button>
  );
} 