import classes from './Login.module.scss';

export const Login = () => {

    const scope = 'user:read:email';
    const redirectUri = 'http://localhost:8080?';
    const clientId = '449bzopcsj2s18cvhog08eabuecscn';
    const responseType = 'token';

    return (
        <div className={classes.background}>
            <a className={classes.button} href={`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}>Log in with Twitch</a>
        </div>
    );
};

