import { Character } from "src/types";
import classes from "./Characters.module.scss";
import Tilt from "react-parallax-tilt";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CharacterForm } from "./CharacterForm";

export const Characters = () => {
    // TODO - This should fetch characters from the API
    const [formOpen, setFormOpen] = useState(false);
    const characters: Character[] = getCharacters();

    return formOpen ? (
        <CharacterForm
            onClose={() => {
                setFormOpen(false);
            }}
        />
    ) : (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setFormOpen(true);
                    }}
                >
                    New Character
                </Button>
            </div>
            <div className={classes.cardList}>
                {characters.map((character) => {
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
                })}
            </div>
        </>
    );
};

const getCharacters = (): Character[] => {
    return [
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
};
