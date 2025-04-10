import { ROLE } from "src/types";
import classes from "./ModeSelection.module.scss";
import { useStore, AppState } from "src/hooks/useStore";
import { useEffect } from "react";
import { redirect } from "react-router";

export const ModeSelection = () => {
    const user = useStore((state: AppState) => state.user);
    const role = useStore((state: AppState) => state.role);
    const setRole = useStore((state: AppState) => state.setRole);

    useEffect(() => {
        if (role === ROLE.STREAMER) {
            redirect("streamer");
        }

        if (role === ROLE.VIEWER) {
            redirect("viewer");
        }
    }, [role]);

    return (
        <div className={classes.background}>
            <div>
                <h1>¡Hola {user?.alias}!</h1>
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
