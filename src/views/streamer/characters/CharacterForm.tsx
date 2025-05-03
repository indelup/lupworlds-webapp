import { Button } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

type CharacterFormProps = {
    onClose: () => void;
};

export const CharacterForm = (props: CharacterFormProps) => {
    return (
        <div>
            Form Here{" "}
            <Button
                icon={<CloseOutlined />}
                color="red"
                variant="solid"
                onClick={props.onClose}
            >
                Cancel
            </Button>
            <Button
                icon={<SaveOutlined />}
                color="cyan"
                variant="solid"
                onClick={() => {
                    props.onClose();
                }}
            >
                Save
            </Button>
        </div>
    );
};
