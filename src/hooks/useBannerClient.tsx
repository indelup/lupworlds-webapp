import { useMutation, useQuery } from "@tanstack/react-query";
import { Banner } from "../types";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../utils";

export const useBannerClient = (worldId: string) => {
    const bannersQuery = useQuery<Banner[]>({
        queryKey: ["banners", worldId],
        queryFn: () => getBanners(worldId),
        enabled: !!worldId,
    });

    const createMutation = useMutation({
        mutationFn: (banner: Omit<Banner, "id">) => createBanner(banner),
        onSuccess: () => {
            bannersQuery.refetch();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (banner: Banner) => updateBanner(banner),
        onSuccess: () => {
            bannersQuery.refetch();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (bannerId: string) => deleteBanner(bannerId),
        onSuccess: () => {
            bannersQuery.refetch();
        },
    });

    return {
        banners: (bannersQuery.data ?? []).slice().sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()),
        isFetching: bannersQuery.isFetching,
        fetchBanners: bannersQuery.refetch,
        createBanner: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateBanner: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteBanner: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
