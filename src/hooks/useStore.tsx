import { User, ROLE, Character, Material, TwitchData, World } from "@melda/lupworlds-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
    user?: User;
    setUser: (user?: User) => void;
    twitchData?: TwitchData;
    setTwitchData: (data: TwitchData) => void;
    role?: ROLE;
    setRole: (role: ROLE) => void;
    activeWorld: World | undefined;
    setActiveWorld: (world: World | undefined) => void;
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
            activeWorld: undefined,
            setActiveWorld: (activeWorld: World | undefined) => set({ activeWorld }),
            characters: [],
            setCharacters: (characters: Character[]) => set({ characters }),
            materials: [],
            setMaterials: (materials: Material[]) => set({ materials }),
        }),
        { name: "app-store" },
    ),
);
