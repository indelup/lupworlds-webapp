import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import classes from "./AssetForm.module.scss";
import { AssetConfig } from "./assetTypes";

type AssetDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    itemId: string;
    onDeleted?: () => void;
    config: AssetConfig;
};

export const AssetDelete = ({ open, setOpen, itemId, onDeleted, config }: AssetDeleteProps) => {
    const [deleting, setDeleting] = useState(false);

    const onDelete = async () => {
        try {
            setDeleting(true);
            await config.delete(itemId);
            setOpen(false);
            onDeleted?.();
        } catch (error) {
            console.error("Error deleting asset:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`Borrar ${config.labels.singular}`}
            centered
            width={700}
            cancelText={"Cancelar"}
            okText={"Confirmar"}
            onCancel={() => {
                if (!deleting) setOpen(false);
            }}
            onOk={onDelete}
            okButtonProps={{ disabled: deleting, color: "danger" }}
            cancelButtonProps={{ disabled: deleting }}
        >
            <div className={`${deleting ? classes.blurred : ""}`}>
                <Flex className={classes.container} justify="center" gap={24}>
                    ¿Estás seguro de querer eliminar este {config.labels.singular.toLowerCase()}?
                </Flex>
            </div>
            {deleting && (
                <div className={classes.spinner}>
                    <Spin tip={`Borrando ${config.labels.singular}`} size="large" />
                </div>
            )}
        </Modal>
    );
};
