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
import { Material } from "../../../types";
import { useState } from "react";
import classes from "./MaterialForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import { createMaterial, uploadImage } from "../../../utils/lupworldsApi";
import { getBase64 } from "../../../utils/imageHelpers";

type MaterialFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onMaterialCreated?: () => void;
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

export const MaterialForm = (props: MaterialFormProps) => {
    const user = useStore((state: AppState) => state.user);
    const activeWorldId = user?.worldIds[0] || "";
    const [saving, setSaving] = useState(false);
    const [material, setMaterial] = useState<Material>(initialMaterial);
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
        if (!materialImage) {
            errors["materialImage"] = "Campo requerido";
        }
        if (!backgroundImage) {
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
                    materialImage,
                    backgroundImage,
                );

                // Reset form state and close modal
                setMaterial(initialMaterial);
                setMaterialImage(undefined);
                setBackgroundImage(undefined);
                props.setOpen(false);
                props.onMaterialCreated?.();
            }
        } catch (error) {
            console.error("Error saving material:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={props.open}
            title="Nuevo Material"
            centered
            width={700}
            cancelText={"Cancelar"}
            okText={"Guardar"}
            onCancel={() => {
                if (!saving) props.setOpen(false);
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
                        <MaterialCard material={material} isPreview />
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
                            onChange={(e) => {
                                const name = e.target.value;
                                setMaterial({ ...material, name });
                            }}
                        />
                        <Input.TextArea
                            placeholder="Description"
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
    materialImage?: UploadFile,
    backgroundImage?: UploadFile,
) => {
    let materialSrc = material.materialSrc;
    let backgroundSrc = material.backgroundSrc;

    // Upload material image if provided
    if (materialImage) {
        materialSrc = await uploadImage(materialImage, "materials");
    }
    // Upload background image if provided
    if (backgroundImage) {
        backgroundSrc = await uploadImage(backgroundImage, "materials"); // Use the S3 key as the source
    }

    // Create the material with the uploaded image URLs
    await createMaterial({
        ...material,
        materialSrc,
        backgroundSrc,
    });
};
