import { useEffect } from "react";
import { useStore, AppState } from "./hooks/useStore";
import { useNavigate } from "react-router";
import { fetchTwitchData, fetchUser } from "./utils";

const App = () => {
    const twitchData = useStore((state: AppState) => state.twitchData);
    const setTwitchData = useStore((state: AppState) => state.setTwitchData);
    const user = useStore((state: AppState) => state.user);
    const setUser = useStore((state: AppState) => state.setUser);

    const navigate = useNavigate();

    useEffect(() => {
        const parsedHash = new URLSearchParams(
            window.location.hash.substring(1),
        );
        const token = parsedHash.get("access_token");

        if (!token && !twitchData) {
            navigate("/login");
        }

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
            navigate("/mode");
        }
    }, [user]);

    return <>Cargando...</>;
};

export default App;
