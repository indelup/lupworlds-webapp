import { Button, Divider, Flex, message, Select, Spin, Typography } from "antd";
import { ArrowRightOutlined, CopyOutlined, DeleteFilled, DesktopOutlined, GiftOutlined, PlayCircleOutlined, RobotOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { BannerRedeem, World } from "@melda/lupworlds-types";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppState, useStore } from "../../../hooks/useStore";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { useBannerClient } from "../../../hooks/useBannerClient";
import { getChannelRedeems } from "../../../utils/twitchApi";
import { getBotStatus, startBot, stopBot } from "../../../utils/botApi";
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
    const [botActionLoading, setBotActionLoading] = useState(false);

    useEffect(() => {
        if (activeWorld) {
            setLocalRedeems(activeWorld.redeems ?? []);
        }
    }, [activeWorld]);

    const {
        data: botActive,
        isLoading: isLoadingBotStatus,
        refetch: refetchBotStatus,
    } = useQuery({
        queryKey: ["bot-status", twitchData?.id],
        queryFn: () => getBotStatus(twitchData!.id),
        enabled: !!twitchData?.id,
        retry: false,
    });

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
        return `${env.VITE_CONFIG_BUCKET_URI}/${banner.imageSrc}`;
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

    const onToggleBot = async () => {
        if (!twitchData) return;
        try {
            setBotActionLoading(true);
            if (botActive) {
                await stopBot(twitchData.id);
            } else {
                await startBot(twitchData.id, twitchData.token);
            }
            await refetchBotStatus();
        } catch (error) {
            console.error("Bot toggle error:", error);
        } finally {
            setBotActionLoading(false);
        }
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
            <Text strong><GiftOutlined /> Redeem Mappings</Text>
            <div className={classes.section}>
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

            <div className={classes.section}>
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

            <Button
                type="primary"
                onClick={onSave}
                loading={saving || isUpdating}
                icon={<SaveOutlined />}
            >
                Save
            </Button>

            <Divider />

            <div className={classes.section}>
                <Text strong><DesktopOutlined /> Overlay</Text>
                <Button
                    icon={<CopyOutlined />}
                    onClick={() => {
                        const url = `${window.location.origin}/overlay?channelId=${twitchData?.id}&worldId=${activeWorld.id}`;
                        navigator.clipboard.writeText(url);
                        message.success("Overlay URL copied to clipboard");
                    }}
                >
                    Copy Overlay URL
                </Button>
            </div>

            <Divider />

            <div className={classes.section}>
                <Text strong><RobotOutlined /> Bot</Text>
                <Flex align="center" gap={12}>
                    {isLoadingBotStatus ? (
                        <Spin size="small" />
                    ) : (
                        <Text type={botActive ? "success" : "secondary"}>
                            {botActive ? "Running" : "Stopped"}
                        </Text>
                    )}
                    <Button
                        type="primary"
                        danger={!!botActive}
                        icon={botActive ? <StopOutlined /> : <PlayCircleOutlined />}
                        loading={botActionLoading}
                        disabled={isLoadingBotStatus}
                        onClick={onToggleBot}
                    >
                        {botActive ? "Stop Bot" : "Start Bot"}
                    </Button>
                </Flex>
            </div>
        </div>
    );
};
