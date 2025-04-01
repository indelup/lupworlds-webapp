// User Config
export enum Role {
    STREAMER = 'streamer',
    VIEWER = 'viewer'
}

export interface TwitchData {
    token: string;
    name: string;
}

export interface User {
    // Database ID
    id: string;
    // Twitch ID    
    twitchId: string;
    // Display name for the user
    alias: string;
    // Roles the user can have
    allowedRoles: Role[];
    // Worlds belonging to this user as a streamer.
    // Initially it will be capped to 1 world.
    worlds: World[];
}

export interface World {
    // Database ID  
    id: string;
    // To which streamers this world belongs to
    streamerIds: string[]
    // max rarity
    maxRarity: number;
}

// Streamer Assets
export interface Character {
    id: string;
    worldId: string;
    name: string;
    description: string;
    frontImage: string;
    backImage: string;
    rarity: number;
}

export interface Material {
    id: string;
    worldId: string;
    name: string;
    description: string;
    frontImage: string;
    backImage: string;
    rarity: number;
}

export interface Banner {
    id: string;
    worldId: string;
    image: string;
}

export interface BannerBag {
    id: string;
    bannerId: string;
    items: BannerBagItem[];
    chance: number;
}

export interface BannerBagItem {
    id: string;
    bagId: string;
    item: Character | Material;
}
