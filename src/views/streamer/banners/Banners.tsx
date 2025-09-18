import { Banner } from "../../../types";
import classes from "./Banners.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { BannerDelete } from "./BannerDelete";
import { getBanners } from "../../../utils";
import { AppState, useStore } from "../../../hooks/useStore";
import { BannerForm } from "./BannerForm";

export const Banners = () => {
    const user = useStore((state: AppState) => state.user);
    const activeWorldId = user?.worldIds[0] || "";
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [bannerId, setBannerId] = useState("");
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            if (!activeWorldId) {
                setBanners([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedBanners = await getBanners(activeWorldId);
                setBanners(fetchedBanners);
            } catch (error) {
                console.error("Error fetching banners:", error);
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [activeWorldId]);

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setFormOpen(true);
                    }}
                >
                    New Banner
                </Button>
            </div>
            <div className={classes.cardList}>
                {loading ? (
                    <div>Loading banners...</div>
                ) : banners.length === 0 ? (
                    <div>No banners found for this world.</div>
                ) : (
                    banners.map((banner) => {
                        return (
                            <Flex gap={8} vertical>
                                {banner.id}
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditFilled />}
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
            <BannerForm open={formOpen} setOpen={setFormOpen} />
            <BannerDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                bannerId={bannerId}
                onBannerDeleted={() => {
                    // Refresh banner list when a banner is deleted
                    const fetchBanners = async () => {
                        if (activeWorldId) {
                            try {
                                const fetchedBanners =
                                    await getBanners(activeWorldId);
                                setBanners(fetchedBanners);
                                setBannerId("");
                            } catch (error) {
                                console.error(
                                    "Error refreshing banners:",
                                    error,
                                );
                            }
                        }
                    };
                    fetchBanners();
                }}
            />
        </>
    );
};
