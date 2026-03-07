import { Button, Flex, Input, Spin, Typography, Upload } from "antd";
import { DeleteFilled, DollarOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Currency, World } from "@melda/lupworlds-types";
import { useEffect, useState } from "react";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFile } from "antd";
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
    return `${env.VITE_CONFIG_BUCKET_URI}/${image}`;
};

export const CurrencyConfig = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const setActiveWorld = useStore((state: AppState) => state.setActiveWorld);
    const { world, isFetching, updateWorld, isUpdating } = useWorldClient(activeWorld?.id ?? "");

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [saving, setSaving] = useState(false);

    // Form state for new currency
    const [newName, setNewName] = useState("");
    const [newIconFile, setNewIconFile] = useState<UploadFile | undefined>();
    const [newIconPreview, setNewIconPreview] = useState<string | undefined>();
    const [newIconNativeFile, setNewIconNativeFile] = useState<File | undefined>();

    useEffect(() => {
        if (world) {
            setCurrencies(world.currencies ?? []);
        }
    }, [world]);

    const onIconChange = async (info: UploadChangeParam<UploadFile>) => {
        const file = info.file;
        if (file.status === "removed") {
            setNewIconFile(undefined);
            setNewIconPreview(undefined);
            setNewIconNativeFile(undefined);
            return;
        }
        const nativeFile = (file.originFileObj ?? file) as File;
        if (!file.preview) {
            file.preview = await getBase64(nativeFile);
        }
        setNewIconFile(file);
        setNewIconPreview(file.preview as string);
        setNewIconNativeFile(nativeFile);
    };

    const onAdd = () => {
        if (!newName) return;
        const id = crypto.randomUUID();
        setCurrencies((prev) => [...prev, { id, name: newName, image: newIconPreview ?? "" }]);
        if (newIconNativeFile) {
            setFiles((prev) => ({ ...prev, [id]: newIconNativeFile }));
        }
        setNewName("");
        setNewIconFile(undefined);
        setNewIconPreview(undefined);
        setNewIconNativeFile(undefined);
    };

    const onRemove = (id: string) => {
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
                        const { url, key } = await getPresignedUrl(file.name, file.type || "image/png", "config", activeWorld.id);
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
            <Text strong><DollarOutlined /> Currencies</Text>

            <div className={classes.section}>
                <Flex gap={8} align="center">
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        showUploadList={false}
                        fileList={newIconFile ? [newIconFile] : []}
                        onChange={onIconChange}
                    >
                        <div className={`${classes.iconUpload} ${newIconPreview ? classes.iconUploadFilled : ""}`}>
                            {newIconPreview ? (
                                <img src={newIconPreview} className={classes.iconUploadImg} alt="icon preview" />
                            ) : (
                                <UploadOutlined className={classes.iconUploadPlaceholder} />
                            )}
                        </div>
                    </Upload>
                    <Input
                        className={classes.nameInput}
                        placeholder="Currency name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <Button onClick={onAdd} disabled={!newName}>
                        + Add
                    </Button>
                </Flex>
            </div>

            <div className={classes.section}>
                {currencies.length === 0 ? (
                    <Text type="secondary">No currencies yet.</Text>
                ) : (
                    <div className={classes.currencyList}>
                        {currencies.map((c) => {
                            const displayUrl = toDisplayUrl(c.image);
                            return (
                                <div key={c.id} className={classes.currencyRow}>
                                    {displayUrl && (
                                        <img src={displayUrl} className={classes.iconThumb} alt={c.name} />
                                    )}
                                    <Text className={classes.currencyName}>{c.name}</Text>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                        onClick={() => onRemove(c.id)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Button
                type="primary"
                onClick={onSave}
                loading={saving || isUpdating}
                icon={<SaveOutlined />}
            >
                Save
            </Button>
        </div>
    );
};
