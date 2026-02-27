import { Button, Flex, Input, Spin, Typography, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { World } from "@melda/lupworlds-types";
import { useEffect, useState } from "react";
import { UploadChangeParam } from "antd/es/upload";
import { AppState, useStore } from "../../../hooks/useStore";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { uploadImage } from "../../../utils/lupworldsApi";
import { getBase64, isBase64 } from "../../../utils/imageHelpers";
import env from "../../../env";
import classes from "./WorldConfig.module.scss";

const { Title, Text } = Typography;

const toDisplayUrl = (src: string | undefined): string | undefined => {
    if (!src) return undefined;
    if (isBase64(src)) return src;
    return `${env.VITE_WORLD_BUCKET_URI}/${src}`;
};

export const WorldConfig = () => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const { world, isFetching, updateWorld, isUpdating } =
        useWorldClient(activeWorldId);

    const [draft, setDraft] = useState<Partial<World>>({});
    const [logoFile, setLogoFile] = useState<UploadFile>();
    const [backgroundFile, setBackgroundFile] = useState<UploadFile>();
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

    const onSave = async () => {
        if (!activeWorldId) return;
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

            const worldToSave: World = {
                id: activeWorldId,
                name: draft.name ?? "",
                streamerIds: draft.streamerIds ?? [],
                maxRarity: draft.maxRarity ?? 5,
                logoSrc,
                backgroundSrc,
            };

            await updateWorld(worldToSave);
            setLogoFile(undefined);
            setBackgroundFile(undefined);
        } catch (error) {
            console.error("Error saving world:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!activeWorldId) {
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
                    {logoDisplayUrl && (
                        <img
                            className={classes.logoPreview}
                            src={logoDisplayUrl}
                            alt="World logo"
                        />
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
                    {backgroundDisplayUrl && (
                        <img
                            className={classes.preview}
                            src={backgroundDisplayUrl}
                            alt="World background"
                        />
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

            <Button
                type="primary"
                onClick={onSave}
                loading={saving || isUpdating}
                disabled={!draft.name}
            >
                Save
            </Button>
        </div>
    );
};
