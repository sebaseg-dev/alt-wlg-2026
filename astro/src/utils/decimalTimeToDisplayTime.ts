export default function decimalTimeToDisplayTime(decimalTime: number): string {
    const hours = decimalTime >= 24 ? Math.floor(decimalTime) - 24 : Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - Math.floor(decimalTime)) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}