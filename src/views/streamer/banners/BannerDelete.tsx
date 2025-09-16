import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import classes from "./BannerDelete.module.scss";
import { deleteBanner } from "../../../utils/lupworldsApi";

type BannerDeleteProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    bannerId: string;
    onBannerDeleted?: () => void;
};

export const BannerDelete = (props: BannerDeleteProps) => {
    const { open, setOpen, bannerId, onBannerDeleted } = props;
    const [deleting, setDeleting] = useState(false);

    const onDelete = async () => {
        try {
            setDeleting(true);
            await deleteBanner(bannerId);
            setOpen(false);
            onBannerDeleted?.();
        } catch (error) {
            console.error("Error deleting banner:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Borrar Banner"
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
                    ¿Estás seguro de querer eliminar este banner?
                </Flex>
            </div>
            {deleting && (
                <div className={classes.spinner}>
                    <Spin tip="Borrando Banner" size="large" />
                </div>
            )}
        </Modal>
    );
};
