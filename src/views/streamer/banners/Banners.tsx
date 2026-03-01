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

type BannerItemProps = {
    banner: Banner;
    onEdit: () => void;
    onDelete: () => void;
};

const BannerItem = ({ banner, onEdit, onDelete }: BannerItemProps) => {
    const [loaded, setLoaded] = useState(false);
    const imageSrc = !banner.imageSrc
        ? ""
        : isBase64(banner.imageSrc)
          ? banner.imageSrc
          : `${env.VITE_BANNER_BUCKET_URI}/${banner.imageSrc}`;

    return (
        <Flex gap={8} vertical>
            <div className={classes.bannerWrapper}>
                <div className={`${classes.shimmer} ${loaded ? classes.hidden : ""}`} />
                <img
                    src={imageSrc}
                    className={classes.bannerImage}
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                />
            </div>
            <Flex gap={4} justify="end">
                <Button type="primary" shape="circle" icon={<EditFilled />} onClick={onEdit} />
                <Button type="primary" shape="circle" icon={<DeleteFilled />} danger onClick={onDelete} />
            </Flex>
        </Flex>
    );
};

export const Banners = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const { banners, isFetching, fetchBanners } = useBannerClient(activeWorld?.id ?? "");
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
                    Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className={classes.bannerPlaceholder} />
                    ))
                ) : banners.length === 0 ? (
                    <div>No banners found for this world.</div>
                ) : (
                    banners.map((banner) => (
                        <BannerItem
                            key={banner.id}
                            banner={banner}
                            onEdit={() => {
                                setActiveBanner(banner);
                                setFormMode("edit");
                                setFormOpen(true);
                            }}
                            onDelete={() => {
                                setDeleteOpen(true);
                                setBannerId(banner.id);
                            }}
                        />
                    ))
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
