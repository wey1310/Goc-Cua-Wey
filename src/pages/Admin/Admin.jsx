import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCharacters from "../../hooks/useCharacters";

import styles from "./Admin.module.css";

import homeBtn from "../../assets/ui/home.png";
import leaves from "../../assets/effect/leaves..gif";

import Dashboard from "../../components/Admin/Dashboard";
import Toolbar from "../../components/Admin/Toolbar";
import Sidebar from "../../components/Admin/Sidebar";
import LeafEditor from "../../components/Admin/LeafEditor";

// ================= Empty Character =================

const EMPTY_CHARACTER = {

    name: "",

    avatar: "",

    quote: "",

    tags: [],

    ggai: "",

    plot: "",

    views: 0,

    leafCount: 1

};

function Admin() {

    const navigate = useNavigate();

    const [

        characters,

        ,

        loadCharacters

    ] = useCharacters();

    const [

        selectedCharacter,

        setSelectedCharacter

    ] = useState(null);

    const [

        search,

        setSearch

    ] = useState("");


    // ================= Create =================

    const createCharacter = () => {

        setSelectedCharacter({

            ...EMPTY_CHARACTER

        });

    };

    // ================= Search =================

    const filteredCharacters = useMemo(() => {

        const keyword =

            search

                .trim()

                .toLowerCase();

        if (!keyword) {

            return characters;

        }

        return characters.filter(item => {

            return (

                (item.name || "")

                    .toLowerCase()

                    .includes(keyword)

                ||

                (item.quote || "")

                    .toLowerCase()

                    .includes(keyword)

                ||

                (item.ggai || "")

                    .toLowerCase()

                    .includes(keyword)

                ||

                (item.plot || "")

                    .toLowerCase()

                    .includes(keyword)

                ||

                (item.tags || [])

                    .join(" ")

                    .toLowerCase()

                    .includes(keyword)

            );

        });

    }, [

        characters,

        search

    ]);
        // ================= JSX =================

    return (

        <div className={styles.container}>

            <div className={styles.leafContainer}>

                <img

                    src={leaves}

                    className={styles.leaf1}

                    alt=""

                />

                <img

                    src={leaves}

                    className={styles.leaf2}

                    alt=""

                />

                <img

                    src={leaves}

                    className={styles.leaf3}

                    alt=""

                />

            </div>

            <div className={styles.wrapper}>

                <div className={styles.title}>

                    <h1>

                        🍃 Góc của Wey

                    </h1>

                    <p>

                        Trang gieo trồng Lá Trà

                    </p>

                </div>

                <Toolbar

                    search={search}

                    setSearch={setSearch}

                    onAdd={createCharacter}

                />

                <Dashboard

                    characters={characters}

                />

                <div className={styles.panel}>

                    <Sidebar

                        characters={filteredCharacters}

                        onSelect={setSelectedCharacter}

                    />

                    <LeafEditor

                        character={selectedCharacter}

                        refreshCharacters={loadCharacters}

                        setSelectedCharacter={setSelectedCharacter}

                    />

                </div>

            </div>

            <button

                className={styles.homeButton}

                onClick={() => navigate("/home")}

            >

                <img

                    src={homeBtn}

                    alt="Home"

                />

            </button>

        </div>

    );

}

export default Admin;