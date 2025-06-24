import axios from "axios";
import env from "../env";
import { ROLE, TwitchData, User } from "../types";

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
