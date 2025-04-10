import axios from "axios";
import { useEffect } from "react";
import env from "src/env";
import { useStore, AppState } from "src/hooks/useStore";
import { redirect } from "react-router";
import { ROLE, TwitchData } from "./types";

const App = () => {
    const twitchData = useStore((state: AppState) => state.twitchData);
    const setTwitchData = useStore((state: AppState) => state.setTwitchData);
    const user = useStore((state: AppState) => state.user);
    const setUser = useStore((state: AppState) => state.setUser);

    useEffect(() => {
        const parsedHash = new URLSearchParams(
            window.location.hash.substring(1),
        );
        const token = parsedHash.get("access_token");

        if (token && !twitchData) {
            fetchTwitchData(token).then((data) => {
                setTwitchData(data);
            });
        }
    }, []);

    useEffect(() => {
        if (twitchData && !user) {
            const user = fetchUser(twitchData.id);
            setUser(user);
        }
    }, [twitchData]);

    useEffect(() => {
        if (user) {
            redirect("mode");
        }
    }, [user]);

    return <>Cargando...</>;
};

const fetchTwitchData = async (token: string): Promise<TwitchData> => {
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

const fetchUser = (twitchId: string) => {
    // Dummy data because we have no API
    const user = {
        id: "fake-id",
        twitchId: twitchId,
        alias: "Meldarion",
        allowedRoles: [ROLE.STREAMER, ROLE.VIEWER],
        worldIds: ["Indelup"],
    };

    return user;
};

export default App;
