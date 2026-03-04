import { Button, Flex, Input, Spin, Typography } from "antd";
import { DeleteFilled, PlusOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Currency, World } from "@melda/lupworlds-types";
import { useEffect, useRef, useState } from "react";
import { AppState, useStore } from "../../../hooks/useStore";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { getPresignedUrl } from "../../../utils/lupworldsApi";
import { getBase64, isBase64 } from "../../../utils/imageHelpers";
import env from "../../../env";
import classes from "./CurrencyConfig.module.scss";

const { Text } = Typography;

const toDisplayUrl = (image: string | undefined): string | undefined => {
    if (!image) return undefined;
    if (isBase64(image)) return image;
    return `${env.VITE_WORLD_BUCKET_URI}/${image}`;
};

export const CurrencyConfig = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const setActiveWorld = useStore((state: AppState) => state.setActiveWorld);
    const { world, isFetching, updateWorld, isUpdating } = useWorldClient(activeWorld?.id ?? "");

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [saving, setSaving] = useState(false);

    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        if (world) {
            setCurrencies(world.currencies ?? []);
        }
    }, [world]);

    const onAdd = () => {
        const id = crypto.randomUUID();
        setCurrencies((prev) => [...prev, { id, name: "", image: "" }]);
    };

    const onNameChange = (id: string, name: string) => {
        setCurrencies((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    };

    const onFileChange = async (id: string, file: File) => {
        const preview = await getBase64(file);
        setFiles((prev) => ({ ...prev, [id]: file }));
        setCurrencies((prev) => prev.map((c) => (c.id === id ? { ...c, image: preview } : c)));
    };

    const onDelete = (id: string) => {
        setCurrencies((prev) => prev.filter((c) => c.id !== id));
        setFiles((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const onSave = async () => {
        if (!activeWorld || !world) return;
        try {
            setSaving(true);
            const savedCurrencies = await Promise.all(
                currencies.map(async (c) => {
                    const file = files[c.id];
                    if (file) {
                        const { url, key } = await getPresignedUrl(file.name, file.type || "image/png", "worlds");
                        await fetch(url, {
                            method: "PUT",
                            body: file,
                            headers: { "Content-Type": file.type || "image/png" },
                        });
                        return { ...c, image: key };
                    }
                    return c;
                }),
            );
            const worldToSave: World = { ...world, currencies: savedCurrencies };
            await updateWorld(worldToSave);
            setActiveWorld(worldToSave);
            setFiles({});
            setCurrencies(savedCurrencies);
        } catch (error) {
            console.error("Error saving currencies:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!activeWorld) {
        return <Text>No active world selected.</Text>;
    }

    if (isFetching && !world) {
        return <Spin />;
    }

    return (
        <div className={classes.container}>
            <Flex justify="space-between" align="center">
                <Button icon={<PlusOutlined />} onClick={onAdd}>
                    Add Currency
                </Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving || isUpdating}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Flex>

            {currencies.length === 0 ? (
                <Text type="secondary">No currencies yet. Add one above.</Text>
            ) : (
                <div className={classes.list}>
                    {currencies.map((c) => {
                        const displayUrl = toDisplayUrl(c.image);
                        return (
                            <div key={c.id} className={classes.row}>
                                <div
                                    className={classes.iconPreview}
                                    onClick={() => fileInputRefs.current[c.id]?.click()}
                                    title="Click to upload icon"
                                >
                                    {displayUrl ? (
                                        <img src={displayUrl} alt={c.name} className={classes.iconImg} />
                                    ) : (
                                        <UploadOutlined className={classes.iconPlaceholder} />
                                    )}
                                </div>
                                <input
                                    ref={(el) => { fileInputRefs.current[c.id] = el; }}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onFileChange(c.id, file);
                                        e.target.value = "";
                                    }}
                                />
                                <Input
                                    placeholder="Currency name"
                                    value={c.name}
                                    onChange={(e) => onNameChange(c.id, e.target.value)}
                                    className={classes.nameInput}
                                />
                                <Button
                                    type="primary"
                                    shape="circle"
                                    danger
                                    icon={<DeleteFilled />}
                                    onClick={() => onDelete(c.id)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
