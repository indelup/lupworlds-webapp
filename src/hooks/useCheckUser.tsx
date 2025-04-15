import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AppState, useStore } from "src/hooks/useStore";

export const useCheckUser = () => {
    const user = useStore((state: AppState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);
};
