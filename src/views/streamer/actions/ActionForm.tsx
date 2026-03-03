import {
    Button,
    Flex,
    Input,
    Rate,
    Upload,
    UploadFile,
    Modal,
    Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ActionCard } from "../../common/ActionCard";
import { Action } from "@melda/lupworlds-types";
import { useState } from "react";
import classes from "./ActionForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { useActionClient } from "../../../hooks/useActionClient";
import { UploadChangeParam } from "antd/es/upload";
import { uploadImage } from "../../../utils/lupworldsApi";
import { getBase64 } from "../../../utils/imageHelpers";

type ActionFormProps = {
    open: boolean;
    mode: "create" | "edit";
    setOpen: (open: boolean) => void;
    onActionCreated: () => void;
    onClose: () => void;
    existingAction?: Action;
};

const initialAction = {
    id: "temp",
    worldId: "",
    name: "",
    description: "",
    artist: "",
    actionSrc: "",
    backgroundSrc: "",
    rarity: 1,
};

export const ActionForm = ({
    open,
    mode,
    setOpen,
    onActionCreated,
    onClose,
    existingAction,
}: ActionFormProps) => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { createAction, updateAction } = useActionClient(activeWorld?.id ?? "");
    const [saving, setSaving] = useState(false);
    const [action, setAction] = useState<Action>(
        existingAction ? existingAction : initialAction,
    );
    const [actionImage, setActionImage] = useState<UploadFile>();
    const [backgroundImage, setBackgroundImage] = useState<UploadFile>();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Transform received file to base64 so it can be shown in Preview
    const setFile = async (
        info: UploadChangeParam<UploadFile>,
        callback: (file: UploadFile) => void,
    ) => {
        const file = info.file;
        if (file.status !== "removed" && !file.url && !file.preview) {
            file.preview = await getBase64(file);
        }

        callback(file);
    };

    // Sets the main image preview
    const setActionFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setActionImage(file);
        setAction({
            ...action,
            actionSrc: previewSrc,
        });
    };
    const setBackgroundFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setBackgroundImage(file);
        setAction({
            ...action,
            backgroundSrc: previewSrc,
        });
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        // Only validate images for create mode
        if (mode === "create" && !actionImage) {
            errors["actionImage"] = "Campo requerido";
        }
        if (mode === "create" && !backgroundImage) {
            errors["backgroundImage"] = "Campo requerido";
        }
        if (!action.name) {
            errors["name"] = "Campo requerido";
        }
        if (!action.description) {
            errors["description"] = "Campo requerido";
        }
        if (!action.artist) {
            errors["artist"] = "Campo requerido";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSave = async () => {
        try {
            if (validate()) {
                setSaving(true);
                const finalAction = { ...action, worldId: activeWorld?.id ?? "" };
                await saveAction(
                    finalAction,
                    mode,
                    actionImage,
                    backgroundImage,
                    createAction,
                    updateAction,
                );

                // Reset form state and close modal
                setAction(initialAction);
                setActionImage(undefined);
                setBackgroundImage(undefined);
                setOpen(false);
                onActionCreated?.();
            }
        } catch (error) {
            console.error("Error saving action:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Nueva Acción"
            centered
            width={700}
            cancelText={"Cancelar"}
            okText={"Guardar"}
            onCancel={() => {
                if (!saving) {
                    setOpen(false);
                    onClose?.();
                }
            }}
            onOk={onSave}
            okButtonProps={{ disabled: saving }}
            cancelButtonProps={{ disabled: saving }}
        >
            <div className={`${saving ? classes.blurred : ""}`}>
                <Flex className={classes.container} justify="center" gap={24}>
                    <Flex
                        className={classes.cardColumn}
                        align="center"
                        justify="center"
                    >
                        <ActionCard action={action} />
                    </Flex>
                    <Flex
                        className={classes.formColumn}
                        vertical
                        gap={12}
                        justify="center"
                    >
                        <Input
                            placeholder="Name"
                            status={
                                !action.name && errors.name ? "error" : ""
                            }
                            value={action.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setAction({ ...action, name });
                            }}
                        />
                        <Input.TextArea
                            placeholder="Description"
                            value={action.description}
                            status={
                                !action.description && errors.description
                                    ? "error"
                                    : ""
                            }
                            onChange={(e) => {
                                const description = e.target.value;
                                setAction({
                                    ...action,
                                    description: description,
                                });
                            }}
                        />
                        <Input
                            placeholder="Artista"
                            value={action.artist}
                            status={
                                !action.artist && errors.artist
                                    ? "error"
                                    : ""
                            }
                            onChange={(e) => {
                                const artist = e.target.value;
                                setAction({ ...action, artist });
                            }}
                        />
                        <Upload
                            onRemove={() => {
                                setActionImage(undefined);
                            }}
                            onChange={(info) => setFile(info, setActionFile)}
                            beforeUpload={() => {
                                return false;
                            }}
                            fileList={actionImage ? [actionImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={
                                    !actionImage && errors.actionImage
                                        ? "danger"
                                        : "default"
                                }
                                variant="outlined"
                            >
                                Imagen Acción
                            </Button>
                        </Upload>
                        <Upload
                            onRemove={() => {
                                setBackgroundImage(undefined);
                            }}
                            onChange={(info) =>
                                setFile(info, setBackgroundFile)
                            }
                            beforeUpload={() => {
                                return false;
                            }}
                            fileList={backgroundImage ? [backgroundImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={
                                    !backgroundImage && errors.backgroundImage
                                        ? "danger"
                                        : "default"
                                }
                                variant="outlined"
                            >
                                Imagen Fondo
                            </Button>
                        </Upload>
                        <Rate
                            value={action.rarity}
                            onChange={(v) => {
                                setAction({ ...action, rarity: v });
                            }}
                        />
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Acción" size="large" />
                </div>
            )}
        </Modal>
    );
};

const saveAction = async (
    action: Action,
    mode: "create" | "edit",
    actionImage?: UploadFile,
    backgroundImage?: UploadFile,
    onCreate?: (a: Omit<Action, "id">) => Promise<Action>,
    onUpdate?: (a: Action) => Promise<Action>,
) => {
    let actionSrc = action.actionSrc;
    let backgroundSrc = action.backgroundSrc;

    if (actionImage) {
        actionSrc = await uploadImage(actionImage, "actions");
    }
    if (backgroundImage) {
        backgroundSrc = await uploadImage(backgroundImage, "actions");
    }

    if (mode === "create") {
        await onCreate?.({ ...action, actionSrc, backgroundSrc });
    } else {
        await onUpdate?.({ ...action, actionSrc, backgroundSrc });
    }
};
