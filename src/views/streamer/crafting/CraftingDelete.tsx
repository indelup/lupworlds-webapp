import { Modal, Typography } from "antd";

const { Text } = Typography;

interface CraftingDeleteProps {
    open: boolean;
    outputItemName: string;
    onConfirm: () => void;
    onClose: () => void;
    deleting: boolean;
}

export const CraftingDelete = ({
    open,
    outputItemName,
    onConfirm,
    onClose,
    deleting,
}: CraftingDeleteProps) => {
    return (
        <Modal
            open={open}
            title="Delete Recipe"
            onCancel={onClose}
            onOk={onConfirm}
            okButtonProps={{ color: "danger", loading: deleting }}
            okText="Delete"
        >
            <Text>
                Are you sure you want to delete the recipe for <Text strong>{outputItemName}</Text>?
            </Text>
        </Modal>
    );
};
