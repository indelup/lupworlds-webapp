import classes from "./CharacterCard.module.scss";
import Tilt from "react-parallax-tilt";
import { Character } from "../../types";
import { Rate } from "antd";
import env from "../../env";

type CharacterCardProps = {
    character: Character;
    isPreview?: boolean;
    mainSrc?: string;
    bgSrc?: string;
};

export const CharacterCard = (props: CharacterCardProps) => {
    const { character } = props;
    const characterSrc = props.isPreview
        ? character.characterSrc
        : `${env.VITE_BUCKET_URI}/${character.characterSrc}`;
    const backgroundSrc = props.isPreview
        ? character.backgroundSrc
        : `${env.VITE_BUCKET_URI}/${character.backgroundSrc}`;

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
            <img src={characterSrc} className={classes.main} />
            <img src={backgroundSrc} className={classes.background} />
            <div className={classes.infoBackground}></div>
            <div className={classes.infoContainer}>
                {character.artist ? (
                    <div className={classes.artistText}>
                        Art: {character.artist}
                    </div>
                ) : (
                    <div></div>
                )}

                <div className={classes.info}>
                    <div className={classes.mainText}>{character.name}</div>
                    <Rate
                        className={classes.star}
                        value={character.rarity}
                        count={character.rarity}
                        disabled
                    />
                    <div>{character.description}</div>
                </div>
            </div>
        </Tilt>
    );
};
