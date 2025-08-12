import { Character } from "../../../types";
import classes from "./Characters.module.scss";
import { Button, Flex } from "antd";
import {
    DeleteFilled,
    EditFilled,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { CharacterForm } from "./CharacterForm";
import { CharacterCard } from "../../common/CharacterCard";
import { getCharacters } from "../../../utils";
import { AppState, useStore } from "../../../hooks/useStore";

export const Characters = () => {
    const user = useStore((state: AppState) => state.user);
    const activeWorldId = user?.worldIds[0] || "";
    const [formOpen, setFormOpen] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            if (!activeWorldId) {
                setCharacters([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedCharacters = await getCharacters(activeWorldId);
                setCharacters(fetchedCharacters);
            } catch (error) {
                console.error("Error fetching characters:", error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [activeWorldId]);

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
                {loading ? (
                    <div>Loading characters...</div>
                ) : characters.length === 0 ? (
                    <div>No characters found for this world.</div>
                ) : (
                    characters.map((character) => {
                        return (
                            <Flex gap={8} vertical>
                                <CharacterCard
                                    character={character}
                                    key={character.id}
                                />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditFilled />}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                    />
                                </Flex>
                            </Flex>
                        );
                    })
                )}
            </div>
            <CharacterForm
                open={formOpen}
                setOpen={setFormOpen}
                onCharacterCreated={() => {
                    // Refresh characters list when a new character is created
                    const fetchCharacters = async () => {
                        if (activeWorldId) {
                            try {
                                const fetchedCharacters =
                                    await getCharacters(activeWorldId);
                                setCharacters(fetchedCharacters);
                            } catch (error) {
                                console.error(
                                    "Error refreshing characters:",
                                    error,
                                );
                            }
                        }
                    };
                    fetchCharacters();
                }}
            />
        </>
    );
};
