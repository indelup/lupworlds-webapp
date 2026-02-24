import classes from "./Card.module.scss";
import Tilt from "react-parallax-tilt";
import { Material } from "@melda/lupworlds-types";
import { Rate } from "antd";
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
            <img src={materialSrc} className={classes.main} />
            <img src={backgroundSrc} className={classes.background} />
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
