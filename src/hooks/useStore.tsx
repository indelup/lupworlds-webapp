import { User, ROLE, World, Character, Material, TwitchData } from "../types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
    user?: User;
    setUser: (user?: User) => void;
    twitchData?: TwitchData;
    setTwitchData: (data: TwitchData) => void;
    role?: ROLE;
    setRole: (role: ROLE) => void;
    world: World;
    setWorld: (world: World) => void;
    characters: Character[];
    setCharacters: (characters: Character[]) => void;
    materials: Material[];
    setMaterials: (materials: Material[]) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user?: User) => set({ user }),
            twitchData: undefined,
            setTwitchData: (twitchData?: TwitchData) => set({ twitchData }),
            role: undefined,
            setRole: (role: ROLE) => set({ role }),
            world: {
                id: "",
                streamerIds: [],
                maxRarity: 0,
            },
            setWorld: (world: World) => set({ world }),
            characters: [],
            setCharacters: (characters: Character[]) => set({ characters }),
            materials: [],
            setMaterials: (materials: Material[]) => set({ materials }),
        }),
        { name: "app-store" },
    ),
);
