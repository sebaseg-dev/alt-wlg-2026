import type { TimetableData, EnrichedTimetableData } from "../types/timetable";
import normaliseTime from "./normaliseTime";

export function enrichTimetableData(data: TimetableData): EnrichedTimetableData {
    return data.map(day => ({
        ...day,
        scenes: day.scenes.map(scene => ({
            ...scene,
            lineup: scene.lineup.map(event => {
                const start = normaliseTime(event.start_time);
                const end = normaliseTime(event.end_time);
                return {
                    ...event,
                    startDecimal: start,
                    endDecimal: end,
                    durationQuarters: (end - start) * 4
                };
            }),
        })),
    }));
}