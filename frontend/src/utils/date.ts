import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateHeader = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
};

export const formatTime = (date: Date) => {
  return format(date, 'HH:mm');
}; 