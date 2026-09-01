import { useMemo } from "react";

import styles from "./RankingBroad.module.css";

import board from "../../../assets/ui/rankingbroad.png";

import top1 from "../../../assets/ui/top1.png";
import top2 from "../../../assets/ui/top2.png";
import top3 from "../../../assets/ui/top3.png";

const frames = [top1, top2, top3];

function RankingBroad({

    characters = [],

    onOpen

}){

    const ranking = useMemo(()=>{

        return characters

            .filter(

                character => character.ggai?.trim()

            )

            .sort(

                (a,b)=>

                    (b.ggaiClick || 0) -

                    (a.ggaiClick || 0)

            )

            .slice(0,3);

    },[characters]);

    const slots=[

        ranking[0] || null,

        ranking[1] || null,

        ranking[2] || null

    ];

    return(

        <div className={styles.container}>

            <img
                src={board}
                className={styles.board}
                alt="Ranking"
            />

            <div className={styles.content}>

                {

                    slots.map((character,index)=>(

                        <button

                            key={index}

                            className={styles.card}

                            disabled={!character}

                            onClick={()=>{
                                if(character){
                                    onOpen(character);
                                }
                            }}

                        >

                            {

                                character && (

                                    <img

                                        src={character.avatar}

                                        className={styles.avatar}

                                        alt={character.name}

                                    />

                                )

                            }

                            <img

                                src={frames[index]}

                                className={styles.frame}

                                alt={`Top ${index+1}`}

                            />

                            {

                                character && (

                                    <p className={styles.name}>

                                        {character.name}

                                    </p>

                                )

                            }

                        </button>

                    ))

                }

            </div>

        </div>

    );

}

export default RankingBroad;