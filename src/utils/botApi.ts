import env from "../env";

const BOT_URI = env.VITE_BOT_URI as string;

export const getBotStatus = async (channelId: string): Promise<boolean> => {
    try {
        const res = await fetch(`${BOT_URI}/status?channelId=${channelId}`);
        if (!res.ok) return false;
        const data = await res.json();
        return data.active as boolean;
    } catch {
        return false;
    }
};

export const startBot = async (channelId: string, streamerToken: string): Promise<void> => {
    const res = await fetch(
        `${BOT_URI}/start?channelId=${channelId}&streamerToken=${streamerToken}`,
    );
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }
};

export const stopBot = async (channelId: string): Promise<void> => {
    const res = await fetch(`${BOT_URI}/stop?channelId=${channelId}`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }
};
