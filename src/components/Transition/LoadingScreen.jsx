import { useEffect, useState } from "react";

import styles from "./LoadingScreen.module.css";

import transitionMessages from "./transitionMessages";

import heading from "../../assets/ui/LoadingScreen.png";
import leaf from "../../assets/ui/tea-leaf-card.png";

function LoadingScene({

    loading,

    progress = 0

}) {

    const [

        message,

        setMessage

    ] = useState(

        transitionMessages[0]

    );

    useEffect(() => {

        if (!loading) {

            return;

        }

        setMessage(

            transitionMessages[

                Math.floor(

                    Math.random() *

                    transitionMessages.length

                )

            ]

        );

    }, [loading]);

    if (!loading) {

        return null;

    }

    return (

        <div className={styles.scene}>

            <div className={styles.light}></div>

            <div className={styles.leafLayer}>

                {

                    [...Array(12)].map((_, index) => (

                        <img

                            key={index}

                            src={leaf}

                            alt=""

                            className={styles.leaf}

                            style={{

                                left: `${Math.random() * 100}%`,

                                animationDelay: `${Math.random() * 6}s`,

                                animationDuration: `${10 + Math.random() * 5}s`

                            }}

                        />

                    ))

                }

            </div>

            <div className={styles.content}>

                <img

                    src={heading}

                    alt=""

                    className={styles.logo}

                    draggable={false}

                />

                <h2>

                    {message.title}

                </h2>

                <div className={styles.progressBar}>

                    <div

                        className={styles.progressFill}

                        style={{

                            width: `${progress}%`

                        }}

                    >

                        <img

                            src={leaf}

                            alt=""

                            className={styles.runner}

                            draggable={false}

                        />

                    </div>

                </div>

                <p>

                    {message.subtitle}

                </p>

                <span className={styles.percent}>

                    {Math.round(progress)}%

                </span>

            </div>

        </div>

    );

}

export default LoadingScene;