import { Character } from "../../../types";
import classes from "./Characters.module.scss";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CharacterForm } from "./CharacterForm";
import { CharacterCard } from "../../common/CharacterCard";

export const Characters = () => {
    // TODO - This should fetch characters from the API
    const [formOpen, setFormOpen] = useState(false);
    const characters: Character[] = getCharacters();

    return (
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
                        <CharacterCard
                            character={character}
                            key={character.name}
                        />
                    );
                })}
            </div>
            <Modal
                open={formOpen}
                title="New Character"
                centered
                width={700}
                onCancel={() => setFormOpen(false)}
            >
                <CharacterForm />
            </Modal>
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
            name: "Otro 2",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
    ];
};
