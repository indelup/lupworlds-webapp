import { Button, Flex, Upload, UploadFile, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Banner } from "../../../types";
import { useState } from "react";
import classes from "./BannerForm.module.scss";
import { AppState, useStore } from "../../../hooks/useStore";
import { UploadChangeParam } from "antd/es/upload";
import { createBanner, uploadImage } from "../../../utils/lupworldsApi";

type BannerFormProps = {
    bannerId?: string;
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
    const activeWorldId = user?.worldIds[0] || "";
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState<Banner>(initialBanner);
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

    return (
        <>
            <div className={`${saving ? classes.blurred : ""}`}>
                <Flex className={classes.container} justify="center" gap={24}>
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
                    </Flex>
                </Flex>
            </div>
            {saving && (
                <div className={classes.spinner}>
                    <Spin tip="Creando Banner" size="large" />
                </div>
            )}
        </>
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
