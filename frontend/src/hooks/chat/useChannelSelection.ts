import { useState } from 'react';
import { Channel } from '../../data/dtos/channel';
import { useAccessibleChannels } from '../channel';

export function useChannelSelection() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { data: channels = [], isLoading: isLoadingChannels } = useAccessibleChannels();

  const handleChannelSelect = (channel: Channel | null) => {
    setSelectedChannel(channel);
  };

  return {
    selectedChannel,
    setSelectedChannel,
    channels,
    isLoadingChannels,
    handleChannelSelect
  };
} 