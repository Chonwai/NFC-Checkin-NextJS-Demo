import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-hk';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-hk');

const DEFAULT_TIMEZONE = 'Asia/Hong_Kong';

// 用於顯示時間的格式化函數
export const formatDateTime = (
    utcDate: string,
    format: string = 'YYYY-MM-DD HH:mm',
    useLocalTimezone: boolean = false
) => {
    if (!utcDate) return '';

    if (useLocalTimezone) {
        return dayjs(utcDate).format(format);
    }
    return dayjs(utcDate).tz(DEFAULT_TIMEZONE).format(format);
};

// 用於表單輸入時間的格式化函數
export const formatDateTimeForInput = (utcDate: string, useLocalTimezone: boolean = false) => {
    if (!utcDate) return '';

    if (useLocalTimezone) {
        return dayjs(utcDate).format('YYYY-MM-DDTHH:mm');
    }
    return dayjs(utcDate).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DDTHH:mm');
};

// 用於顯示日期的格式化函數
export const formatDate = (
    utcDate: string,
    format: string = 'YYYY-MM-DD',
    useLocalTimezone: boolean = false
) => {
    return formatDateTime(utcDate, format, useLocalTimezone);
};

// 將本地時間轉換為 UTC 時間
export const formatLocalToUTC = (localTime: string, fromTimezone: string = DEFAULT_TIMEZONE) => {
    if (!localTime) return '';
    return dayjs.tz(localTime, fromTimezone).utc().format();
};

// 將 UTC 時間轉換為香港時區的 datetime-local 輸入格式
export const formatUTCToZonedInput = (utcDate: string) => {
    if (!utcDate) return '';
    return dayjs(utcDate).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DDTHH:mm');
};

// 將表單輸入的時間轉換為 UTC
export const formatInputToUTC = (inputDate: string) => {
    if (!inputDate) return '';
    // 假設輸入是香港時間，轉換為 UTC
    return dayjs.tz(inputDate, DEFAULT_TIMEZONE).utc().format();
};
