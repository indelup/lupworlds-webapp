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
import { MaterialCard } from "../../common/MaterialCard";
import { Material } from "@melda/lupworlds-types";
import { useState } from "react";
import classes from "./MaterialForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { useMaterialClient } from "../../../hooks/useMaterialClient";
import { UploadChangeParam } from "antd/es/upload";
import { uploadImage } from "../../../utils/lupworldsApi";
import { getBase64 } from "../../../utils/imageHelpers";

type MaterialFormProps = {
    open: boolean;
    mode: "create" | "edit";
    setOpen: (open: boolean) => void;
    onMaterialCreated: () => void;
    onClose: () => void;
    existingMaterial?: Material;
};

const initialMaterial = {
    id: "temp",
    worldId: "",
    name: "",
    description: "",
    artist: "",
    materialSrc: "",
    backgroundSrc: "",
    rarity: 1,
};

export const MaterialForm = ({
    open,
    mode,
    setOpen,
    onMaterialCreated,
    onClose,
    existingMaterial,
}: MaterialFormProps) => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const { createMaterial, updateMaterial } = useMaterialClient(activeWorldId);
    const [saving, setSaving] = useState(false);
    const [material, setMaterial] = useState<Material>(
        existingMaterial ? existingMaterial : initialMaterial,
    );
    const [materialImage, setMaterialImage] = useState<UploadFile>();
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
    const setMaterialFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setMaterialImage(file);
        setMaterial({
            ...material,
            materialSrc: previewSrc,
        });
    };
    const setBackgroundFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setBackgroundImage(file);
        setMaterial({
            ...material,
            backgroundSrc: previewSrc,
        });
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        // Only validate images for create mode
        if (mode === "create" && !materialImage) {
            errors["materialImage"] = "Campo requerido";
        }
        if (mode === "create" && !backgroundImage) {
            errors["backgroundImage"] = "Campo requerido";
        }
        if (!material.name) {
            errors["name"] = "Campo requerido";
        }
        if (!material.description) {
            errors["description"] = "Campo requerido";
        }
        if (!material.artist) {
            errors["artist"] = "Campo requerido";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSave = async () => {
        try {
            if (validate()) {
                setSaving(true);
                const finalMaterial = { ...material, worldId: activeWorldId };
                await saveMaterial(
                    finalMaterial,
                    mode,
                    materialImage,
                    backgroundImage,
                    createMaterial,
                    updateMaterial,
                );

                // Reset form state and close modal
                setMaterial(initialMaterial);
                setMaterialImage(undefined);
                setBackgroundImage(undefined);
                setOpen(false);
                onMaterialCreated?.();
            }
        } catch (error) {
            console.error("Error saving material:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Nuevo Material"
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
                        <MaterialCard material={material} />
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
                                !material.name && errors.name ? "error" : ""
                            }
                            value={material.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setMaterial({ ...material, name });
                            }}
                        />
                        <Input.TextArea
                            placeholder="Description"
                            value={material.description}
                            status={
                                !material.description && errors.description
                                    ? "error"
                                    : ""
                            }
                            onChange={(e) => {
                                const description = e.target.value;
                                setMaterial({
                                    ...material,
                                    description: description,
                                });
                            }}
                        />
                        <Input
                            placeholder="Artista"
                            value={material.artist}
                            status={
                                !material.artist && errors.artist ? "error" : ""
                            }
                            onChange={(e) => {
                                const artist = e.target.value;
                                setMaterial({ ...material, artist });
                            }}
                        />
                        <Upload
                            onRemove={() => {
                                setMaterialImage(undefined);
                            }}
                            onChange={(info) => setFile(info, setMaterialFile)}
                            beforeUpload={() => {
                                return false;
                            }}
                            fileList={materialImage ? [materialImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={
                                    !materialImage && errors.materialImage
                                        ? "danger"
                                        : "default"
                                }
                                variant="outlined"
                            >
                                Imagen Material
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
                            value={material.rarity}
                            onChange={(v) => {
                                setMaterial({ ...material, rarity: v });
                            }}
                        />
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Material" size="large" />
                </div>
            )}
        </Modal>
    );
};

const saveMaterial = async (
    material: Material,
    mode: "create" | "edit",
    materialImage?: UploadFile,
    backgroundImage?: UploadFile,
    onCreate?: (m: Omit<Material, "id">) => Promise<Material>,
    onUpdate?: (m: Material) => Promise<Material>,
) => {
    let materialSrc = material.materialSrc;
    let backgroundSrc = material.backgroundSrc;

    if (materialImage) {
        materialSrc = await uploadImage(materialImage, "materials");
    }
    if (backgroundImage) {
        backgroundSrc = await uploadImage(backgroundImage, "materials");
    }

    if (mode === "create") {
        await onCreate?.({ ...material, materialSrc, backgroundSrc });
    } else {
        await onUpdate?.({ ...material, materialSrc, backgroundSrc });
    }
};
