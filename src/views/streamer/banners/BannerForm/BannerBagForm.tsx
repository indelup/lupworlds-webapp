import { Button, Select, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BannerBag, Character, Material } from "../../../../types";
import classes from "./BannerForm.module.scss";
import { CharacterCard } from "../../../common/CharacterCard";

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
                />
                <Input placeholder="Probabilidad" />
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
                                    <CharacterCard character={character} />
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
            </div>
        </div>
    );
};
