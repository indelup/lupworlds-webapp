import { useMutation, useQuery } from "@tanstack/react-query";
import { Character } from "../types";
import {
    getCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
} from "../utils";

export const useCharacterClient = (worldId: string) => {
    const charactersQuery = useQuery<Character[]>({
        queryKey: ["characters", worldId],
        queryFn: () => getCharacters(worldId),
        enabled: !!worldId,
    });

    const createMutation = useMutation({
        mutationFn: (character: Omit<Character, "id">) =>
            createCharacter(character),
        onSuccess: () => {
            charactersQuery.refetch();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (character: Character) => updateCharacter(character),
        onSuccess: () => {
            charactersQuery.refetch();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (characterId: string) => deleteCharacter(characterId),
        onSuccess: () => {
            charactersQuery.refetch();
        },
    });

    return {
        characters: (charactersQuery.data ?? []).slice().sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()),
        isFetching: charactersQuery.isFetching,
        fetchCharacters: charactersQuery.refetch,
        createCharacter: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateCharacter: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteCharacter: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
