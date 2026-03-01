import { Material } from "@melda/lupworlds-types";
import classes from "./Materials.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { MaterialDelete } from "./MaterialDelete";
import { AppState, useStore } from "../../../hooks/useStore";
import { MaterialCard } from "../../common/MaterialCard";
import { CardPlaceholder } from "../../common/CardPlaceholder";
import { MaterialForm } from "./MaterialForm";
import { useMaterialClient } from "../../../hooks/useMaterialClient";

export const Materials = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeMaterial, setActiveMaterial] = useState<
        Material | undefined
    >();

    const { materials, isFetching: loading } = useMaterialClient(activeWorld?.id ?? "");

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
                    Array.from({ length: 5 }, (_, i) => <CardPlaceholder key={i} />)
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
