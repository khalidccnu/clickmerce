import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(quarterOfYear);

const DayjsConfig = dayjs;
export { DayjsConfig };
