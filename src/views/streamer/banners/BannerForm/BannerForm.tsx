import { Button, Flex, Upload, UploadFile, Spin, Drawer } from "antd";
import { PlusCircleOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Banner, BannerBag } from "@melda/lupworlds-types";
import { useEffect, useState } from "react";
import classes from "./BannerForm.module.scss";
import { AppState, useStore } from "../../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import { uploadImage } from "../../../../utils/lupworldsApi";
import { useBannerClient } from "../../../../hooks/useBannerClient";
import { useCharacterClient } from "../../../../hooks/useCharacterClient";
import { useMaterialClient } from "../../../../hooks/useMaterialClient";
import { v4 as uuidv4 } from "uuid";
import { BannerBagForm } from "./BannerBagForm";

type BannerFormProps = {
    mode: "create" | "edit";
    existingBanner?: Banner;
    open: boolean;
    setOpen: (open: boolean) => void;
    onBannerCreated?: () => void;
};

const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const initialBanner = {
    id: "temp",
    worldId: "",
    imageSrc: "",
    bags: [],
};

export const BannerForm = (props: BannerFormProps) => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const { mode, existingBanner, open, setOpen } = props;
    const bannerClient = useBannerClient(activeWorldId ?? "");
    const { characters } = useCharacterClient(activeWorldId ?? "");
    const { materials } = useMaterialClient(activeWorldId ?? "");
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState<Banner>(initialBanner);
    const [usedItems, setUsedItems] = useState<string[]>([]);
    const [bannerImage, setBannerImage] = useState<UploadFile>();

    useEffect(() => {
        if (open) {
            if (existingBanner) {
                setBanner(existingBanner);
                setUsedItems(
                    existingBanner.bags.flatMap((bag) =>
                        bag.items.map((item) => item.itemId),
                    ),
                );
            } else {
                setBanner(initialBanner);
                setUsedItems([]);
            }
            setBannerImage(undefined);
        }
    }, [open]);

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
    const setBannerFile = (file: UploadFile) => {
        const previewSrc = file.url || (file.preview as string);
        setBannerImage(file);
        setBanner({
            ...banner,
            imageSrc: previewSrc,
        });
    };

    const addItemToBag = (
        bagIndex: number,
        itemId: string,
        itemType: "character" | "material",
    ) => {
        if (itemId) {
            const updatedBanner = {
                ...banner,
            };
            const updatedBag = updatedBanner.bags[bagIndex];
            updatedBag.items.push({
                id: uuidv4(),
                type: itemType,
                itemId,
            });
            updatedBanner.bags[bagIndex] = updatedBag;
            setBanner(updatedBanner);
            const newUsedItems = [...usedItems];
            newUsedItems.push(itemId);
            setUsedItems(newUsedItems);
        }
    };

    const removeItemFromBag = (itemId: string, bagIndex: number) => {
        const updatedBanner = {
            ...banner,
        };
        const updatedBag = updatedBanner.bags[bagIndex];

        const updatedBagItems = updatedBag.items.filter((item) => {
            if (item.itemId === itemId) return false;
            return true;
        });

        updatedBag.items = updatedBagItems;

        updatedBanner.bags[bagIndex] = updatedBag;
        setBanner(updatedBanner);
        const newUsedItems = usedItems.filter((id) => id !== itemId);
        setUsedItems(newUsedItems);
    };

    const addBagToBanner = () => {
        const newBag: BannerBag = {
            id: uuidv4(),
            items: [],
            chance: 0,
        };
        setBanner({
            ...banner,
            bags: [...banner.bags, newBag],
        });
    };

    const removeBagFromBanner = (bagIndex: number) => {
        const updatedBags = [...banner.bags];
        const bag = banner.bags[bagIndex];
        const itemIds = bag.items.map((item) => item.itemId);
        const updatedUsedItems: string[] = [];
        usedItems.forEach((itemId) => {
            if (!itemIds.includes(itemId)) {
                updatedUsedItems.push(itemId);
            }
        });
        updatedBags.splice(bagIndex, 1);

        setUsedItems(updatedUsedItems);
        setBanner({
            ...banner,
            bags: updatedBags,
        });
    };

    const onSave = async () => {
        try {
            setSaving(true);
            await saveBanner(
                { ...banner, worldId: activeWorldId ?? "" },
                mode,
                bannerImage,
                bannerClient.createBanner,
                bannerClient.updateBanner,
            );
            props.onBannerCreated?.();
            setOpen(false);
        } catch (error) {
            console.error("Error saving banner:", error);
        } finally {
            setSaving(false);
        }
    };


    const characterOptions = characters
        .map((character) => {
            if (usedItems.includes(character.id)) return;
            return {
                value: character.id,
                label: character.name,
            };
        })
        .filter(Boolean);

    const materialsOptions = materials
        .map((material) => {
            if (usedItems.includes(material.id)) return;
            return {
                value: material.id,
                label: material.name,
            };
        })
        .filter(Boolean);

    return (
        <Drawer
            placement="right"
            open={open}
            onClose={() => setOpen(false)}
            getContainer={false}
            width="100%"
            title={mode === "edit" ? "Editar Banner" : "Nuevo Banner"}
            extra={
                <Button
                    color="primary"
                    variant="solid"
                    onClick={onSave}
                    disabled={saving}
                    icon={<SaveOutlined />}
                >
                    Guardar
                </Button>
            }
        >
            <div className={`${saving ? classes.blurred : ""}`}>
                <Flex className={classes.container} gap={24}>
                    <Flex
                        className={classes.formColumn}
                        vertical
                        gap={12}
                        justify="center"
                    >
                        <Upload
                            onRemove={() => {
                                setBannerImage(undefined);
                            }}
                            onChange={(info) => setFile(info, setBannerFile)}
                            beforeUpload={() => {
                                return false;
                            }}
                            fileList={bannerImage ? [bannerImage] : []}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                variant="outlined"
                            >
                                Imagen Banner
                            </Button>
                        </Upload>
                        {banner.bags.map((bag, idx) => {
                            return (
                                <BannerBagForm
                                    bag={bag}
                                    bagIndex={idx}
                                    removeBagFromBanner={removeBagFromBanner}
                                    addItemToBag={addItemToBag}
                                    removeItemFromBag={removeItemFromBag}
                                    characters={characters}
                                    characterOptions={characterOptions as any}
                                    materials={materials}
                                    materialsOptions={materialsOptions as any}
                                />
                            );
                        })}
                        <Button
                            onClick={addBagToBanner}
                            icon={<PlusCircleOutlined />}
                        >
                            Añadir Bolsa
                        </Button>
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Banner" size="large" />
                </div>
            )}
        </Drawer>
    );
};

const saveBanner = async (
    banner: Banner,
    mode: "create" | "edit",
    bannerImage?: UploadFile,
    onCreate?: (b: Omit<Banner, "id">) => Promise<Banner>,
    onUpdate?: (b: Banner) => Promise<Banner>,
) => {
    let imageSrc = banner.imageSrc;

    if (bannerImage) {
        imageSrc = await uploadImage(bannerImage, "banners");
    }

    if (mode === "create") {
        await onCreate?.({ ...banner, imageSrc });
    } else {
        await onUpdate?.({ ...banner, imageSrc });
    }
};
