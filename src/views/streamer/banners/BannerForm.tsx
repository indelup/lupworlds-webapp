import {
    Button,
    Flex,
    Upload,
    UploadFile,
    Spin,
    Drawer,
    Select,
    Input,
} from "antd";
import {
    DeleteFilled,
    DeleteOutlined,
    PlusCircleOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Banner, BannerBag, Character, Material } from "../../../types";
import { act, useEffect, useState } from "react";
import classes from "./BannerForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import {
    createBanner,
    getCharacters,
    getMaterials,
    uploadImage,
} from "../../../utils/lupworldsApi";
import { v4 as uuidv4 } from "uuid";
import { CharacterCard } from "../../common/CharacterCard";

type BannerFormProps = {
    bannerId?: string;
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
    const user = useStore((state: AppState) => state.user);
    const { open, setOpen } = props;
    const activeWorldId = user?.worldIds[0] || "";
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState<Banner>(initialBanner);
    const [loadingItems, setLoadingItems] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [usedItems, setUsedItems] = useState<string[]>([]);
    const [bannerImage, setBannerImage] = useState<UploadFile>();

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

    const onSave = async () => {
        try {
            setSaving(true);
            const finalBanner = { ...banner, worldId: activeWorldId };
            await saveBanner(finalBanner, bannerImage);

            props.onBannerCreated?.();
            // TODO: Close the form
        } catch (error) {
            console.error("Error saving banner:", error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            setLoadingItems(true);
            if (!activeWorldId) {
                setCharacters([]);
                setMaterials([]);
                setLoadingItems(false);
                return;
            }

            try {
                const fetchedCharacters = await getCharacters(activeWorldId);
                const fetchedMaterials = await getMaterials(activeWorldId);
                setCharacters(fetchedCharacters);
                setMaterials(fetchedMaterials);
            } catch (error) {
                console.error("Error fetching items::", error);
                setCharacters([]);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchItems();
    }, [activeWorldId]);

    const characterOptions = characters
        .map((character) => {
            if (usedItems.includes(character.id)) return;
            return {
                value: character.id,
                label: character.name,
            };
        })
        .filter(Boolean);

    return (
        <Drawer
            placement="right"
            open={open}
            onClose={() => setOpen(false)}
            getContainer={false}
            size="large"
            title="Nuevo Banner"
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
                                <div
                                    key={bag.id}
                                    className={classes.bagContainer}
                                >
                                    <div className={classes.bagForm}>
                                        <Select
                                            placeholder="Añadir Personaje"
                                            onSelect={(v) => {
                                                if (v) {
                                                    const updatedBanner = {
                                                        ...banner,
                                                    };
                                                    const updatedBag =
                                                        updatedBanner.bags[idx];
                                                    updatedBag.items.push({
                                                        id: uuidv4(),
                                                        type: "character",
                                                        itemId: v,
                                                    });
                                                    updatedBanner.bags[idx] =
                                                        updatedBag;
                                                    setBanner(updatedBanner);
                                                    const newUsedItems = [
                                                        ...usedItems,
                                                    ];
                                                    newUsedItems.push(v);
                                                    setUsedItems(newUsedItems);
                                                }
                                            }}
                                            options={characterOptions as any}
                                            value="Añadir Personaje"
                                        />
                                        <Select
                                            placeholder="Añadir Material"
                                            options={materials.map(
                                                (material) => {
                                                    return {
                                                        value: material.id,
                                                        label: material.name,
                                                    };
                                                },
                                            )}
                                        />
                                        <Input placeholder="Probabilidad" />
                                        <Button icon={<DeleteOutlined />}>
                                            Eliminar Bolsa
                                        </Button>
                                    </div>
                                    <div className={classes.bagItemList}>
                                        {characters.map((character) => {
                                            for (const item of bag.items) {
                                                if (
                                                    item.type === "character" &&
                                                    item.itemId === character.id
                                                ) {
                                                    return (
                                                        <CharacterCard
                                                            character={
                                                                character
                                                            }
                                                            small={true}
                                                        />
                                                    );
                                                }
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        <Button
                            onClick={() => {
                                const newBag: BannerBag = {
                                    id: uuidv4(),
                                    items: [],
                                    chance: 0,
                                };
                                setBanner({
                                    ...banner,
                                    bags: [...banner.bags, newBag],
                                });
                            }}
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

const saveBanner = async (banner: Banner, bannerImage?: UploadFile) => {
    let imageSrc = banner.imageSrc;

    // Upload banner image if provided
    if (bannerImage) {
        imageSrc = await uploadImage(bannerImage, "banners");
    }

    // Create the banner with the uploaded image URLs
    await createBanner({
        ...banner,
        imageSrc,
    });
};
