import { useEffect, useState } from "react";

import { getCharacters } from "../services/characterService";

export default function useCharacters() {

    const [

    characters,

    setCharacters

] = useState([]);

const [

    loading,

    setLoading

] = useState(true);

const loadCharacters = async () => {

    try {

        setLoading(true);

        const data = await getCharacters();

        setCharacters(data);

    }

    catch (error) {

        console.error(error);

    }

    finally {

        setLoading(false);

    }

};

useEffect(() => {

    void loadCharacters();

}, []);

return [

    characters,

    setCharacters,

    loadCharacters,

    loading

];

}