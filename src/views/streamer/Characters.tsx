import { Character } from "src/types";
import classes from "./Characters.module.scss";
import Tilt from "react-parallax-tilt";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const Characters = () => {
    // TODO - This should fetch characters from the API
    const characters: Character[] = [
        {
            id: "testCharacter",
            worldId: "Indelup",
            name: "Melda",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
        {
            id: "testCharacter",
            worldId: "Indelup",
            name: "Vani",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
        {
            id: "testCharacter",
            worldId: "Indelup",
            name: "Afie",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
        {
            id: "testCharacter",
            worldId: "Indelup",
            name: "Otro",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
    ];

    // TODO: DISPLAY CHARACTERS
    // TODO: ADD CREATE CHARACTER BUTTON
    // TODO: USE API INSTEAD OF TEST DATA

    return (
        <>
            <div className={classes.actions}>
                <Button icon={<PlusOutlined />} color="cyan" variant="solid">
                    New Character
                </Button>
            </div>
            <div className={classes.cardList}>
                {characters.map((character) => {
                    return (
                        <Tilt
                            tiltReverse
                            glareEnable
                            glareColor="white"
                            glarePosition="all"
                            glareBorderRadius="0.5rem"
                            glareMaxOpacity={0.2}
                        >
                            <div className={classes.card}>{character.name}</div>
                        </Tilt>
                    );
                })}
            </div>
        </>
    );
};
