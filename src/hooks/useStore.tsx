import { User, Mode, World, Character, Materials } from "src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
    user?: User,
    setUser: (user?: User) => void,
    mode: Mode,
    setMode: (mode: Mode) => void,
    world: World,
    setWorld: (world: World) => void,
    characters: Character[],
    setCharacters: (characters: Character[]) => void,
    materials: Materials[],
    setMaterials: (materials: Materials[]) => void,
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user?: User) => set({ user }),
            mode: Mode.VIEWER,
            setMode: (mode: Mode) => set({ mode }),
            world: {
                streamer_id: "",
            },
            setWorld: (world: World) => set({ world }),
            characters: [],
            setCharacters: (characters: Character[]) => set({ characters }),
            materials: [],
            setMaterials: (materials: Materials[]) => set({ materials }),
        }),
        { name: "app-store" }
    )
);
