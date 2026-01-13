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
import { CharacterCard } from "../../common/CharacterCard";
import { Character } from "../../../types";
import { useState } from "react";
import classes from "./CharacterForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import {
    createCharacter,
    updateCharacter,
    uploadImage,
} from "../../../utils/lupworldsApi";
import { getBase64 } from "../../../utils/imageHelpers";

type CharacterFormProps = {
    open: boolean;
    mode: "create" | "edit";
    setOpen: (open: boolean) => void;
    onCharacterCreated: () => void;
    onClose: () => void;
    existingCharacter?: Character;
};

const initialCharacter = {
    id: "temp",
    worldId: "",
    name: "",
    description: "",
    artist: "",
    characterSrc: "",
    backgroundSrc: "",
    rarity: 1,
};

export const CharacterForm = ({
    open,
    mode,
    setOpen,
    onCharacterCreated,
    onClose,
    existingCharacter,
}: CharacterFormProps) => {
    const user = useStore((state: AppState) => state.user);
    const activeWorldId = user?.worldIds[0] || "";
    const [saving, setSaving] = useState(false);
    const [character, setCharacter] = useState<Character>(
        existingCharacter ? existingCharacter : initialCharacter,
    );
    const [characterImage, setCharacterImage] = useState<UploadFile>();
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
    const setCharacterFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setCharacterImage(file);
        setCharacter({
            ...character,
            characterSrc: previewSrc,
        });
    };
    const setBackgroundFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setBackgroundImage(file);
        setCharacter({
            ...character,
            backgroundSrc: previewSrc,
        });
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        // Only validate images for create mode
        if (mode === "create" && !characterImage) {
            errors["characterImage"] = "Campo requerido";
        }
        if (mode === "create" && !backgroundImage) {
            errors["backgroundImage"] = "Campo requerido";
        }
        if (!character.name) {
            errors["name"] = "Campo requerido";
        }
        if (!character.description) {
            errors["description"] = "Campo requerido";
        }
        if (!character.artist) {
            errors["artist"] = "Campo requerido";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSave = async () => {
        try {
            if (validate()) {
                setSaving(true);
                const finalCharacter = { ...character, worldId: activeWorldId };
                await saveCharacter(
                    finalCharacter,
                    mode,
                    characterImage,
                    backgroundImage,
                );

                // Reset form state and close modal
                setCharacter(initialCharacter);
                setCharacterImage(undefined);
                setBackgroundImage(undefined);
                setOpen(false);
                onCharacterCreated?.();
            }
        } catch (error) {
            console.error("Error saving character:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Nuevo Personaje"
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
                        <CharacterCard character={character} />
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
                                !character.name && errors.name ? "error" : ""
                            }
                            value={character.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setCharacter({ ...character, name });
                            }}
                        />
                        <Input.TextArea
                            placeholder="Description"
                            value={character.description}
                            status={
                                !character.description && errors.description
                                    ? "error"
                                    : ""
                            }
                            onChange={(e) => {
                                const description = e.target.value;
                                setCharacter({
                                    ...character,
                                    description: description,
                                });
                            }}
                        />
                        <Input
                            placeholder="Artista"
                            value={character.artist}
                            status={
                                !character.artist && errors.artist
                                    ? "error"
                                    : ""
                            }
                            onChange={(e) => {
                                const artist = e.target.value;
                                setCharacter({ ...character, artist });
                            }}
                        />
                        <Upload
                            onRemove={() => {
                                setCharacterImage(undefined);
                            }}
                            onChange={(info) => setFile(info, setCharacterFile)}
                            beforeUpload={() => {
                                return false;
                            }}
                            fileList={characterImage ? [characterImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={
                                    !characterImage && errors.characterImage
                                        ? "danger"
                                        : "default"
                                }
                                variant="outlined"
                            >
                                Imagen Personaje
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
                            value={character.rarity}
                            onChange={(v) => {
                                setCharacter({ ...character, rarity: v });
                            }}
                        />
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Personaje" size="large" />
                </div>
            )}
        </Modal>
    );
};

const saveCharacter = async (
    character: Character,
    mode: "create" | "edit",
    characterImage?: UploadFile,
    backgroundImage?: UploadFile,
) => {
    let characterSrc = character.characterSrc;
    let backgroundSrc = character.backgroundSrc;

    // Upload character image if provided
    if (characterImage) {
        characterSrc = await uploadImage(characterImage, "characters");
    }
    // Upload background image if provided
    if (backgroundImage) {
        backgroundSrc = await uploadImage(backgroundImage, "characters"); // Use the S3 key as the source
    }

    // Create the character with the uploaded image URLs
    if (mode === "create") {
        await createCharacter({
            ...character,
            characterSrc,
            backgroundSrc,
        });
    } else {
        await updateCharacter({
            ...character,
            characterSrc,
            backgroundSrc,
        });
    }
};
