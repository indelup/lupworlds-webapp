import { AssetConfig } from "./assetTypes";
import { AppState, useStore } from "../../../hooks/useStore";
import { useCharacterClient } from "../../../hooks/useCharacterClient";
import { useMaterialClient } from "../../../hooks/useMaterialClient";
import { useActionClient } from "../../../hooks/useActionClient";
import {
    characterToAsset,
    assetToCharacter,
    materialToAsset,
    assetToMaterial,
    actionToAsset,
    assetToAction,
} from "./assetMappers";
import env from "../../../env";

export const useCharacterConfig = (): AssetConfig => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { characters, isFetching, createCharacter, updateCharacter, deleteCharacter, fetchCharacters } =
        useCharacterClient(activeWorld?.id ?? "");

    return {
        items: characters.map(characterToAsset),
        isFetching,
        bucketUri: env.VITE_ASSET_BUCKET_URI,
        bucketType: "characters",
        create: async (item) => {
            const { id: _id, ...rest } = assetToCharacter({ ...item, id: "" });
            const result = await createCharacter(rest);
            return characterToAsset(result);
        },
        update: async (item) => {
            const result = await updateCharacter(assetToCharacter(item));
            return characterToAsset(result);
        },
        delete: deleteCharacter,
        fetch: fetchCharacters,
        labels: {
            singular: "Personaje",
            mainImageLabel: "Imagen Personaje",
        },
    };
};

export const useMaterialConfig = (): AssetConfig => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { materials, isFetching, createMaterial, updateMaterial, deleteMaterial, fetchMaterials } =
        useMaterialClient(activeWorld?.id ?? "");

    return {
        items: materials.map(materialToAsset),
        isFetching,
        bucketUri: env.VITE_ASSET_BUCKET_URI,
        bucketType: "materials",
        create: async (item) => {
            const { id: _id, ...rest } = assetToMaterial({ ...item, id: "" });
            const result = await createMaterial(rest);
            return materialToAsset(result);
        },
        update: async (item) => {
            const result = await updateMaterial(assetToMaterial(item));
            return materialToAsset(result);
        },
        delete: deleteMaterial,
        fetch: fetchMaterials,
        labels: {
            singular: "Material",
            mainImageLabel: "Imagen Material",
        },
    };
};

export const useActionConfig = (): AssetConfig => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { actions, isFetching, createAction, updateAction, deleteAction, fetchActions } =
        useActionClient(activeWorld?.id ?? "");

    return {
        items: actions.map(actionToAsset),
        isFetching,
        bucketUri: env.VITE_ASSET_BUCKET_URI,
        bucketType: "actions",
        create: async (item) => {
            const { id: _id, ...rest } = assetToAction({ ...item, id: "" });
            const result = await createAction(rest);
            return actionToAsset(result);
        },
        update: async (item) => {
            const result = await updateAction(assetToAction(item));
            return actionToAsset(result);
        },
        delete: deleteAction,
        fetch: fetchActions,
        labels: {
            singular: "Acción",
            mainImageLabel: "Imagen Acción",
        },
    };
};
