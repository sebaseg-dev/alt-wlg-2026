import type { TimetableData, EnrichedTimetableData } from "../types/timetable";
import normaliseTime from "./normaliseTime";
import rawData from "../data/data.json";

export function enrichTimetableData(): EnrichedTimetableData {
    const data = rawData as TimetableData;
    
    return data.map(day => ({
        ...day,
        scenes: day.scenes.map((scene, sceneIndex) => ({
            ...scene,
            lineup: scene.lineup.map(event => {
                const start = normaliseTime(event.start_time);
                const end = normaliseTime(event.end_time);
                return {
                    ...event,
                    startDecimal: start,
                    endDecimal: end,
                    durationQuarters: (end - start) * 4,
                    sceneName: scene.name,
                    sceneIndex: sceneIndex,
                    date: day.date,
                    dateLabel: day.label,
                };
            }),
        })),
    }));
}