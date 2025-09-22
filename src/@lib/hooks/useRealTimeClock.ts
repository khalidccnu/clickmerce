import { useCallback, useEffect, useMemo, useState } from 'react';

export interface IProps {
  format?: '12h' | '24h';
  includeSeconds?: boolean;
  includeDate?: boolean;
  updateInterval?: number;
  locale?: string;
}

const useRealTimeClock = (options: IProps = {}) => {
  const {
    format = '12h',
    includeSeconds = true,
    includeDate = false,
    updateInterval = 1000,
    locale = 'en-US',
  } = options;

  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const formatTimeFn = useCallback(
    (
      date: Date,
    ): {
      time: string;
      date?: string;
      hours: number;
      minutes: number;
      seconds: number;
      meridian?: 'AM' | 'PM';
      timestamp: number;
      formattedDateTime: string;
    } => {
      const hours24 = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      let hours: number;
      let meridian: 'AM' | 'PM';

      if (format === '12h') {
        hours = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
        meridian = hours24 >= 12 ? 'PM' : 'AM';
      } else {
        hours = hours24;
      }

      const timeArr = [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];

      if (includeSeconds) {
        timeArr.push(seconds.toString().padStart(2, '0'));
      }

      let time = timeArr.join(':');

      if (format === '12h' && meridian) {
        time += ` ${meridian}`;
      }

      let dateString: string;

      if (includeDate) {
        dateString = date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }

      const formattedDateTime = date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: format === '12h' ? 'numeric' : '2-digit',
        minute: '2-digit',
        second: includeSeconds ? '2-digit' : undefined,
        hour12: format === '12h',
      });

      return {
        time,
        date: dateString,
        hours: format === '12h' ? hours : hours24,
        minutes,
        seconds,
        meridian,
        timestamp: date.getTime(),
        formattedDateTime,
      };
    },
    [format, includeSeconds, includeDate, locale],
  );

  const formattedTimeFn = useCallback(
    (customFormat?: '12h' | '24h'): string => {
      const fmt = customFormat || format;
      const tempDate = new Date();
      const hours24 = tempDate.getHours();
      const minutes = tempDate.getMinutes();
      const seconds = tempDate.getSeconds();

      let hours: number;
      let meridian = '';

      if (fmt === '12h') {
        hours = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
        meridian = hours24 >= 12 ? ' PM' : ' AM';
      } else {
        hours = hours24;
      }

      const timeArr = [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];

      if (includeSeconds) {
        timeArr.push(seconds.toString().padStart(2, '0'));
      }

      return timeArr.join(':') + meridian;
    },
    [format, includeSeconds],
  );

  const clock = useMemo(() => formatTimeFn(currentTime), [currentTime, formatTimeFn]);
  const isMorning = useMemo(() => currentTime.getHours() < 12, [currentTime]);
  const isAfternoon = useMemo(() => currentTime.getHours() >= 12, [currentTime]);
  const isEvening = useMemo(() => currentTime.getHours() >= 18, [currentTime]);
  const isNight = useMemo(() => currentTime.getHours() >= 22 || currentTime.getHours() < 6, [currentTime]);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isClient, updateInterval]);

  return {
    ...clock,
    currentTime,
    formattedTimeFn,
    isMorning,
    isAfternoon,
    isEvening,
    isNight,
    isClient,
    refresh: () => setCurrentTime(new Date()),
    format,
    updateInterval,
  };
};

export default useRealTimeClock;
