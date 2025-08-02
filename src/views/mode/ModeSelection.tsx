import { ROLE } from "../../types";
import classes from "./ModeSelection.module.scss";
import { useStore, AppState } from "../../hooks/useStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCheckUser } from "../../hooks/useCheckUser";

export const ModeSelection = () => {
    const user = useStore((state: AppState) => state.user);
    const role = useStore((state: AppState) => state.role);
    const setRole = useStore((state: AppState) => state.setRole);
    const navigate = useNavigate();

    useCheckUser();

    useEffect(() => {
        if (role === ROLE.STREAMER) {
            navigate("/streamer");
        }

        if (role === ROLE.VIEWER || user?.allowedRoles.length === 1) {
            console.log(user);
            setRole(ROLE.VIEWER);
            navigate("/viewer");
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
