import * as dayjs from 'dayjs';

export const getCurrentDateIOS = () => dayjs().toISOString();

export const getDateYear = (date: string | Date): number => dayjs(date).year();

export const getDateYearStartIOS = (date: string | Date): string =>
	dayjs(date).startOf('year').toISOString();

export const getDateYearEndIOS = (date: string | Date): string =>
	dayjs(date).endOf('year').toISOString();
