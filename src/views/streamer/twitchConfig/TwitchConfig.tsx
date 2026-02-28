import { Button, Flex, Select, Spin, Typography } from "antd";
import { ArrowRightOutlined, DeleteFilled, SaveOutlined } from "@ant-design/icons";
import { BannerRedeem, World } from "@melda/lupworlds-types";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppState, useStore } from "../../../hooks/useStore";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { useBannerClient } from "../../../hooks/useBannerClient";
import { getChannelRedeems } from "../../../utils/twitchApi";
import env from "../../../env";
import classes from "./TwitchConfig.module.scss";

const { Text } = Typography;

export const TwitchConfig = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const setActiveWorld = useStore((state: AppState) => state.setActiveWorld);
    const twitchData = useStore((state: AppState) => state.twitchData);
    const { updateWorld, isUpdating } = useWorldClient(activeWorld?.id ?? "");
    const { banners, isFetching: isFetchingBanners } = useBannerClient(
        activeWorld?.id ?? "",
    );

    const [localRedeems, setLocalRedeems] = useState<BannerRedeem[]>([]);
    const [selectedRedeemId, setSelectedRedeemId] = useState<
        string | undefined
    >();
    const [selectedRedeemName, setSelectedRedeemName] = useState<
        string | undefined
    >();
    const [selectedBannerId, setSelectedBannerId] = useState<
        string | undefined
    >();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (activeWorld) {
            setLocalRedeems(activeWorld.redeems ?? []);
        }
    }, [activeWorld]);

    const { data: redeems, isLoading: isLoadingRedeems } = useQuery({
        queryKey: ["twitch-redeems", twitchData?.id],
        queryFn: () => getChannelRedeems(twitchData!.id, twitchData!.token),
        enabled: !!twitchData?.id && !!twitchData?.token,
    });

    const usedRedeemIds = new Set(localRedeems.map((r) => r.redeemId));

    const redeemOptions = (redeems ?? [])
        .filter((r) => !usedRedeemIds.has(r.id))
        .map((r) => ({ label: r.title, value: r.id }));

    const bannerOptions = banners.map((b, i) => ({
        label: `Banner #${i + 1}`,
        value: b.id,
    }));

    const getBannerLabel = (bannerId: string) => {
        const idx = banners.findIndex((b) => b.id === bannerId);
        return idx >= 0 ? `Banner #${idx + 1}` : bannerId;
    };

    const getBannerImageUrl = (bannerId: string) => {
        const banner = banners.find((b) => b.id === bannerId);
        if (!banner?.imageSrc) return undefined;
        return `${env.VITE_BANNER_BUCKET_URI}/${banner.imageSrc}`;
    };

    const onAddMapping = () => {
        if (!selectedRedeemId || !selectedRedeemName || !selectedBannerId)
            return;
        const newMapping: BannerRedeem = {
            redeemId: selectedRedeemId,
            redeemName: selectedRedeemName,
            bannerId: selectedBannerId,
        };
        setLocalRedeems([...localRedeems, newMapping]);
        setSelectedRedeemId(undefined);
        setSelectedRedeemName(undefined);
        setSelectedBannerId(undefined);
    };

    const onRemoveMapping = (redeemId: string) => {
        setLocalRedeems(localRedeems.filter((r) => r.redeemId !== redeemId));
    };

    const onSave = async () => {
        if (!activeWorld) return;
        try {
            setSaving(true);
            const updated: World = { ...activeWorld, redeems: localRedeems };
            await updateWorld(updated);
            setActiveWorld(updated);
        } catch (error) {
            console.error("Error saving twitch config:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!activeWorld) {
        return <Text>No active world selected.</Text>;
    }

    if (isLoadingRedeems) {
        return <Spin />;
    }

    return (
        <div className={classes.container}>
            <div className={classes.section}>
                <Text strong>Active Mappings</Text>
                {localRedeems.length === 0 ? (
                    <Text type="secondary">No mappings yet.</Text>
                ) : (
                    <div className={classes.mappingList}>
                        {localRedeems.map((r) => (
                            <div key={r.redeemId} className={classes.mappingRow}>
                                <Text className={classes.redeemName}>
                                    {r.redeemName}
                                </Text>
                                <ArrowRightOutlined />
                                {getBannerImageUrl(r.bannerId) && (
                                    <img
                                        src={getBannerImageUrl(r.bannerId)}
                                        className={classes.bannerThumb}
                                        alt={getBannerLabel(r.bannerId)}
                                    />
                                )}
                                <Text className={classes.bannerName}>
                                    {getBannerLabel(r.bannerId)}
                                </Text>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<DeleteFilled />}
                                    danger
                                    onClick={() => onRemoveMapping(r.redeemId)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={classes.section}>
                <Text strong>Add Mapping</Text>
                <Flex gap={8} align="center" wrap="wrap">
                    <Select
                        className={classes.select}
                        placeholder="Select redeem"
                        value={selectedRedeemId}
                        options={redeemOptions}
                        onChange={(value, option) => {
                            setSelectedRedeemId(value);
                            setSelectedRedeemName(
                                (option as { label: string }).label,
                            );
                        }}
                    />
                    <Select
                        className={classes.select}
                        placeholder="Select banner"
                        value={selectedBannerId}
                        options={bannerOptions}
                        loading={isFetchingBanners}
                        onChange={(value) => setSelectedBannerId(value)}
                    />
                    <Button
                        onClick={onAddMapping}
                        disabled={!selectedRedeemId || !selectedBannerId}
                    >
                        + Add
                    </Button>
                </Flex>
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
