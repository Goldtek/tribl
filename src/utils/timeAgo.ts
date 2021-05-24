import {
  format,
  isToday,
  differenceInYears,
  formatDistanceToNow
} from 'date-fns';

export default function timeSince(date: number | Date): string {
  if (isToday(date)) {
    return formatDistanceToNow(date) + ' ago';
  }

  if (differenceInYears(new Date(), date) > 0) {
    return format(date, 'MMMM d, yyyy');
  }

  return format(date, 'MMMM d');
}
