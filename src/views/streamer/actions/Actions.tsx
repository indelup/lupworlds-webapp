import { useActionConfig } from "../assets/useAssetConfigs";
import { AssetList } from "../assets/AssetList";

export const Actions = () => {
    const config = useActionConfig();
    return <AssetList config={config} />;
};
