import { Flex, Modal, Spin } from "antd";
import classes from "./ActionForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { useActionClient } from "../../../hooks/useActionClient";

type ActionDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    actionId: string;
    onActionDeleted?: () => void;
};

export const ActionDelete = (props: ActionDeleteProps) => {
    const { actionId } = props;
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { deleteAction, isDeleting } = useActionClient(activeWorld?.id ?? "");

    const onDelete = async () => {
        try {
            await deleteAction(actionId);
            props.setOpen(false);
            props.onActionDeleted?.();
        } catch (error) {
            console.error("Error deleting action:", error);
        }
    };

    return (
        <Modal
            open={props.open}
            title="Borrar Acción"
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
                    ¿Estás seguro de querer eliminar esta acción?
                </Flex>
            </div>
            {isDeleting && (
                <div className={classes.spinner}>
                    <Spin tip="Borrando Acción" size="large" />
                </div>
            )}
        </Modal>
    );
};
