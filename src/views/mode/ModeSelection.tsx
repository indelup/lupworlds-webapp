import classes from './ModeSelection.module.scss';

type ModeSelectionProps = {
    user: any;
    setMode: (mode: string) => void;
};

export const ModeSelection = ({ user, setMode }: ModeSelectionProps) => {
    return (
        <div className={classes.background}>
            <div><h1>¡Hola {user?.display_name}!</h1></div>
            <div className={classes.buttonContainer}>
                <span className={classes.button} onClick={() => {
                    setMode('streamer');
                }}>Entrar como Streamer</span>
                <span className={classes.button} onClick={() => {
                    setMode('viewer');
                }}>Entrar como Viewer</span>
            </div>
        </div>
    );
};
