import classes from "./Card.module.scss";
import Tilt from "react-parallax-tilt";
import { Material } from "@melda/lupworlds-types";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import env from "../../env";
import { isBase64 } from "../../utils/imageHelpers";

type MaterialCardProps = {
    material: Material;
    mainSrc?: string;
    bgSrc?: string;
};

export const MaterialCard = (props: MaterialCardProps) => {
    const { material } = props;
    const materialSrc = !material.materialSrc
        ? ""
        : isBase64(material.materialSrc)
          ? material.materialSrc
          : `${env.VITE_MATERIAL_BUCKET_URI}/${material.materialSrc}`;
    const backgroundSrc = !material.backgroundSrc
        ? ""
        : isBase64(material.backgroundSrc)
          ? material.backgroundSrc
          : `${env.VITE_MATERIAL_BUCKET_URI}/${material.backgroundSrc}`;

    const [mainLoaded, setMainLoaded] = useState(!materialSrc);
    const [bgLoaded, setBgLoaded] = useState(!backgroundSrc);

    useEffect(() => {
        setMainLoaded(!materialSrc);
        setBgLoaded(!backgroundSrc);
    }, [materialSrc, backgroundSrc]);

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
            <img src={materialSrc} className={classes.main} onLoad={() => setMainLoaded(true)} onError={() => setMainLoaded(true)} />
            <img src={backgroundSrc} className={classes.background} onLoad={() => setBgLoaded(true)} onError={() => setBgLoaded(true)} />
            <div className={classes.infoBackground}></div>
            <div className={classes.infoContainer}>
                {material.artist ? (
                    <div className={classes.artistText}>
                        Art: {material.artist}
                    </div>
                ) : (
                    <div></div>
                )}

                <div className={classes.info}>
                    <div className={classes.mainText}>{material.name}</div>
                    <Rate
                        className={classes.star}
                        value={material.rarity}
                        count={material.rarity}
                        disabled
                    />
                    <div>{material.description}</div>
                </div>
            </div>
        </Tilt>
    );
};
