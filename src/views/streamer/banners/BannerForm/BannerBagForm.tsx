import { Button, Select, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BannerBag, Character, Material } from "@melda/lupworlds-types";
import classes from "./BannerForm.module.scss";
import { AssetCard } from "../../assets/AssetCard";
import { characterToAsset, materialToAsset } from "../../assets/assetMappers";
import env from "../../../../env";

type BannerBagFormProps = {
    bag: BannerBag;
    bagIndex: number;
    removeBagFromBanner: (bagIndex: number) => void;
    addItemToBag: (
        index: number,
        value: string,
        type: "character" | "material",
    ) => void;
    removeItemFromBag: (itemId: string, bagIndex: number) => void;
    updateBagChance: (bagIndex: number, chance: number) => void;
    characterOptions: { value: string; label: string }[];
    materialsOptions: { value: string; label: string }[];
    characters: Character[];
    materials: Material[];
};

export const BannerBagForm = (props: BannerBagFormProps) => {
    const {
        bag,
        bagIndex,
        removeBagFromBanner,
        addItemToBag,
        removeItemFromBag,
        updateBagChance,
        characters,
        characterOptions,
        materials,
        materialsOptions,
    } = props;

    return (
        <div className={classes.bagContainer}>
            <div className={classes.bagForm}>
                <Select
                    placeholder="Añadir Personaje"
                    onSelect={(v) => {
                        addItemToBag(bagIndex, v, "character");
                    }}
                    options={characterOptions}
                    value="Añadir Personaje"
                />
                <Select
                    placeholder="Añadir Material"
                    onSelect={(v) => {
                        addItemToBag(bagIndex, v, "material");
                    }}
                    options={materialsOptions as any}
                    value="Añadir Material"
                />
                <Input
                    placeholder="Probabilidad"
                    type="number"
                    min={0}
                    value={bag.chance}
                    onChange={(e) =>
                        updateBagChance(bagIndex, Number(e.target.value))
                    }
                />
                <Button
                    color="danger"
                    variant="solid"
                    onClick={() => {
                        removeBagFromBanner(bagIndex);
                    }}
                    icon={<DeleteOutlined />}
                >
                    Eliminar Bolsa
                </Button>
            </div>
            <div className={classes.bagItemList}>
                {characters.map((character) => {
                    for (const item of bag.items) {
                        if (
                            item.type === "character" &&
                            item.itemId === character.id
                        ) {
                            return (
                                <div className={classes.bagItem}>
                                    <AssetCard item={characterToAsset(character)} bucketUri={env.VITE_CHARACTER_BUCKET_URI} />
                                    <Button
                                        size="large"
                                        variant="solid"
                                        onClick={() => {
                                            removeItemFromBag(
                                                character.id,
                                                bagIndex,
                                            );
                                        }}
                                        icon={<DeleteOutlined />}
                                        color="danger"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            );
                        }
                    }
                })}
                {materials.map((material) => {
                    for (const item of bag.items) {
                        if (
                            item.type === "material" &&
                            item.itemId === material.id
                        ) {
                            return (
                                <div className={classes.bagItem}>
                                    <AssetCard item={materialToAsset(material)} bucketUri={env.VITE_MATERIAL_BUCKET_URI} />
                                    <Button
                                        size="large"
                                        variant="solid"
                                        onClick={() => {
                                            removeItemFromBag(
                                                material.id,
                                                bagIndex,
                                            );
                                        }}
                                        icon={<DeleteOutlined />}
                                        color="danger"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            );
                        }
                    }
                })}
            </div>
        </div>
    );
};
