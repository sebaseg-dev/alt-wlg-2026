import { LATEST_CLOSING_HOUR } from '../constants';

export default function normaliseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    const normalisedHours = hours < LATEST_CLOSING_HOUR ? hours + 24 : hours;
    return normalisedHours + (minutes / 60);
}