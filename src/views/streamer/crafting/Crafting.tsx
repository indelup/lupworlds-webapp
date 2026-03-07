import { Button, Flex, Spin, Tag, Typography } from "antd";
import { DeleteFilled, EditFilled, ExperimentOutlined, PlusOutlined } from "@ant-design/icons";
import { Recipe, World } from "@melda/lupworlds-types";
import { useState } from "react";
import { AppState, useStore } from "../../../hooks/useStore";
import env from "../../../env";
import { useWorldClient } from "../../../hooks/useWorldClient";
import { useCharacterClient } from "../../../hooks/useCharacterClient";
import { useActionClient } from "../../../hooks/useActionClient";
import { useMaterialClient } from "../../../hooks/useMaterialClient";
import { CraftingForm } from "./CraftingForm";
import { CraftingDelete } from "./CraftingDelete";
import classes from "./Crafting.module.scss";

const { Text } = Typography;

export const Crafting = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const setActiveWorld = useStore((state: AppState) => state.setActiveWorld);
    const { world, isFetching, updateWorld, isUpdating } = useWorldClient(activeWorld?.id ?? "");
    const { characters } = useCharacterClient(activeWorld?.id ?? "");
    const { actions } = useActionClient(activeWorld?.id ?? "");
    const { materials } = useMaterialClient(activeWorld?.id ?? "");

    const [formOpen, setFormOpen] = useState(false);
    const [editItemId, setEditItemId] = useState<string | undefined>();
    const [editRecipe, setEditRecipe] = useState<Recipe | undefined>();
    const [deleteItemId, setDeleteItemId] = useState<string | undefined>();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!activeWorld) {
        return <Text>No active world selected.</Text>;
    }

    if (isFetching && !world) {
        return <Spin />;
    }

    const recipes = world?.recipes ?? {};

    const resolveItem = (itemId: string): { name: string; description: string; type: "character" | "action" | "unknown" } => {
        const char = characters.find((c) => c.id === itemId);
        if (char) return { name: char.name, description: char.description, type: "character" };
        const action = actions.find((a) => a.id === itemId);
        if (action) return { name: action.name, description: action.description, type: "action" };
        return { name: itemId, description: "", type: "unknown" };
    };

    const resolveMaterialName = (materialId: string): string => {
        return materials.find((m) => m.id === materialId)?.name ?? materialId;
    };

    const resolveCurrencyLogoUrl = (currencyId: string): string | undefined => {
        const currency = (world?.currencies ?? []).find((c) => c.id === currencyId);
        if (!currency?.image) return undefined;
        return `${env.VITE_CONFIG_BUCKET_URI}/${currency.image}`;
    };

    const resolveCurrencyName = (currencyId: string): string => {
        return (world?.currencies ?? []).find((c) => c.id === currencyId)?.name ?? currencyId;
    };

    const onNew = () => {
        setEditItemId(undefined);
        setEditRecipe(undefined);
        setFormOpen(true);
    };

    const onEdit = (itemId: string, recipe: Recipe) => {
        setEditItemId(itemId);
        setEditRecipe(recipe);
        setFormOpen(true);
    };

    const onDelete = (itemId: string) => {
        setDeleteItemId(itemId);
    };

    const onSave = async (outputItemId: string, recipe: Recipe) => {
        if (!world) return;
        try {
            setSaving(true);
            const updatedRecipes = { ...world.recipes, [outputItemId]: recipe };
            const updated: World = { ...world, recipes: updatedRecipes };
            await updateWorld(updated);
            setActiveWorld(updated);
            setFormOpen(false);
        } catch (error) {
            console.error("Error saving recipe:", error);
        } finally {
            setSaving(false);
        }
    };

    const onConfirmDelete = async () => {
        if (!world || !deleteItemId) return;
        try {
            setDeleting(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [deleteItemId]: _, ...remainingRecipes } = world.recipes ?? {};
            const updated: World = { ...world, recipes: remainingRecipes };
            await updateWorld(updated);
            setActiveWorld(updated);
            setDeleteItemId(undefined);
        } catch (error) {
            console.error("Error deleting recipe:", error);
        } finally {
            setDeleting(false);
        }
    };

    const deleteItemName = deleteItemId ? resolveItem(deleteItemId).name : "";

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Text strong>
                    <ExperimentOutlined /> Crafting Recipes
                </Text>
                <Button color="cyan" variant="solid" icon={<PlusOutlined />} onClick={onNew}>
                    New Recipe
                </Button>
            </div>

            {Object.keys(recipes).length === 0 ? (
                <Text type="secondary">No recipes yet.</Text>
            ) : (
                <div className={classes.recipeList}>
                    {Object.entries(recipes).map(([itemId, recipe]) => {
                        const { name, description, type } = resolveItem(itemId);
                        const currencyLogoUrl = resolveCurrencyLogoUrl(recipe.currencyId);
                        const currencyName = resolveCurrencyName(recipe.currencyId);
                        return (
                            <div key={itemId} className={classes.recipeRow}>
                                <div className={classes.recipeInfo}>
                                    <Flex align="center" gap={8}>
                                        <Text className={classes.outputName}>{name}</Text>
                                        {description && (
                                            <Text type="secondary" className={classes.description}>
                                                {description}
                                            </Text>
                                        )}
                                        <Tag color={type === "character" ? "blue" : type === "action" ? "purple" : "default"}>
                                            {type}
                                        </Tag>
                                    </Flex>
                                    <div className={classes.ingredients}>
                                        {recipe.ingredients.map((ing, i) => (
                                            <Tag key={i}>
                                                {resolveMaterialName(ing.materialId)} ×{ing.quantity}
                                            </Tag>
                                        ))}
                                    </div>
                                    <Flex align="center" gap={4} className={classes.currency}>
                                        <Text>Cost: {recipe.currencyAmount}</Text>
                                        {currencyLogoUrl ? (
                                            <img src={currencyLogoUrl} className={classes.currencyIcon} alt={currencyName} />
                                        ) : (
                                            <Text>{currencyName}</Text>
                                        )}
                                    </Flex>
                                </div>
                                <div className={classes.actions}>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditFilled />}
                                        onClick={() => onEdit(itemId, recipe)}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        danger
                                        icon={<DeleteFilled />}
                                        onClick={() => onDelete(itemId)}
                                        loading={deleting && deleteItemId === itemId}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {formOpen && world && (
                <CraftingForm
                    open={formOpen}
                    editItemId={editItemId}
                    editRecipe={editRecipe}
                    world={world}
                    characters={characters}
                    actions={actions}
                    materials={materials}
                    onSave={onSave}
                    onClose={() => setFormOpen(false)}
                    saving={saving || isUpdating}
                />
            )}

            <CraftingDelete
                open={!!deleteItemId}
                outputItemName={deleteItemName}
                onConfirm={onConfirmDelete}
                onClose={() => setDeleteItemId(undefined)}
                deleting={deleting}
            />
        </div>
    );
};
