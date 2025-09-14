import axios from "axios";
import env from "../env";
import { ROLE, TwitchData, User, Character, Material } from "../types";
import { UploadFile } from "antd";

export const getOrCreateUser = async (
    twitchData: TwitchData,
): Promise<User> => {
    const response = await axios
        .get(`${env.VITE_LUPWORLDS_API_URI}/users/${twitchData.id}`)
        .catch((e) => {
            return e.response;
        });

    if (response.status === 404) {
        return (
            await axios.post(`${env.VITE_LUPWORLDS_API_URI}}/users`, {
                twitchId: twitchData.id,
                alias: twitchData.name,
                allowedRoles: [ROLE.VIEWER],
                worldIds: [],
            })
        ).data.body as User;
    } else {
        return response.data;
    }
};

export const getPresignedUrl = async (
    fileName: string,
    contentType: string,
    bucketType: string,
): Promise<{ url: string; key: string }> => {
    const response = await axios.post(
        `${env.VITE_LUPWORLDS_API_URI}/${bucketType}/get-presigned-url`,
        {
            fileName,
            contentType,
        },
    );
    return response.data;
};

export const uploadImage = async (image: UploadFile, bucketType: string) => {
    const { url, key } = await getPresignedUrl(
        image.name || "character.jpg",
        image.type || "image/jpeg",
        bucketType,
    );

    await fetch(url, {
        method: "PUT",
        body: image as unknown as BodyInit,
        headers: {
            "Content-Type": image.type || "image/jpeg",
        },
    });

    return key;
};

// CHARACTERS
export const getCharacters = async (worldId: string): Promise<Character[]> => {
    const response = await axios.get(
        `${env.VITE_LUPWORLDS_API_URI}/characters?worldId=${worldId}`,
    );
    return response.data;
};

export const createCharacter = async (
    character: Omit<Character, "id">,
): Promise<Character> => {
    const response = await axios.post(
        `${env.VITE_LUPWORLDS_API_URI}/characters`,
        character,
    );
    return response.data;
};

export const deleteCharacter = async (characterId: string): Promise<void> => {
    const response = await axios.delete(
        `${env.VITE_LUPWORLDS_API_URI}/characters/${characterId}`,
    );
    return response.data;
};

// MATERIALS
export const getMaterials = async (worldId: string): Promise<Material[]> => {
    const response = await axios.get(
        `${env.VITE_LUPWORLDS_API_URI}/materials?worldId=${worldId}`,
    );
    return response.data;
};

export const createMaterial = async (
    material: Omit<Material, "id">,
): Promise<Material> => {
    const response = await axios.post(
        `${env.VITE_LUPWORLDS_API_URI}/materials`,
        material,
    );
    return response.data;
};

export const deleteMaterial = async (materialId: string): Promise<void> => {
    const response = await axios.delete(
        `${env.VITE_LUPWORLDS_API_URI}/materials/${materialId}`,
    );
    return response.data;
};
