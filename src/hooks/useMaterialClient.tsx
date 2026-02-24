import { useMutation, useQuery } from "@tanstack/react-query";
import { Material } from "../types";
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from "../utils";

export const useMaterialClient = (worldId: string) => {
    const materialsQuery = useQuery<Material[]>({
        queryKey: ["materials", worldId],
        queryFn: () => getMaterials(worldId),
        enabled: !!worldId,
    });

    const createMutation = useMutation({
        mutationFn: (material: Omit<Material, "id">) => createMaterial(material),
        onSuccess: () => {
            materialsQuery.refetch();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (material: Material) => updateMaterial(material),
        onSuccess: () => {
            materialsQuery.refetch();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (materialId: string) => deleteMaterial(materialId),
        onSuccess: () => {
            materialsQuery.refetch();
        },
    });

    return {
        materials: (materialsQuery.data ?? []).slice().sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()),
        isFetching: materialsQuery.isFetching,
        fetchMaterials: materialsQuery.refetch,
        createMaterial: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateMaterial: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteMaterial: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
