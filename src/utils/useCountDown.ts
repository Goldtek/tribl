import { useEffect, useState, useCallback } from 'react';

// OTP TIMERS
const INITIAL_TIME = 60 * 1000;
const TIME_INTERVAL = 1000;

export default function useCountDown(
  timeToCount: number = INITIAL_TIME,
  intervalTime: number = TIME_INTERVAL
) {
  const [timeLeft, setTimeLeft] = useState(timeToCount / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 0) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const restartTime = useCallback(
    (timeToCount: number = INITIAL_TIME) => {
      setTimeLeft(timeToCount / 1000);
    },
    [setTimeLeft]
  );

  return [timeLeft, restartTime] as const;
}
