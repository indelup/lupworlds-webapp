import { ROLE } from "src/types";
import classes from "./ModeSelection.module.scss";

type ModeSelectionProps = {
    user: any;
    setRole: (role: ROLE) => void;
};

export const ModeSelection = ({ user, setRole }: ModeSelectionProps) => {
    return (
        <div className={classes.background}>
            <div>
                <h1>¡Hola {user?.display_name}!</h1>
            </div>
            <div className={classes.buttonContainer}>
                <span
                    className={classes.button}
                    onClick={() => {
                        setRole(ROLE.STREAMER);
                    }}
                >
                    Entrar como Streamer
                </span>
                <span
                    className={classes.button}
                    onClick={() => {
                        setRole(ROLE.VIEWER);
                    }}
                >
                    Entrar como Viewer
                </span>
            </div>
        </div>
    );
};
