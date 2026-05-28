import type { EnrichedEvent, EnrichedTimetableData } from '../types/timetable';
import { enrichTimetableData } from '../utils/enrichTimetableData';

export function flattenEventsData(): EnrichedEvent[] {
    const data: EnrichedTimetableData = enrichTimetableData();

    const allEvents = data.flatMap(day => day.scenes.flatMap(scene => scene.lineup));
    
    allEvents.sort((a, b) => {
        if (a.date !== b.date){
            return a.date.localeCompare(b.date);
        }
    
        if (a.startDecimal !== b.startDecimal){
            return a.startDecimal - b.startDecimal;
        }
    
        return a.sceneIndex - b.sceneIndex;
    })

    return allEvents;
}