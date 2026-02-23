import { Character } from "../../../types";
import classes from "./Characters.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CharacterForm } from "./CharacterForm";
import { CharacterDelete } from "./CharacterDelete";
import { CharacterCard } from "../../common/CharacterCard";
import { AppState, useStore } from "../../../hooks/useStore";
import { useCharacterClient } from "../../../hooks/useCharacterClient";

export const Characters = () => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeCharacter, setActiveCharacter] = useState<
        Character | undefined
    >();

    const { characters, isFetching: loading } = useCharacterClient(activeWorldId);

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setActiveCharacter(undefined);
                        setFormMode("create");
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
                            <Flex key={character.id} gap={8} vertical>
                                <CharacterCard character={character} />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        onClick={() => {
                                            setActiveCharacter(character);
                                            setFormMode("edit");
                                            setFormOpen(true);
                                        }}
                                        icon={<EditFilled />}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                        onClick={() => {
                                            setActiveCharacter(character);
                                            setDeleteOpen(true);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        );
                    })
                )}
            </div>
            {formOpen && (
                <CharacterForm
                    open={formOpen}
                    setOpen={setFormOpen}
                    mode={formMode}
                    onCharacterCreated={() => {
                        // React Query will automatically refetch when activeWorldId changes
                    }}
                    onClose={() => {
                        setActiveCharacter(undefined);
                    }}
                    existingCharacter={activeCharacter}
                />
            )}
            <CharacterDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                characterId={activeCharacter?.id || ""}
                onCharacterDeleted={() => {
                    // React Query will automatically refetch when activeWorldId changes
                    setActiveCharacter(undefined);
                }}
            />
        </>
    );
};
