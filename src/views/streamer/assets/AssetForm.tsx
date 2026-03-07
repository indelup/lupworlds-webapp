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
import { CharacterSchema } from "@melda/lupworlds-types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import classes from "./AssetForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import { uploadImage } from "../../../utils/lupworldsApi";
import { getBase64 } from "../../../utils/imageHelpers";
import { AssetCard } from "./AssetCard";
import { AssetConfig, AssetItem } from "./assetTypes";

const AssetFormSchema = CharacterSchema.pick({
    name: true,
    description: true,
    artist: true,
    rarity: true,
});
type AssetFormValues = z.infer<typeof AssetFormSchema>;

type AssetFormProps = {
    open: boolean;
    mode: "create" | "edit";
    setOpen: (open: boolean) => void;
    onSaved: () => void;
    onClose: () => void;
    existingItem?: AssetItem;
    config: AssetConfig;
};

export const AssetForm = ({
    open,
    mode,
    setOpen,
    onSaved,
    onClose,
    existingItem,
    config,
}: AssetFormProps) => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const [saving, setSaving] = useState(false);
    const [mainImage, setMainImage] = useState<UploadFile>();
    const [backgroundImage, setBackgroundImage] = useState<UploadFile>();
    const [mainSrc, setMainSrc] = useState(existingItem?.mainSrc ?? "");
    const [backgroundSrc, setBackgroundSrc] = useState(existingItem?.backgroundSrc ?? "");

    const { control, handleSubmit, watch, reset, setError, formState: { errors } } = useForm<AssetFormValues>({
        resolver: zodResolver(AssetFormSchema),
        defaultValues: {
            name: existingItem?.name ?? "",
            description: existingItem?.description ?? "",
            artist: existingItem?.artist ?? "",
            rarity: existingItem?.rarity ?? 1,
        },
    });

    const watched = watch();

    const setFile = async (
        info: UploadChangeParam<UploadFile>,
        callback: (file: UploadFile) => void,
    ) => {
        const file = info.file;
        if (file.status === "removed") return;
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file);
        }
        callback(file);
    };

    const setMainFile = (file: UploadFile) => {
        setMainImage(file);
        setMainSrc(file.url || (file.preview as string));
    };

    const setBackgroundFile = (file: UploadFile) => {
        setBackgroundImage(file);
        setBackgroundSrc(file.url || (file.preview as string));
    };

    const onValid = async (data: AssetFormValues) => {
        if (mode === "create" && !mainImage) {
            setError("root.mainImage", { message: "Campo requerido" });
        }
        if (mode === "create" && !backgroundImage) {
            setError("root.backgroundImage", { message: "Campo requerido" });
        }
        if (mode === "create" && (!mainImage || !backgroundImage)) return;

        try {
            setSaving(true);
            let finalMainSrc = mainSrc;
            let finalBackgroundSrc = backgroundSrc;

            if (mainImage) {
                finalMainSrc = await uploadImage(mainImage, config.bucketType);
            }
            if (backgroundImage) {
                finalBackgroundSrc = await uploadImage(backgroundImage, config.bucketType);
            }

            const item: AssetItem = {
                id: existingItem?.id ?? "temp",
                worldId: activeWorld?.id ?? "",
                mainSrc: finalMainSrc,
                backgroundSrc: finalBackgroundSrc,
                ...data,
            };

            if (mode === "create") {
                const { id: _id, ...rest } = item;
                await config.create(rest);
            } else {
                await config.update(item);
            }

            reset();
            setMainImage(undefined);
            setBackgroundImage(undefined);
            setMainSrc("");
            setBackgroundSrc("");
            setOpen(false);
            onSaved?.();
        } catch (error) {
            console.error("Error saving asset:", error);
        } finally {
            setSaving(false);
        }
    };

    const previewItem: AssetItem = {
        id: existingItem?.id ?? "temp",
        worldId: activeWorld?.id ?? "",
        mainSrc,
        backgroundSrc,
        ...watched,
    };

    const title = mode === "create" ? `Nuevo ${config.labels.singular}` : `Editar ${config.labels.singular}`;

    return (
        <Modal
            open={open}
            title={title}
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
            onOk={handleSubmit(onValid)}
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
                        <AssetCard item={previewItem} bucketUri={config.bucketUri} />
                    </Flex>
                    <Flex
                        className={classes.formColumn}
                        vertical
                        gap={12}
                        justify="center"
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Name"
                                    status={errors.name ? "error" : ""}
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input.TextArea
                                    {...field}
                                    placeholder="Description"
                                    status={errors.description ? "error" : ""}
                                />
                            )}
                        />
                        <Controller
                            name="artist"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Artista"
                                    status={errors.artist ? "error" : ""}
                                />
                            )}
                        />
                        <Upload
                            onRemove={() => {
                                setMainImage(undefined);
                                setMainSrc(existingItem?.mainSrc ?? "");
                            }}
                            onChange={(info) => setFile(info, setMainFile)}
                            beforeUpload={() => false}
                            fileList={mainImage ? [mainImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={errors.root?.mainImage ? "danger" : "default"}
                                variant="outlined"
                            >
                                {config.labels.mainImageLabel}
                            </Button>
                        </Upload>
                        <Upload
                            onRemove={() => {
                                setBackgroundImage(undefined);
                                setBackgroundSrc(existingItem?.backgroundSrc ?? "");
                            }}
                            onChange={(info) => setFile(info, setBackgroundFile)}
                            beforeUpload={() => false}
                            fileList={backgroundImage ? [backgroundImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                color={errors.root?.backgroundImage ? "danger" : "default"}
                                variant="outlined"
                            >
                                Imagen Fondo
                            </Button>
                        </Upload>
                        <Controller
                            name="rarity"
                            control={control}
                            render={({ field }) => (
                                <Rate
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip={`${mode === "create" ? "Creando" : "Guardando"} ${config.labels.singular}`} size="large" />
                </div>
            )}
        </Modal>
    );
};
