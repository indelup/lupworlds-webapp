import { Flex, Modal, Spin } from "antd";
import classes from "./MaterialForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { useMaterialClient } from "../../../hooks/useMaterialClient";

type MaterialDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    materialId: string;
    onMaterialDeleted?: () => void;
};

export const MaterialDelete = (props: MaterialDeleteProps) => {
    const { materialId } = props;
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { deleteMaterial, isDeleting } = useMaterialClient(activeWorld?.id ?? "");

    const onDelete = async () => {
        try {
            await deleteMaterial(materialId);
            props.setOpen(false);
            props.onMaterialDeleted?.();
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    return (
        <Modal
            open={props.open}
            title="Borrar Material"
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
                    ¿Estás seguro de querer eliminar este material?
                </Flex>
            </div>
            {isDeleting && (
                <div className={classes.spinner}>
                    <Spin tip="Borrando Material" size="large" />
                </div>
            )}
        </Modal>
    );
};
