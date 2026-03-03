import classes from "./Card.module.scss";
import Tilt from "react-parallax-tilt";
import { Action } from "@melda/lupworlds-types";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import env from "../../env";
import { isBase64 } from "../../utils/imageHelpers";

type ActionCardProps = {
    action: Action;
    mainSrc?: string;
    bgSrc?: string;
};

export const ActionCard = (props: ActionCardProps) => {
    const { action } = props;
    const actionSrc = !action.actionSrc
        ? ""
        : isBase64(action.actionSrc)
          ? action.actionSrc
          : `${env.VITE_ACTION_BUCKET_URI}/${action.actionSrc}`;
    const backgroundSrc = !action.backgroundSrc
        ? ""
        : isBase64(action.backgroundSrc)
          ? action.backgroundSrc
          : `${env.VITE_ACTION_BUCKET_URI}/${action.backgroundSrc}`;

    const [mainLoaded, setMainLoaded] = useState(!actionSrc);
    const [bgLoaded, setBgLoaded] = useState(!backgroundSrc);

    useEffect(() => {
        setMainLoaded(!actionSrc);
        setBgLoaded(!backgroundSrc);
    }, [actionSrc, backgroundSrc]);

    const loaded = mainLoaded && bgLoaded;

    return (
        <Tilt
            className={classes.card}
            tiltReverse
            glareEnable
            glareColor="white"
            glarePosition="all"
            glareBorderRadius="0.5rem"
            glareMaxOpacity={0.15}
        >
            <div className={`${classes.shimmer} ${loaded ? classes.hidden : ""}`} />
            <img src={actionSrc} className={classes.main} onLoad={() => setMainLoaded(true)} onError={() => setMainLoaded(true)} />
            <img src={backgroundSrc} className={classes.background} onLoad={() => setBgLoaded(true)} onError={() => setBgLoaded(true)} />
            <div className={classes.infoBackground}></div>
            <div className={classes.infoContainer}>
                {action.artist ? (
                    <div className={classes.artistText}>
                        Art: {action.artist}
                    </div>
                ) : (
                    <div></div>
                )}

                <div className={classes.info}>
                    <div className={classes.mainText}>{action.name}</div>
                    <Rate
                        className={classes.star}
                        value={action.rarity}
                        count={action.rarity}
                        disabled
                    />
                    <div>{action.description}</div>
                </div>
            </div>
        </Tilt>
    );
};
