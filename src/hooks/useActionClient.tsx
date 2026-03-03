import { useMutation, useQuery } from "@tanstack/react-query";
import { Action } from "@melda/lupworlds-types";
import {
    getActions,
    createAction,
    updateAction,
    deleteAction,
} from "../utils";

export const useActionClient = (worldId: string) => {
    const actionsQuery = useQuery<Action[]>({
        queryKey: ["actions", worldId],
        queryFn: () => getActions(worldId),
        enabled: !!worldId,
    });

    const createMutation = useMutation({
        mutationFn: (action: Omit<Action, "id">) => createAction(action),
        onSuccess: () => {
            actionsQuery.refetch();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (action: Action) => updateAction(action),
        onSuccess: () => {
            actionsQuery.refetch();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (actionId: string) => deleteAction(actionId),
        onSuccess: () => {
            actionsQuery.refetch();
        },
    });

    return {
        actions: (actionsQuery.data ?? []).slice().sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()),
        isFetching: actionsQuery.isFetching,
        fetchActions: actionsQuery.refetch,
        createAction: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateAction: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteAction: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
