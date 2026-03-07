import { Button, Flex, InputNumber, Modal, Select, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Character, Action, Material, Recipe, RecipeIngredient, World } from "@melda/lupworlds-types";
import { useState, useEffect } from "react";
import classes from "./CraftingForm.module.scss";

const { Text } = Typography;

interface CraftingFormProps {
    open: boolean;
    editItemId?: string;
    editRecipe?: Recipe;
    world: World;
    characters: Character[];
    actions: Action[];
    materials: Material[];
    onSave: (outputItemId: string, recipe: Recipe) => void;
    onClose: () => void;
    saving: boolean;
}

interface IngredientRow {
    materialId: string;
    quantity: number;
}

export const CraftingForm = ({
    open,
    editItemId,
    editRecipe,
    world,
    characters,
    actions,
    materials,
    onSave,
    onClose,
    saving,
}: CraftingFormProps) => {
    const [outputItemId, setOutputItemId] = useState<string | undefined>(editItemId);
    const [ingredients, setIngredients] = useState<IngredientRow[]>(
        editRecipe?.ingredients ?? [{ materialId: "", quantity: 1 }],
    );
    const [currencyId, setCurrencyId] = useState<string | undefined>(editRecipe?.currencyId);
    const [currencyAmount, setCurrencyAmount] = useState<number>(editRecipe?.currencyAmount ?? 1);

    useEffect(() => {
        if (open) {
            setOutputItemId(editItemId);
            setIngredients(editRecipe?.ingredients.map((i) => ({ ...i })) ?? [{ materialId: "", quantity: 1 }]);
            setCurrencyId(editRecipe?.currencyId);
            setCurrencyAmount(editRecipe?.currencyAmount ?? 1);
        }
    }, [open, editItemId, editRecipe]);

    const outputOptions = [
        {
            label: "Characters",
            options: characters.map((c) => ({ label: c.name, value: c.id, desc: c.description })),
        },
        {
            label: "Actions",
            options: actions.map((a) => ({ label: a.name, value: a.id, desc: a.description })),
        },
    ];

    const materialOptions = materials.map((m) => ({ label: m.name, value: m.id }));

    const currencyOptions = (world.currencies ?? []).map((c) => ({ label: c.name, value: c.id }));

    const existingRecipeKeys = new Set(Object.keys(world.recipes ?? {}));

    const onAddIngredient = () => {
        setIngredients((prev) => [...prev, { materialId: "", quantity: 1 }]);
    };

    const onRemoveIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const onIngredientChange = (index: number, field: keyof IngredientRow, value: string | number) => {
        setIngredients((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
        );
    };

    const isValid = () => {
        if (!outputItemId) return false;
        if (!editItemId && existingRecipeKeys.has(outputItemId)) return false;
        if (ingredients.length === 0) return false;
        if (ingredients.some((i) => !i.materialId || i.quantity <= 0)) return false;
        if (!currencyId || currencyAmount <= 0) return false;
        return true;
    };

    const onOk = () => {
        if (!outputItemId || !currencyId) return;
        const recipe: Recipe = {
            ingredients: ingredients as RecipeIngredient[],
            currencyId,
            currencyAmount,
        };
        onSave(outputItemId, recipe);
    };

    const duplicateWarning =
        !editItemId && outputItemId && existingRecipeKeys.has(outputItemId)
            ? "This item already has a recipe."
            : null;

    return (
        <Modal
            open={open}
            title={editItemId ? "Edit Recipe" : "New Recipe"}
            onCancel={onClose}
            onOk={onOk}
            okButtonProps={{ disabled: !isValid(), loading: saving }}
            okText="Save"
            destroyOnClose
        >
            <div className={classes.form}>
                <div>
                    <Text strong>Output Item</Text>
                    <Select
                        style={{ width: "100%", marginTop: 4 }}
                        placeholder="Select character or action"
                        value={outputItemId}
                        options={outputOptions}
                        onChange={setOutputItemId}
                        disabled={!!editItemId}
                        optionRender={(option) => {
                            const desc = outputOptions
                                .flatMap((g) => g.options)
                                .find((o) => o.value === option.value)?.desc;
                            return (
                                <Flex vertical>
                                    <Text>{option.label}</Text>
                                    {desc && (
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {desc}
                                        </Text>
                                    )}
                                </Flex>
                            );
                        }}
                    />
                    {duplicateWarning && (
                        <Text type="danger" style={{ fontSize: 12 }}>
                            {duplicateWarning}
                        </Text>
                    )}
                </div>

                <div>
                    <Flex justify="space-between" align="center">
                        <Text strong>Ingredients</Text>
                        <Button color="cyan" variant="solid" size="small" icon={<PlusOutlined />} onClick={onAddIngredient}>
                            Add
                        </Button>
                    </Flex>
                    <div className={classes.ingredientList} style={{ marginTop: 4 }}>
                        {ingredients.map((row, index) => (
                            <div key={index} className={classes.ingredientRow}>
                                <Select
                                    className={classes.ingredientSelect}
                                    placeholder="Select material"
                                    value={row.materialId || undefined}
                                    options={materialOptions}
                                    onChange={(val) => onIngredientChange(index, "materialId", val)}
                                />
                                <InputNumber
                                    className={classes.quantityInput}
                                    min={1}
                                    value={row.quantity}
                                    onChange={(val) => onIngredientChange(index, "quantity", val ?? 1)}
                                />
                                <Button
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={() => onRemoveIngredient(index)}
                                    disabled={ingredients.length === 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Text strong>Currency</Text>
                    <Flex gap={8} style={{ marginTop: 4 }}>
                        <Select
                            style={{ flex: 1 }}
                            placeholder="Select currency"
                            value={currencyId}
                            options={currencyOptions}
                            onChange={setCurrencyId}
                        />
                        <InputNumber
                            min={1}
                            value={currencyAmount}
                            onChange={(val) => setCurrencyAmount(val ?? 1)}
                            placeholder="Amount"
                            style={{ width: 100 }}
                        />
                    </Flex>
                </div>
            </div>
        </Modal>
    );
};
