import { Flex, Modal, Spin } from "antd";
import classes from "./CharacterForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { useCharacterClient } from "../../../hooks/useCharacterClient";

type CharacterDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    characterId: string;
    onCharacterDeleted?: () => void;
};

export const CharacterDelete = (props: CharacterDeleteProps) => {
    const { characterId } = props;
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { deleteCharacter, isDeleting } = useCharacterClient(activeWorld?.id ?? "");

    const onDelete = async () => {
        try {
            await deleteCharacter(characterId);
            props.setOpen(false);
            props.onCharacterDeleted?.();
        } catch (error) {
            console.error("Error deleting character:", error);
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
                if (!isDeleting) props.setOpen(false);
            }}
            onOk={onDelete}
            okButtonProps={{ disabled: isDeleting, color: "danger" }}
            cancelButtonProps={{ disabled: isDeleting }}
        >
            <div className={`${isDeleting ? classes.blurred : ""}`}>
                <Flex className={classes.container} justify="center" gap={24}>
                    ¿Estás seguro de querer eliminar este personaje?
                </Flex>
            </div>
            {isDeleting && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Personaje" size="large" />
                </div>
            )}
        </Modal>
    );
};
