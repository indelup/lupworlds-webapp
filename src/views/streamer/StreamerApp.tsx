import { useStore, AppState } from "src/hooks/useStore";
import classes from "./StreamerApp.module.scss";
import { useCheckUser } from "src/hooks/useCheckUser";
import { useState } from "react";
import { Characters } from "./Characters";
import { Materials } from "./Materials";
import { Banners } from "./Banners";
import { Stores } from "./Stores";

export const StreamerApp = () => {
    const user = useStore((state: AppState) => state.user);
    const [view, setView] = useState<string>("characters");

    const ActiveView = getActiveView(view);

    const changeActiveView = (newView: string) => {
        setView(newView);
    };

    useCheckUser();

    return (
        <div className={classes.background}>
            <div className={classes.sidebar}>
                <div className={classes.logo}>LOGO ACA</div>
                <div
                    className={classes.sidebarButton}
                    onClick={() => changeActiveView("characters")}
                >
                    PERSONAJES
                </div>
                <div
                    className={classes.sidebarButton}
                    onClick={() => changeActiveView("materials")}
                >
                    MATERIALES
                </div>
                <div
                    className={classes.sidebarButton}
                    onClick={() => changeActiveView("banners")}
                >
                    BANNERS
                </div>
                <div
                    className={classes.sidebarButton}
                    onClick={() => changeActiveView("stores")}
                >
                    TIENDAS
                </div>
            </div>
            <div className={classes.contentContainer}>
                <div className={classes.contentHeader}>
                    <div>Hola {user?.alias}</div>
                    <div>ESTA ES LA VISTA DE STREAMER</div>
                </div>
                <ActiveView />
            </div>
        </div>
    );
};

const getActiveView = (view: string) => {
    switch (view) {
        case "charaters":
            return Characters;
        case "materials":
            return Materials;
        case "banners":
            return Banners;
        case "stores":
            return Stores;
        default:
            return Characters;
    }
};
