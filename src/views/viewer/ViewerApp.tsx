import { useStore, AppState } from "../../hooks/useStore";
import classes from "./ViewerApp.module.scss";
import { useCheckUser } from "../../hooks/useCheckUser";

export const ViewerApp = () => {
    const user = useStore((state: AppState) => state.user);

    useCheckUser();

    return (
        <div className={classes.background}>
            <div>Hola {user?.alias}</div>
            <div>ESTA ES LA VISTA DE VIEWER</div>
        </div>
    );
};
