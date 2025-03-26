import axios from "axios";
import { useEffect, useState } from "react";
import { ModeSelection } from "./views/mode/ModeSelection";

const App = () => {
    const [user, setUser] = useState<any>(null);
    const [mode, setMode] = useState<string | null>(null);
    
    useEffect(() => {
        const parsedHash = new URLSearchParams(
            window.location.hash.substring(1)
        );
        const token = parsedHash.get('access_token');
        if (token) {
            axios.get('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': '449bzopcsj2s18cvhog08eabuecscn'
                }
            }).then(response => {
                setUser(response.data.data[0]);
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
