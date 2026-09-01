import {

    getCharacters,

    saveCharacters

} from "../services/characterService";

export const saveCharacter = (character) => {

    const list = getCharacters();

    const index = list.findIndex(

        item => item.id === character.id

    );

    if(index === -1){

        list.push(character);

    }

    else{

        list[index] = character;

    }

    saveCharacters(list);

    return list;

};

export const removeCharacter = (id) => {

    const list = getCharacters()

        .filter(

            item => item.id !== id

        );

    saveCharacters(list);

    return list;

};

export const duplicateCharacter = (character) => {

    const list = getCharacters();

    const copy = {

        ...character,

        id: Date.now(),

        name: character.name + " (Copy)"

    };

    list.push(copy);

    saveCharacters(list);

    return {

        list,

        copy

    };

};