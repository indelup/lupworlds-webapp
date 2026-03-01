import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { Character, Material } from "@melda/lupworlds-types";
import { CharacterCard } from "../common/CharacterCard";
import { MaterialCard } from "../common/MaterialCard";
import classes from "./Overlay.module.scss";
import env from "../../env";

interface PullEvent {
    channelId: string;
    viewerLogin: string;
    itemType: "character" | "material";
    item: Character | Material;
}

const getBucketUri = (itemType: PullEvent["itemType"]) =>
    itemType === "character" ? env.VITE_CHARACTER_BUCKET_URI : env.VITE_MATERIAL_BUCKET_URI;

const getBackSrc = (event: PullEvent): string => {
    const { item, itemType } = event;
    if (!item.backgroundSrc) return "";
    return `${getBucketUri(itemType)}/${item.backgroundSrc}`;
};

const getImageUrls = (event: PullEvent): string[] => {
    const { item, itemType } = event;
    const base = getBucketUri(itemType);
    const urls: string[] = [];
    if (item.backgroundSrc) urls.push(`${base}/${item.backgroundSrc}`);
    const mainSrc =
        itemType === "character"
            ? (item as Character).characterSrc
            : (item as Material).materialSrc;
    if (mainSrc) urls.push(`${base}/${mainSrc}`);
    return urls;
};

export const Overlay = () => {
    const [searchParams] = useSearchParams();
    const channelId = searchParams.get("channelId");

    const [queue, setQueue] = useState<PullEvent[]>([]);
    const [current, setCurrent] = useState<PullEvent | null>(null);
    const [visible, setVisible] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const hasBeenVisible = useRef(false);

    // WebSocket connection
    useEffect(() => {
        const ws = new WebSocket(env.VITE_BOT_WS_URL);
        ws.onmessage = (event) => {
            const pullEvent = JSON.parse(event.data) as PullEvent;
            if (channelId && pullEvent.channelId !== channelId) return;
            setQueue((prev) => [...prev, pullEvent]);
        };
        ws.onerror = (e) => console.error("Overlay WS error", e);
        return () => ws.close();
    }, []);

    // Dequeue next when current slot is free
    useEffect(() => {
        if (current !== null || queue.length === 0) return;
        const [next, ...rest] = queue;
        setQueue(rest);
        setCurrent(next);
    }, [current, queue]);

    // Preload card images when current is set, reset flip when cleared
    useEffect(() => {
        if (!current) {
            setFlipped(false);
            return;
        }
        const urls = getImageUrls(current);
        if (urls.length === 0) {
            setVisible(true);
            return;
        }
        let cancelled = false;
        let loaded = 0;
        const onSettle = () => {
            loaded++;
            if (!cancelled && loaded === urls.length) setVisible(true);
        };
        urls.forEach((url) => {
            const img = new Image();
            img.onload = onSettle;
            img.onerror = onSettle;
            img.src = url;
        });
        return () => {
            cancelled = true;
        };
    }, [current]);

    // Auto-hide and flip card when visible
    useEffect(() => {
        if (!visible) return;
        const hideTimer = setTimeout(() => setVisible(false), 4000);
        const flipTimer = setTimeout(() => setFlipped(true), 1500);
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(flipTimer);
        };
    }, [visible]);

    // After exit animation completes, clear current to allow next dequeue
    useEffect(() => {
        if (visible) {
            hasBeenVisible.current = true;
            return;
        }
        if (!hasBeenVisible.current || current === null) return;
        hasBeenVisible.current = false;
        const timer = setTimeout(() => setCurrent(null), 500);
        return () => clearTimeout(timer);
    }, [visible, current]);

return (
        <div className={classes.container}>
            {current && (
                <div className={`${classes.wrapper} ${visible ? classes.visible : classes.hidden}`}>
                    <div className={classes.viewerName}>¡@{current.viewerLogin} obtuvo!</div>
                    <div className={classes.flipContainer}>
                        <div className={`${classes.flipInner} ${flipped ? classes.flipped : ""}`}>
                            <div className={classes.flipBack}>
                                <img src={getBackSrc(current)} alt="" />
                            </div>
                            <div className={classes.flipFront}>
                                {current.itemType === "character" ? (
                                    <CharacterCard character={current.item as Character} />
                                ) : (
                                    <MaterialCard material={current.item as Material} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
