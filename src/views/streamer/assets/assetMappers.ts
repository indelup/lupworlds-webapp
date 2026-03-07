import { Character, Material, Action } from "@melda/lupworlds-types";
import { AssetItem } from "./assetTypes";

export const characterToAsset = (c: Character): AssetItem => ({
    id: c.id,
    worldId: c.worldId,
    name: c.name,
    description: c.description,
    artist: c.artist,
    mainSrc: c.characterSrc,
    backgroundSrc: c.backgroundSrc,
    rarity: c.rarity,
    createdAt: c.createdAt,
});

export const assetToCharacter = (a: AssetItem): Character => ({
    id: a.id,
    worldId: a.worldId,
    name: a.name,
    description: a.description,
    artist: a.artist,
    characterSrc: a.mainSrc,
    backgroundSrc: a.backgroundSrc,
    rarity: a.rarity,
    createdAt: a.createdAt,
});

export const materialToAsset = (m: Material): AssetItem => ({
    id: m.id,
    worldId: m.worldId,
    name: m.name,
    description: m.description,
    artist: m.artist,
    mainSrc: m.materialSrc,
    backgroundSrc: m.backgroundSrc,
    rarity: m.rarity,
    createdAt: m.createdAt,
});

export const assetToMaterial = (a: AssetItem): Material => ({
    id: a.id,
    worldId: a.worldId,
    name: a.name,
    description: a.description,
    artist: a.artist,
    materialSrc: a.mainSrc,
    backgroundSrc: a.backgroundSrc,
    rarity: a.rarity,
    createdAt: a.createdAt,
});

export const actionToAsset = (a: Action): AssetItem => ({
    id: a.id,
    worldId: a.worldId,
    name: a.name,
    description: a.description,
    artist: a.artist,
    mainSrc: a.actionSrc,
    backgroundSrc: a.backgroundSrc,
    rarity: a.rarity,
    createdAt: a.createdAt,
});

export const assetToAction = (a: AssetItem): Action => ({
    id: a.id,
    worldId: a.worldId,
    name: a.name,
    description: a.description,
    artist: a.artist,
    actionSrc: a.mainSrc,
    backgroundSrc: a.backgroundSrc,
    rarity: a.rarity,
    createdAt: a.createdAt,
});
