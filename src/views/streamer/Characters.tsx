import { Character } from "src/types";

export const Characters = () => {
    // TODO - This should fetch characters from the API
    const characters: Character[] = [
        {
            id: "testCharacter",
            worldId: "Indelup",
            name: "Melda",
            description: "A",
            frontImage: "path1",
            backImage: "path2",
            rarity: 5,
        },
    ];

    // TODO: DISPLAY CHARACTERS
    // TODO: ADD CREATE CHARACTER BUTTON
    // TODO: USE API INSTEAD OF TEST DATA

    return <div>Vista de Personajes</div>;
};
