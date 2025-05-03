import axios from "axios";
import env from "../env";
import { TwitchData } from "../types";

export const fetchTwitchData = async (token: string): Promise<TwitchData> => {
    const response = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Client-ID": env.VITE_TWITCH_CLIENT_ID,
        },
    });
    const data = response.data.data[0];

    return {
        id: data.id,
        token: token,
        name: data.display_name,
    };
};
