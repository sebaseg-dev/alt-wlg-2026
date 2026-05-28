export interface TimetableEvent {
    id: string;
    artist: string;
    start_time: string;
    end_time: string;
    description: string;
    type: 'music' | 'talk';
    image?: string;
    links: {
        spotify?: string;
        apple?: string;
        deezer?: string;
        qobuz?: string;
        youtube?: string;
        amazon?: string;
        tidal?: string;
    };
}

export interface EnrichedEvent extends TimetableEvent {
    startDecimal: number;
    endDecimal: number;
    durationQuarters: number;
    sceneName: string;
    sceneIndex: number;
    date: string;
    dateLabel: string;
}

export interface Scene {
    name: string;
    lineup: TimetableEvent[];
}

export interface EnrichedScene {
    name: string;
    lineup: EnrichedEvent[];
}

export interface Day {
    date: string;
    label: string;
    last_metro: string;
    scenes: Scene[];
}

export interface EnrichedDay {
    date: string;
    label: string;
    last_metro: string;
    scenes: EnrichedScene[];
}

export type TimetableData = Day[];

export type EnrichedTimetableData = EnrichedDay[];