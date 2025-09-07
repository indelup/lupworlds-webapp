import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import classes from "./CharacterForm.module.scss";
import { deleteCharacter } from "../../../utils/lupworldsApi";

type CharacterDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    characterId: string;
    onCharacterDeleted?: () => void;
};

export const CharacterDelete = (props: CharacterDeleteProps) => {
    const { characterId } = props;
    const [deleting, setDeleting] = useState(false);

    const onDelete = async () => {
        try {
            setDeleting(true);
            await deleteCharacter(characterId);
            props.setOpen(false);
            props.onCharacterDeleted?.();
        } catch (error) {
            console.error("Error deleting character:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            open={props.open}
            title="Borrar Personaje"
            centered
            width={700}
            cancelText={"Cancelar"}
            okText={"Confirmar"}
            onCancel={() => {
                if (!deleting) props.setOpen(false);
            }}
            onOk={onDelete}
            okButtonProps={{ disabled: deleting, color: "danger" }}
            cancelButtonProps={{ disabled: deleting }}
        >
            <div className={`${deleting ? classes.blurred : ""}`}>
                <Flex className={classes.container} justify="center" gap={24}>
                    ¿Estás seguro de querer eliminar este personaje?
                </Flex>
            </div>
            {deleting && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Personaje" size="large" />
                </div>
            )}
        </Modal>
    );
};
