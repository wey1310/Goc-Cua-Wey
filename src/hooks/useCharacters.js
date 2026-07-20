import { useEffect, useState } from "react";

import {

    subscribeCharacters

} from "../services/characterService";

export default function useCharacters() {

    const [

    characters,

    setCharacters

] = useState([]);

const [

    loading,

    setLoading

] = useState(true);

const loadCharacters = () => {

    setLoading(true);

    return subscribeCharacters(data => {

        setCharacters(data);

        setLoading(false);

    });

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