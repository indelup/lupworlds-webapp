import { Material } from "../../../types";
import classes from "./Materials.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { MaterialDelete } from "./MaterialDelete";
import { AppState, useStore } from "../../../hooks/useStore";
import { MaterialCard } from "../../common/MaterialCard";
import { MaterialForm } from "./MaterialForm";
import { useMaterialClient } from "../../../hooks/useMaterialClient";

export const Materials = () => {
    const activeWorldId = useStore((state: AppState) => state.activeWorldId);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeMaterial, setActiveMaterial] = useState<
        Material | undefined
    >();

    const { materials, isFetching: loading } = useMaterialClient(activeWorldId);

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setActiveMaterial(undefined);
                        setFormMode("create");
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
                            <Flex gap={8} vertical key={material.id}>
                                <MaterialCard material={material} />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        onClick={() => {
                                            setActiveMaterial(material);
                                            setFormMode("edit");
                                            setFormOpen(true);
                                        }}
                                        icon={<EditFilled />}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteFilled />}
                                        danger
                                        onClick={() => {
                                            setActiveMaterial(material);
                                            setDeleteOpen(true);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        );
                    })
                )}
            </div>
            {formOpen && (
                <MaterialForm
                    open={formOpen}
                    setOpen={setFormOpen}
                    mode={formMode}
                    onMaterialCreated={() => {}}
                    onClose={() => {
                        setActiveMaterial(undefined);
                    }}
                    existingMaterial={activeMaterial}
                />
            )}
            <MaterialDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                materialId={activeMaterial?.id || ""}
                onMaterialDeleted={() => {
                    setActiveMaterial(undefined);
                }}
            />
        </>
    );
};
