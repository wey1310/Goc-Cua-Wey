import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";

import bgMusic from "../../assets/music/garden.mp3";
import homeHeading from "../../assets/ui/home-heading.png";
import homeMusic from "../../assets/ui/home-music.png";
import homeBack from "../../assets/ui/home-back.png";

import Counter from "../../components/Home/Counter";
import SearchBar from "../../components/Home/SearchBar";
import TagFilter from "../../components/Home/TagFilter";
import LeafCard from "../../components/Home/LeafCard";
import RandomBroad from "../../components/Home/RandomBroad/RandomBroad";
import RankingBroad from "../../components/Home/RankingBroad/RankingBroad";
import CharacterPopup from "../../components/CharacterPopup/CharacterPopup";

import useCharacters from "../../hooks/useCharacters";
import { updateCharacter } from "../../services/characterService";


function Home() {

    const navigate = useNavigate();

    const audioRef = useRef(null);

    const randomBroadRef = useRef(null);

    const [

        characters,

        ,

        loadCharacters

    ] = useCharacters();

    const [

        playing,

        setPlaying

    ] = useState(false);

    const [

        selectedCharacter,

        setSelectedCharacter

    ] = useState(null);

    const [

        keyword,

        setKeyword

    ] = useState("");

    const [

        selectedTags,

        setSelectedTags

    ] = useState([]);

    const [

        visitCount,

        setVisitCount

    ] = useState(0);

    const [

        teaCount,

        setTeaCount

    ] = useState(0);

    // ================= MUSIC =================

    useEffect(() => {

        if (audioRef.current) {

            audioRef.current.volume = 0.35;

        }

    }, []);

    const toggleMusic = () => {

    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {

        audio.pause();

    }

    else {

        audio.play()

            .catch(console.error);

    }

    setPlaying(prev => !prev);

};

    // ================= VISIT =================

    useEffect(() => {

        let visit =

            Number(

                localStorage.getItem("visit")

            ) || 0;

        visit++;

        localStorage.setItem(

            "visit",

            visit

        );

        setVisitCount(visit);

    }, []);

    // ================= TEA =================

    useEffect(() => {

    const updateTea = () => {

        const tea =
            Number(localStorage.getItem("tea")) || 0;

        setTeaCount(tea);

    };

    updateTea();

    window.addEventListener(
        "teaChanged",
        updateTea
    );

    return () => {

        window.removeEventListener(
            "teaChanged",
            updateTea
        );

    };

}, []);

    

    // ================= POPUP =================

    const openPopup = (character) => {

    const updated = {

        ...character,

        views: (character.views || 0) + 1

    };

    // Popup mở ngay

    setSelectedCharacter(updated);

    // Firestore chạy nền

    updateCharacter(updated)

    .then(() => {

        loadCharacters();

    })

    .catch(error => {

        console.error(

            "Update views:",

            error

        );

    });

};

    const closePopup = () => {

    setSelectedCharacter(

        null

    );

    randomBroadRef.current?.reset();

};

    // ================= TAG =================

    
    
    const tags = useMemo(() => [

        "Tất cả",

        ...new Set(

            characters.flatMap(

    item => item.tags || []

)

        )

    ], [characters]);

        const toggleTag = (tag) => {

    if (tag === "Tất cả") {

        setSelectedTags([]);

        return;

    }

    setSelectedTags(prev => {

        if (prev.includes(tag)) {

            return prev.filter(

                item => item !== tag

            );

        }

        if (prev.length >= 3) {

            return prev;

        }

        return [

            ...prev,

            tag

        ];

    });

};

    // ================= FILTER =================

    const searchKeyword =

    keyword

        .trim()

        .toLowerCase();
    
    const filteredCharacters = useMemo(() => {

    return characters.filter(item => {

        const matchName =

            (item.name || "")

                .toLowerCase()

                .includes(searchKeyword);

        const matchTag =

            selectedTags.length === 0 ||

            selectedTags.every(tag =>

                (item.tags || [])

                    .includes(tag)

            );

        return matchName && matchTag;

    });

}, [

        characters,

        searchKeyword,

        selectedTags

    ]);

    // ================= JSX =================

    return (

        <div className={styles.container}>

            <audio

                ref={audioRef}

                src={bgMusic}

                loop

            />

            <img

                src={homeHeading}

                className={styles.heading}

                alt="Heading"

            />

            <Counter

                total={characters.length}

                visit={visitCount}

                tea={teaCount}

            />

            <SearchBar

                keyword={keyword}

                setKeyword={setKeyword}

            />

            <TagFilter

                tags={tags}

                selectedTags={selectedTags}

                toggleTag={toggleTag}

            />

            <div className={styles.broadSection}>

    <RandomBroad
        ref={randomBroadRef}
        characters={filteredCharacters}
        onOpen={openPopup}
    />

    <RankingBroad
        characters={characters}
        onOpen={openPopup}
    />

</div>


            <div className={styles.characterGrid}>

                {

                    filteredCharacters.map(character => (

                        <LeafCard

                            key={character.id}

                            character={character}

                            onClick={() =>

                                openPopup(character)

                            }

                        />

                    ))

                }

            </div>

            <CharacterPopup

    character={selectedCharacter}

    onClose={closePopup}

    onRefresh={loadCharacters}

/>

            <button

                className={styles.musicButton}

                onClick={toggleMusic}

            >

                <img

                    src={homeMusic}

                    alt=""

                />

                {

                    !playing &&

                    <span

                        className={styles.musicOff}

                    >

                        ✕

                    </span>

                }

            </button>

            <button

                className={styles.backButton}

                onClick={() =>

                    navigate("/")

                }

            >

                <img

                    src={homeBack}

                    alt="Back"

                />

            </button>

        </div>

    );

}

export default Home;