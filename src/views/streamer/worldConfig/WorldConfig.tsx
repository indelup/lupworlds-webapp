import { Button, Flex, Input, Spin, Typography, Upload, UploadFile } from "antd";
import { SaveOutlined, StarFilled, UploadOutlined } from "@ant-design/icons";
import { World } from "@melda/lupworlds-types";
import { useEffect, useState } from "react";
import { UploadChangeParam } from "antd/es/upload";
import { AppState, useStore } from "../../../hooks/useStore";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { uploadImage } from "../../../utils/lupworldsApi";
import { getBase64, isBase64 } from "../../../utils/imageHelpers";
import env from "../../../env";
import classes from "./WorldConfig.module.scss";

const { Text } = Typography;

const RARITIES = [1, 2, 3, 4, 5] as const;

const toDisplayUrl = (src: string | undefined): string | undefined => {
    if (!src) return undefined;
    if (isBase64(src)) return src;
    return `${env.VITE_WORLD_BUCKET_URI}/${src}`;
};

export const WorldConfig = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const setActiveWorld = useStore((state: AppState) => state.setActiveWorld);
    const { world, isFetching, updateWorld, isUpdating } =
        useWorldClient(activeWorld?.id ?? "");

    const [draft, setDraft] = useState<Partial<World>>({});
    const [logoFile, setLogoFile] = useState<UploadFile>();
    const [backgroundFile, setBackgroundFile] = useState<UploadFile>();
    // Index 0 = rarity 1, index 4 = rarity 5
    const [cardBackFiles, setCardBackFiles] = useState<(UploadFile | undefined)[]>(
        Array(5).fill(undefined),
    );
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (world) {
            setDraft(world);
        }
    }, [world]);

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

    const setCardBackFile = async (
        info: UploadChangeParam<UploadFile>,
        rarityIndex: number,
    ) => {
        const file = info.file;
        if (file.status !== "removed" && !file.url && !file.preview) {
            file.preview = await getBase64(file);
        }
        setCardBackFiles((prev) => {
            const next = [...prev];
            next[rarityIndex] = file.status === "removed" ? undefined : file;
            return next;
        });
    };

    const onSave = async () => {
        if (!activeWorld) return;
        try {
            setSaving(true);

            let logoSrc = draft.logoSrc;
            let backgroundSrc = draft.backgroundSrc;

            if (logoFile) {
                logoSrc = await uploadImage(logoFile, "worlds");
            }
            if (backgroundFile) {
                backgroundSrc = await uploadImage(backgroundFile, "worlds");
            }

            // Merge existing cardBacks with any newly uploaded files
            const cardBacks: { [rarity: number]: string } = { ...(draft.cardBacks ?? {}) };
            for (const rarity of RARITIES) {
                const file = cardBackFiles[rarity - 1];
                if (file) {
                    cardBacks[rarity] = await uploadImage(file, "worlds");
                }
            }

            const worldToSave: World = {
                id: activeWorld.id,
                name: draft.name ?? "",
                streamerIds: draft.streamerIds ?? [],
                maxRarity: draft.maxRarity ?? 5,
                logoSrc,
                backgroundSrc,
                redeems: draft.redeems,
                cardBacks: Object.keys(cardBacks).length > 0 ? cardBacks : undefined,
                currencies: draft.currencies,
            };

            await updateWorld(worldToSave);
            setActiveWorld(worldToSave);
            setLogoFile(undefined);
            setBackgroundFile(undefined);
            setCardBackFiles(Array(5).fill(undefined));
        } catch (error) {
            console.error("Error saving world:", error);
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

    const logoDisplayUrl = logoFile
        ? (logoFile.preview as string) || logoFile.url
        : toDisplayUrl(world?.logoSrc);

    const backgroundDisplayUrl = backgroundFile
        ? (backgroundFile.preview as string) || backgroundFile.url
        : toDisplayUrl(world?.backgroundSrc);

    return (
        <div className={classes.container}>
            <Flex vertical gap={8}>
                <Text strong>World Name</Text>
                <Input
                    placeholder="World name"
                    value={draft.name ?? ""}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
            </Flex>

            <div className={classes.imageRow}>
                <div className={classes.imageField}>
                    <Text strong>Logo</Text>
                    {logoDisplayUrl ? (
                        <img
                            className={classes.logoPreview}
                            src={logoDisplayUrl}
                            alt="World logo"
                        />
                    ) : (
                        <div className={classes.logoPlaceholder} />
                    )}
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={logoFile ? [logoFile] : []}
                        onRemove={() => setLogoFile(undefined)}
                        onChange={(info) => setFile(info, setLogoFile)}
                    >
                        <Button icon={<UploadOutlined />} variant="outlined">
                            {logoDisplayUrl ? "Change Logo" : "Upload Logo"}
                        </Button>
                    </Upload>
                </div>

                <div className={classes.imageField}>
                    <Text strong>Background</Text>
                    {backgroundDisplayUrl ? (
                        <img
                            className={classes.preview}
                            src={backgroundDisplayUrl}
                            alt="World background"
                        />
                    ) : (
                        <div className={classes.backgroundPlaceholder} />
                    )}
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={backgroundFile ? [backgroundFile] : []}
                        onRemove={() => setBackgroundFile(undefined)}
                        onChange={(info) => setFile(info, setBackgroundFile)}
                    >
                        <Button icon={<UploadOutlined />} variant="outlined">
                            {backgroundDisplayUrl ? "Change Background" : "Upload Background"}
                        </Button>
                    </Upload>
                </div>
            </div>

            <Flex vertical gap={8}>
                <Text strong>Card Backs</Text>
                <div className={classes.cardBacksRow}>
                    {RARITIES.map((rarity) => {
                        const file = cardBackFiles[rarity - 1];
                        const existingKey = draft.cardBacks?.[rarity];
                        const displayUrl = file
                            ? (file.preview as string) || file.url
                            : toDisplayUrl(existingKey);
                        return (
                            <div key={rarity} className={classes.cardBackField}>
                                <span>
                            {Array.from({ length: rarity }, (_, i) => (
                                <StarFilled key={i} style={{ fontSize: 10, color: "#fadb14" }} />
                            ))}
                        </span>
                                {displayUrl ? (
                                    <img
                                        className={classes.cardBackPreview}
                                        src={displayUrl}
                                        alt={`Card back rarity ${rarity}`}
                                    />
                                ) : (
                                    <div className={classes.cardBackPlaceholder} />
                                )}
                                <Upload
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    showUploadList={false}
                                    onChange={(info) => setCardBackFile(info, rarity - 1)}
                                >
                                    <Button icon={<UploadOutlined />} size="small" variant="outlined">
                                        {displayUrl ? "Change" : "Upload"}
                                    </Button>
                                </Upload>
                            </div>
                        );
                    })}
                </div>
            </Flex>

            <Button
                type="primary"
                onClick={onSave}
                loading={saving || isUpdating}
                disabled={!draft.name}
                icon={<SaveOutlined />}
            >
                Save
            </Button>
        </div>
    );
};
