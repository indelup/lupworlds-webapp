import { Mode } from "src/types";
import classes from "./ModeSelection.module.scss";

type ModeSelectionProps = {
    user: any;
    setMode: (mode: Mode) => void;
};

export const ModeSelection = ({ user, setMode }: ModeSelectionProps) => {
    return (
        <div className={classes.background}>
            <div>
                <h1>¡Hola {user?.display_name}!</h1>
            </div>
            <div className={classes.buttonContainer}>
                <span
                    className={classes.button}
                    onClick={() => {
                        setMode(Mode.STREAMER);
                    }}
                >
                    Entrar como Streamer
                </span>
                <span
                    className={classes.button}
                    onClick={() => {
                        setMode(Mode.VIEWER);
                    }}
                >
                    Entrar como Viewer
                </span>
            </div>
        </div>
    );
};
