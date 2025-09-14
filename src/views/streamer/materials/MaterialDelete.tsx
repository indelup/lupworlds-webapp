import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import classes from "./MaterialForm.module.scss";
import { deleteMaterial } from "../../../utils/lupworldsApi";

type MaterialDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    materialId: string;
    onMaterialDeleted?: () => void;
};

export const MaterialDelete = (props: MaterialDeleteProps) => {
    const { open, setOpen, materialId, onMaterialDeleted } = props;
    const [deleting, setDeleting] = useState(false);

    const onDelete = async () => {
        try {
            setDeleting(true);
            await deleteMaterial(materialId);
            setOpen(false);
            onMaterialDeleted?.();
        } catch (error) {
            console.error("Error deleting material:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Borrar Material"
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
                    ¿Estás seguro de querer eliminar este material?
                </Flex>
            </div>
            {deleting && (
                <div className={classes.spinner}>
                    <Spin tip="Borrando Material" size="large" />
                </div>
            )}
        </Modal>
    );
};
