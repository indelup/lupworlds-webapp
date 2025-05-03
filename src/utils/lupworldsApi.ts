import { ROLE } from "../types";

export const fetchUser = (twitchId: string) => {
    // Dummy data because we have no API
    const user = {
        id: "fake-id",
        twitchId: twitchId,
        alias: "Meldarion",
        allowedRoles: [ROLE.VIEWER, ROLE.STREAMER],
        worldIds: ["Indelup"],
    };

    return user;
};
