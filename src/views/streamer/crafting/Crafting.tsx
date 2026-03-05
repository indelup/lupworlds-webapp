import { Button, Flex, Spin, Tag, Typography } from "antd";
import { DeleteFilled, EditFilled, ExperimentOutlined, PlusOutlined } from "@ant-design/icons";
import { Recipe, World } from "@melda/lupworlds-types";
import { useState } from "react";
import { AppState, useStore } from "../../../hooks/useStore";
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

    const resolveItemName = (itemId: string): { name: string; type: "character" | "action" | "unknown" } => {
        const char = characters.find((c) => c.id === itemId);
        if (char) return { name: char.name, type: "character" };
        const action = actions.find((a) => a.id === itemId);
        if (action) return { name: action.name, type: "action" };
        return { name: itemId, type: "unknown" };
    };

    const resolveMaterialName = (materialId: string): string => {
        return materials.find((m) => m.id === materialId)?.name ?? materialId;
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

    const deleteItemName = deleteItemId ? resolveItemName(deleteItemId).name : "";

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Text strong>
                    <ExperimentOutlined /> Crafting Recipes
                </Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
                    New Recipe
                </Button>
            </div>

            {Object.keys(recipes).length === 0 ? (
                <Text type="secondary">No recipes yet.</Text>
            ) : (
                <div className={classes.recipeList}>
                    {Object.entries(recipes).map(([itemId, recipe]) => {
                        const { name, type } = resolveItemName(itemId);
                        return (
                            <div key={itemId} className={classes.recipeRow}>
                                <div className={classes.recipeInfo}>
                                    <Flex align="center" gap={8}>
                                        <Text className={classes.outputName}>{name}</Text>
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
                                    <Text className={classes.currency}>
                                        Cost: {recipe.currencyAmount} {resolveCurrencyName(recipe.currencyId)}
                                    </Text>
                                </div>
                                <div className={classes.actions}>
                                    <Button
                                        icon={<EditFilled />}
                                        onClick={() => onEdit(itemId, recipe)}
                                    />
                                    <Button
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
