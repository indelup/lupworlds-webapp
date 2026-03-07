export interface AssetItem {
    id: string;
    worldId: string;
    name: string;
    description: string;
    artist: string;
    mainSrc: string;
    backgroundSrc: string;
    rarity: number;
    createdAt?: string;
}

export interface AssetConfig {
    items: AssetItem[];
    isFetching: boolean;
    bucketType: "characters" | "materials" | "actions";
    create: (item: Omit<AssetItem, "id">) => Promise<AssetItem>;
    update: (item: AssetItem) => Promise<AssetItem>;
    delete: (id: string) => Promise<void>;
    fetch: () => void;
    labels: {
        singular: string;
        mainImageLabel: string;
    };
}
