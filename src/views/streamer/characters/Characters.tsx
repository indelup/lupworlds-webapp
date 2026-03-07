import { useCharacterConfig } from "../assets/useAssetConfigs";
import { AssetList } from "../assets/AssetList";

export const Characters = () => {
    const config = useCharacterConfig();
    return <AssetList config={config} />;
};
