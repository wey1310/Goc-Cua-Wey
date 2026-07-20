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
import randomGif from "../../../assets/effect/wey/random.gif";
import randomSound from "../../../assets/music/randomsound.mp3";
import randomLeaf from "../../../assets/effect/random-leaf.webp";


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

    

    setPhase(

        "playing"

    );

}

    useEffect(() => {

    if (phase !== "playing") {

        return;

    }

    const timer = setTimeout(() => {

        setPhase("leaf");

    }, 300);

    return () => clearTimeout(timer);

}, [phase]);

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

    src={
        phase === "playing"
            ? randomGif
            : frame01
    }

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