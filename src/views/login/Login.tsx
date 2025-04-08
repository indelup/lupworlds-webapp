import classes from "./Login.module.scss";
import env from "src/env";

export const Login = () => {
    const scope = "user:read:email";
    const responseType = "token";

    return (
        <div className={classes.background}>
            <a
                className={classes.button}
                href={`https://id.twitch.tv/oauth2/authorize?client_id=${env.VITE_TWITCH_CLIENT_ID}&redirect_uri=${env.VITE_TWITCH_REDIRECT_URI}&response_type=${responseType}&scope=${scope}`}
            >
                Log in with Twitch
            </a>
        </div>
    );
};
