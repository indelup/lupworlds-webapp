import { Action } from "@melda/lupworlds-types";
import classes from "./Actions.module.scss";
import { Button, Flex } from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ActionForm } from "./ActionForm";
import { ActionDelete } from "./ActionDelete";
import { ActionCard } from "../../common/ActionCard";
import { CardPlaceholder } from "../../common/CardPlaceholder";
import { AppState, useStore } from "../../../hooks/useStore";
import { useActionClient } from "../../../hooks/useActionClient";

export const Actions = () => {
    const activeWorld = useStore((state: AppState) => state.activeWorld);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeAction, setActiveAction] = useState<Action | undefined>();

    const { actions, isFetching: loading } = useActionClient(activeWorld?.id ?? "");

    return (
        <>
            <div className={classes.actions}>
                <Button
                    icon={<PlusOutlined />}
                    color="cyan"
                    variant="solid"
                    onClick={() => {
                        setActiveAction(undefined);
                        setFormMode("create");
                        setFormOpen(true);
                    }}
                >
                    New Action
                </Button>
            </div>
            <div className={classes.cardList}>
                {loading ? (
                    Array.from({ length: 5 }, (_, i) => <CardPlaceholder key={i} />)
                ) : actions.length === 0 ? (
                    <div>No actions found for this world.</div>
                ) : (
                    actions.map((action) => {
                        return (
                            <Flex key={action.id} gap={8} vertical>
                                <ActionCard action={action} />
                                <Flex gap={4} justify="end" className="mt-4">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        onClick={() => {
                                            setActiveAction(action);
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
                                            setActiveAction(action);
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
                <ActionForm
                    open={formOpen}
                    setOpen={setFormOpen}
                    mode={formMode}
                    onActionCreated={() => {}}
                    onClose={() => {
                        setActiveAction(undefined);
                    }}
                    existingAction={activeAction}
                />
            )}
            <ActionDelete
                open={deleteOpen}
                setOpen={setDeleteOpen}
                actionId={activeAction?.id || ""}
                onActionDeleted={() => {
                    setActiveAction(undefined);
                }}
            />
        </>
    );
};
