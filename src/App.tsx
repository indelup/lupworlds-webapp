import axios from "axios";
import { useEffect } from "react";
import { ModeSelection } from "./views/mode/ModeSelection";
import env from "./env";
import { useStore, AppState } from "./hooks/useStore";
import { Mode, User } from "./types";

const App = () => {
    const user = useStore((state: AppState) => state.user);
    const setUser = useStore((state: AppState) => state.setUser);
    const mode = useStore((state: AppState) => state.mode);
    const setMode = useStore((state: AppState) => state.setMode);

    useEffect(() => {
        const parsedHash = new URLSearchParams(
            window.location.hash.substring(1)
        );
        const token = parsedHash.get('access_token');
        if (token) {
            axios.get('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': env.VITE_TWITCH_CLIENT_ID
                }
            }).then(response => {
                const data = response.data.data[0];
                const user: User = {
                    twitchId: data.id,
                    username: data.display_name,
                    allowedModes: [Mode.VIEWER],
                    twitchToken: token,
                    twitchName: data.display_name
                };
                setUser(user);
            });
            window.location.hash = '';
        }
    }, []);

    return (
        <>
            {!mode && <ModeSelection user={user} setMode={setMode} />}
            {mode === 'streamer' && <div>Acá ira la vista de streamer</div>}
            {mode === 'viewer' && <div>Acá ira la vista de viewer</div>}
        </>
    );
};

export default App;
