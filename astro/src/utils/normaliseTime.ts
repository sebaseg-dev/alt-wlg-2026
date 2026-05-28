import { LATEST_CLOSING_HOUR } from '../constants';

export default function normaliseTime(timeString: string | undefined | null): number {
    if (!timeString) return 0;

    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (!timeRegex.test(timeString)) {
        console.warn(`Format d'heure invalide (attendu HH:MM) : ${timeString}`);
        return 0;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (hours > 23 || minutes > 59) {
        console.warn(`Valeurs d'heure hors limites : ${timeString}`);
        return 0;
    }

    const normalisedHours = hours < LATEST_CLOSING_HOUR ? hours + 24 : hours;
    return normalisedHours + (minutes / 60);
}
