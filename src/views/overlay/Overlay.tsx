import { useEffect, useState } from "react";
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

export const Overlay = () => {
    const [searchParams] = useSearchParams();
    const channelId = searchParams.get("channelId");

    const [queue, setQueue] = useState<PullEvent[]>([]);
    const [current, setCurrent] = useState<PullEvent | null>(null);
    const [visible, setVisible] = useState(false);

    // Transparent background for OBS browser source
    useEffect(() => {
        document.body.style.background = "transparent";
        return () => {
            document.body.style.background = "";
        };
    }, []);

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
        setVisible(true);
    }, [current, queue]);

    // Auto-hide after display duration
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [visible]);

    // After exit animation completes, clear current to allow next dequeue
    useEffect(() => {
        if (visible || current === null) return;
        const timer = setTimeout(() => setCurrent(null), 500);
        return () => clearTimeout(timer);
    }, [visible, current]);

    return (
        <div className={classes.container}>
            {current && (
                <div className={`${classes.wrapper} ${visible ? classes.visible : classes.hidden}`}>
                    <div className={classes.viewerName}>¡@{current.viewerLogin} obtuvo!</div>
                    {current.itemType === "character" ? (
                        <CharacterCard character={current.item as Character} />
                    ) : (
                        <MaterialCard material={current.item as Material} />
                    )}
                </div>
            )}
        </div>
    );
};
