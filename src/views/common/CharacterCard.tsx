import classes from "./CharacterCard.module.scss";
import Tilt from "react-parallax-tilt";
import { Character } from "../../types";

type CharacterCardProps = {
    character: Character;
};

export const CharacterCard = (props: CharacterCardProps) => {
    const { character } = props;

    return (
        <Tilt
            className={classes.card}
            tiltReverse
            glareEnable
            glareColor="white"
            glarePosition="all"
            glareBorderRadius="0.5rem"
            glareMaxOpacity={0.2}
        >
            <div>{character.name}</div>
        </Tilt>
    );
};
