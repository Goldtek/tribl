import { format, isToday, isYesterday } from 'date-fns';

export default function formatMessageTime(data: Date) {
  const messageTime = new Date(data);

  if (isToday(messageTime)) return format(messageTime, 'p');

  if (isYesterday(messageTime)) return 'yesterday';

  return format(messageTime, 'dd/MM/yyyy');
}
