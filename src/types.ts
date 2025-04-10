// ENUMS
export enum ROLE {
    STREAMER = "streamer",
    VIEWER = "viewer",
}

export enum PITYMODE {
    PULL = "pull",
    SHOP = "shop",
}

// ACTUAL TYPES
export interface TwitchData {
    id: string;
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
    allowedRoles: ROLE[];
    // Worlds belonging to this user as a streamer.
    // Initially it will be capped to 1 world.
    worldIds: string[];
}

export interface World {
    // Database ID
    id: string;
    // To which streamers this world belongs to
    streamerIds: string[];
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

export interface IPity {
    mode: PITYMODE;
}

export interface PullsPity extends IPity {
    mode: PITYMODE.PULL;
}

export interface ShopPity extends IPity {
    mode: PITYMODE.SHOP;
    shopId: string;
}

// SHOP RELATED STUFF
export interface Shop {
    // Items available in this shop
    items: ShopItem[];
    // Currency Accepted by this shop
    currencyId: string;
}

export interface ShopItem {
    // Character, Material or Decoration
    type: string;
    // Id of the item. We use type to know what to fetch
    id: string;
    // How much of this item is available in the shop
    quantity: string;
}

export interface Currency {
    id: string;
    name: string;
    image: string;
}
