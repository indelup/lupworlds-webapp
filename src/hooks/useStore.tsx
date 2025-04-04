import { User, Role, World, Character, Material } from "src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
    user?: User,
    setUser: (user?: User) => void,
    role: Role,
    setRole: (role: Role) => void,
    world: World,
    setWorld: (world: World) => void,
    characters: Character[],
    setCharacters: (characters: Character[]) => void,
    materials: Material[],
    setMaterials: (materials: Material[]) => void,
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user?: User) => set({ user }),
            role: Role.VIEWER,
            setRole: (role: Role) => set({ role }),
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
        { name: "app-store" }
    )
);
