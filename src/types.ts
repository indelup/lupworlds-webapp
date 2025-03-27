// User Config
export enum Mode {
    STREAMER = 'streamer',
    VIEWER = 'viewer'
}

export interface DBUser {
    twitchId: string;
    username: string;
    allowedModes: Mode[];
}

export interface RuntimeUser {
    twitchToken: string;
    twitchName: string;
}

export type User = DBUser & RuntimeUser;

// Streamer Assets
export interface Character {
    name: string;
    description: string;
    image: string;
}

export interface Materials {
    name: string;
    description: string;
    image: string;
}

// Other
export interface World {
    streamer_id: string;
}
