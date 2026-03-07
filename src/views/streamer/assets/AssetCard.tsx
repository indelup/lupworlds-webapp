import classes from "../../common/Card.module.scss";
import Tilt from "react-parallax-tilt";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import { isBase64 } from "../../../utils/imageHelpers";
import { AssetItem } from "./assetTypes";

type AssetCardProps = {
    item: AssetItem;
    bucketUri: string;
};

export const AssetCard = ({ item, bucketUri }: AssetCardProps) => {
    const mainSrc = !item.mainSrc
        ? ""
        : isBase64(item.mainSrc)
          ? item.mainSrc
          : `${bucketUri}/${item.mainSrc}`;
    const backgroundSrc = !item.backgroundSrc
        ? ""
        : isBase64(item.backgroundSrc)
          ? item.backgroundSrc
          : `${bucketUri}/${item.backgroundSrc}`;

    const [mainLoaded, setMainLoaded] = useState(!mainSrc);
    const [bgLoaded, setBgLoaded] = useState(!backgroundSrc);

    useEffect(() => {
        setMainLoaded(!mainSrc);
    }, [mainSrc]);

    useEffect(() => {
        setBgLoaded(!backgroundSrc);
    }, [backgroundSrc]);

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
            <img src={mainSrc} className={classes.main} onLoad={() => setMainLoaded(true)} onError={() => setMainLoaded(true)} />
            <img src={backgroundSrc} className={classes.background} onLoad={() => setBgLoaded(true)} onError={() => setBgLoaded(true)} />
            <div className={classes.infoBackground}></div>
            <div className={classes.infoContainer}>
                {item.artist ? (
                    <div className={classes.artistText}>
                        Art: {item.artist}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className={classes.info}>
                    <div className={classes.mainText}>{item.name}</div>
                    <Rate
                        className={classes.star}
                        value={item.rarity}
                        count={item.rarity}
                        disabled
                    />
                    <div>{item.description}</div>
                </div>
            </div>
        </Tilt>
    );
};
