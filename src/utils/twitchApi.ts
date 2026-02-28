import axios from "axios";
import env from "../env";

export interface TwitchReward {
    id: string;
    title: string;
}

export const getChannelRedeems = async (
    broadcasterId: string,
    token: string,
): Promise<TwitchReward[]> => {
    const response = await axios.get(
        "https://api.twitch.tv/helix/channel_points/custom_rewards",
        {
            params: { broadcaster_id: broadcasterId },
            headers: {
                Authorization: `Bearer ${token}`,
                "Client-Id": env.VITE_TWITCH_CLIENT_ID,
            },
        },
    );
    return response.data.data;
};
