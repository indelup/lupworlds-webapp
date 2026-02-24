import classes from "./Banners.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { BannerDelete } from "./BannerDelete";
import { AppState, useStore } from "../../../hooks/useStore";
import { BannerForm } from "./BannerForm/BannerForm";
import { useBannerClient } from "../../../hooks/useBannerClient";
import { Banner } from "@melda/lupworlds-types";
import env from "../../../env";
import { isBase64 } from "../../../utils/imageHelpers";

export const Banners = () => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const { banners, isFetching, fetchBanners } = useBannerClient(activeWorldId ?? "");
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [activeBanner, setActiveBanner] = useState<Banner>();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [bannerId, setBannerId] = useState("");

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setActiveBanner(undefined);
                        setFormMode("create");
                        setFormOpen(true);
                    }}
                >
                    New Banner
                </Button>
            </div>
            <div className={classes.cardList}>
                {isFetching ? (
                    <div>Loading banners...</div>
                ) : banners.length === 0 ? (
                    <div>No banners found for this world.</div>
                ) : (
                    banners.map((banner) => {
                        const imageSrc = !banner.imageSrc
                            ? ""
                            : isBase64(banner.imageSrc)
                              ? banner.imageSrc
                              : `${env.VITE_BANNER_BUCKET_URI}/${banner.imageSrc}`;
                        return (
                            <Flex gap={8} vertical>
                                <img src={imageSrc} className={classes.bannerImage} />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditFilled />}
                                        onClick={() => {
                                            setActiveBanner(banner);
                                            setFormMode("edit");
                                            setFormOpen(true);
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                        onClick={() => {
                                            setDeleteOpen(true);
                                            setBannerId(banner.id);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        );
                    })
                )}
            </div>
            <BannerForm
                open={formOpen}
                setOpen={setFormOpen}
                mode={formMode}
                existingBanner={activeBanner}
            />
            <BannerDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                bannerId={bannerId}
                onBannerDeleted={() => {
                    fetchBanners();
                    setBannerId("");
                }}
            />
        </>
    );
};
