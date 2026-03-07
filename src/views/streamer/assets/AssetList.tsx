import classes from "./AssetList.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AssetForm } from "./AssetForm";
import { AssetDelete } from "./AssetDelete";
import { AssetCard } from "./AssetCard";
import { CardPlaceholder } from "../../common/CardPlaceholder";
import { AssetConfig, AssetItem } from "./assetTypes";

type AssetListProps = {
    config: AssetConfig;
};

export const AssetList = ({ config }: AssetListProps) => {
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<AssetItem | undefined>();

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setActiveItem(undefined);
                        setFormMode("create");
                        setFormOpen(true);
                    }}
                >
                    New {config.labels.singular}
                </Button>
            </div>
            <div className={classes.cardList}>
                {config.isFetching ? (
                    Array.from({ length: 5 }, (_, i) => <CardPlaceholder key={i} />)
                ) : config.items.length === 0 ? (
                    <div>No {config.labels.singular.toLowerCase()}s found for this world.</div>
                ) : (
                    config.items.map((item) => (
                        <Flex key={item.id} gap={8} vertical>
                            <AssetCard item={item} bucketUri={config.bucketUri} />
                            <Flex gap={4} justify="end" className="mt-4">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    onClick={() => {
                                        setActiveItem(item);
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
                                        setActiveItem(item);
                                        setDeleteOpen(true);
                                    }}
                                />
                            </Flex>
                        </Flex>
                    ))
                )}
            </div>
            {formOpen && (
                <AssetForm
                    open={formOpen}
                    setOpen={setFormOpen}
                    mode={formMode}
                    onSaved={() => {}}
                    onClose={() => setActiveItem(undefined)}
                    existingItem={activeItem}
                    config={config}
                />
            )}
            <AssetDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                itemId={activeItem?.id ?? ""}
                onDeleted={() => setActiveItem(undefined)}
                config={config}
            />
        </>
    );
};
