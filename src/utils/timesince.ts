import { format, isToday, isYesterday } from 'date-fns';

export default function formatMessageTime(date: Date | number) {
  const messageTime = new Date(date);

  if (isToday(messageTime)) return format(messageTime, 'p');

  if (isYesterday(messageTime)) return 'yesterday';

  return format(messageTime, 'dd/MM/yyyy');
}
