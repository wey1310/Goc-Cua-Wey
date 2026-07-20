import {

    forwardRef,

    useEffect,

    useImperativeHandle,

    useRef,

    useState

} from "react";

import styles from "./RandomBroad.module.css";

import broad from "../../../assets/ui/randombroad.png";
import randomBtn from "../../../assets/ui/random.png";

import frame01 from "../../../assets/effect/wey/frame01.png";
import frame02 from "../../../assets/effect/wey/frame02.png";
import frame03 from "../../../assets/effect/wey/frame03.png";
import frame04 from "../../../assets/effect/wey/frame04.png";
import frame05 from "../../../assets/effect/wey/frame05.png";
import frame06 from "../../../assets/effect/wey/frame06.png";
import frame07 from "../../../assets/effect/wey/frame07.png";
import frame08 from "../../../assets/effect/wey/frame08.png";
import frame09 from "../../../assets/effect/wey/frame09.png";
import frame10 from "../../../assets/effect/wey/frame10.png";
import frame11 from "../../../assets/effect/wey/frame11.png";
import frame12 from "../../../assets/effect/wey/frame12.png";
import randomSound from "../../../assets/music/randomsound.mp3";
import randomLeaf from "../../../assets/effect/random-leaf.webp";

const frames = [

    frame01,

    frame02,

    frame03,

    frame04,

    frame05,

    frame06,

    frame07,

    frame08,

    frame09,

    frame10,

    frame11,

    frame12

];

const FPS = 10;

const RandomBroad = forwardRef(({

    characters = [],

    onOpen

}, ref) => {

    const [

        phase,

        setPhase

    ] = useState("idle");

    const [

        frame,

        setFrame

    ] = useState(0);

    const [

        picked,

        setPicked

    ] = useState(null);

    const timerRef = useRef(null);
    const soundRef = useRef(null);
    useImperativeHandle(

        ref,

        () => ({

            reset() {

                clearInterval(

                    timerRef.current

                );

                timerRef.current = null;

                setFrame(0);
                setPicked(null);
                setPhase("idle");

            }

        })

    );

    function randomCharacter() {

        if (

            characters.length === 0

        ) {

            return null;

        }

        const index = Math.floor(

            Math.random() *

            characters.length

        );

        return characters[index];

    }

    

    function handleRandom() {

    if (soundRef.current) {

        soundRef.current.pause();

        soundRef.current.currentTime = 0;

        soundRef.current.volume = 0.45;

        soundRef.current.play().catch(console.error);

    }

    if (

        phase !== "idle"

    ) {

        return;

    }

    const character =

        randomCharacter();

    if (

        !character

    ) {

        return;

    }

    setPicked(

        character

    );

    setFrame(0);

    setPhase(

        "playing"

    );

}

    useEffect(() => {

        if (

            phase !== "playing"

        ) {

            return;

        }

        let current = 0;

        timerRef.current = setInterval(() => {

            current++;

            setFrame(

                current

            );

            if (

                current >=

                frames.length - 1

            ) {

                clearInterval(

                    timerRef.current

                );

                timerRef.current = null;

                setTimeout(() => {

                    setPhase(

                        "leaf"

                    );

                }, 120);

            }

        }, 1000 / FPS);

        return () => {

            clearInterval(

                timerRef.current

            );

        };

    }, [

        phase

    ]);

    function handleLeafAnimationEnd() {

        if (

            picked &&

            onOpen

        ) {

            setPhase(

                "waiting"

            );

            onOpen(

                picked

            );

        }

    }

    return (

        <div className={styles.container}>

            <img

                src={broad}

                className={styles.board}

                alt="Random Board"

            />

            <button
    className={styles.randomButton}
    onClick={handleRandom}
    disabled={phase !== "idle"}
>

    <img
        src={randomBtn}
        alt="Random"
    />

</button>

            {

                phase !== "leaf" &&

                phase !== "waiting" && (

                    <img

                        src={frames[frame]}

                        className={styles.wey}

                        alt="Wey"

                    />

                )

            }

            {

                (

                    phase === "leaf" ||

                    phase === "waiting"

                ) && (

                    <img

                        src={randomLeaf}

                        className={styles.flyLeaf}

                        alt="Leaf"

                        onAnimationEnd={

                            phase === "leaf"

                                ?

                                handleLeafAnimationEnd

                                :

                                undefined

                        }

                    />

                )

            }

            <audio

    ref={soundRef}

    src={randomSound}

    preload="auto"

/>

        </div>


        


    );

});

export default RandomBroad;