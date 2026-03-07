import { useMaterialConfig } from "../assets/useAssetConfigs";
import { AssetList } from "../assets/AssetList";

export const Materials = () => {
    const config = useMaterialConfig();
    return <AssetList config={config} />;
};
