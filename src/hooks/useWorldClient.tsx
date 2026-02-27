import { useMutation, useQuery } from "@tanstack/react-query";
import { World } from "@melda/lupworlds-types";
import { getWorld, updateWorld } from "../utils";

export const useWorldClient = (worldId: string) => {
    const worldQuery = useQuery<World>({
        queryKey: ["world", worldId],
        queryFn: () => getWorld(worldId),
        enabled: !!worldId,
    });

    const updateMutation = useMutation({
        mutationFn: (world: World) => updateWorld(world),
        onSuccess: () => {
            worldQuery.refetch();
        },
    });

    return {
        world: worldQuery.data,
        isFetching: worldQuery.isFetching,
        fetchWorld: worldQuery.refetch,
        updateWorld: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
};
