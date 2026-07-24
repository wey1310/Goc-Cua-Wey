import { useEffect, useState } from "react";

import {

    subscribeCharacters

} from "../services/characterService";

export default function useCharacters(

    initialCharacters = []

) {

    const [

    characters,

    setCharacters

] = useState(

    initialCharacters

);

const [

    loading,

    setLoading

] = useState(

    initialCharacters.length === 0

);

const loadCharacters = () => {

    return subscribeCharacters(

        data => {

            setCharacters(prev => {

                if (

                    JSON.stringify(prev) ===

                    JSON.stringify(data)

                ) {

                    return prev;

                }

                return data;

            });

            setLoading(false);

        }

    );

};

useEffect(() => {

    const unsubscribe = loadCharacters();

    return () => {

        unsubscribe();

    };

}, []);

return [

    characters,

    setCharacters,

    loadCharacters,

    loading

];

}