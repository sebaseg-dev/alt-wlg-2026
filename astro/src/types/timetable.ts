export interface TimetableEvent {
    id: string;
    artist: string;
    start_time: string;
    end_time: string;
    description: string;
    type: 'music' | 'talk';
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

export interface Scene {
    name: string;
    lineup: TimetableEvent[];
}

export interface Day {
    date: string;
    label: string;
    last_metro: string;
    scenes: Scene[];
}

export type TimetableData = Day[];
