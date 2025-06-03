import { Flex, Input, Rate, Modal } from "antd";
import { CharacterCard } from "../../common/CharacterCard";
import { Character } from "../../../types";
import { useState } from "react";
import classes from "./CharacterForm.module.scss";

type CharacterFormProps = {};

export const CharacterForm = (props: CharacterFormProps) => {
    const [character, setCharacter] = useState<Character>({
        id: "test",
        worldId: "test",
        name: "test",
        description: "test",
        frontImage: "test",
        backImage: "test",
        rarity: 1,
    });
    return (
        <Flex className={classes.container} justify="center" gap={24}>
            <Flex
                className={classes.cardColumn}
                align="center"
                justify="center"
            >
                <CharacterCard character={character} />
            </Flex>
            <Flex
                className={classes.formColumn}
                vertical
                gap={12}
                justify="center"
            >
                <Input
                    placeholder="Name"
                    onChange={(e) => {
                        const name = e.target.value;
                        setCharacter({ ...character, name: name });
                    }}
                />
                <Input.TextArea placeholder="Description" />
                <Rate />
            </Flex>
        </Flex>
    );
};
