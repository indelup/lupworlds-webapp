import { Material } from "../../../types";
import classes from "./Materials.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { MaterialDelete } from "./MaterialDelete";
import { getMaterials } from "../../../utils";
import { AppState, useStore } from "../../../hooks/useStore";
import { MaterialCard } from "../../common/MaterialCard";
import { MaterialForm } from "./MaterialForm";

export const Materials = () => {
    const user = useStore((state: AppState) => state.user);
    const activeWorldId = user?.worldIds[0] || "";
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [materialId, setMaterialId] = useState("");
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!activeWorldId) {
                setMaterials([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedMaterials = await getMaterials(activeWorldId);
                setMaterials(fetchedMaterials);
            } catch (error) {
                console.error("Error fetching materials:", error);
                setMaterials([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [activeWorldId]);

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setFormOpen(true);
                    }}
                >
                    New Material
                </Button>
            </div>
            <div className={classes.cardList}>
                {loading ? (
                    <div>Loading materials...</div>
                ) : materials.length === 0 ? (
                    <div>No materials found for this world.</div>
                ) : (
                    materials.map((material) => {
                        return (
                            <Flex gap={8} vertical>
                                <MaterialCard
                                    material={material}
                                    key={material.id}
                                />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditFilled />}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                        onClick={() => {
                                            setDeleteOpen(true);
                                            setMaterialId(material.id);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        );
                    })
                )}
            </div>
            <MaterialForm
                open={formOpen}
                setOpen={setFormOpen}
                onMaterialCreated={() => {
                    // Refresh materials list when a new material is created
                    const fetchMaterials = async () => {
                        if (activeWorldId) {
                            try {
                                const fetchedMaterials =
                                    await getMaterials(activeWorldId);
                                setMaterials(fetchedMaterials);
                            } catch (error) {
                                console.error(
                                    "Error refreshing materials:",
                                    error,
                                );
                            }
                        }
                    };
                    fetchMaterials();
                }}
            />
            <MaterialDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                materialId={materialId}
                onMaterialDeleted={() => {
                    // Refresh material list when a material is deleted
                    const fetchMaterials = async () => {
                        if (activeWorldId) {
                            try {
                                const fetchedMaterials =
                                    await getMaterials(activeWorldId);
                                setMaterials(fetchedMaterials);
                                setMaterialId("");
                            } catch (error) {
                                console.error(
                                    "Error refreshing materials:",
                                    error,
                                );
                            }
                        }
                    };
                    fetchMaterials();
                }}
            />
        </>
    );
};
