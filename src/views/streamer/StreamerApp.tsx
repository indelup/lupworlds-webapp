import { useStore, AppState } from "src/hooks/useStore";
import classes from "./StreamerApp.module.scss";
import { useCheckUser } from "src/hooks/useCheckUser";

export const StreamerApp = () => {
    const user = useStore((state: AppState) => state.user);

    useCheckUser();

    return (
        <div className={classes.background}>
            <div className={classes.sidebar}>
                <div className={classes.logo}> LOGO ACA </div>
                <div className={classes.sidebarButton}>PERSONAJES</div>
                <div className={classes.sidebarButton}>MATERIALES</div>
                <div className={classes.sidebarButton}>BANNERS</div>
                <div className={classes.sidebarButton}>TIENDA</div>
            </div>
            <div className={classes.contentContainer}>
                <div className={classes.contentHeader}>
                    <div>Hola {user?.alias}</div>
                    <div>ESTA ES LA VISTA DE STREAMER</div>
                </div>
            </div>
        </div>
    );
};
