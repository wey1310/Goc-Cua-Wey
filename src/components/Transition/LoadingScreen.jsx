import { useEffect, useState } from "react";

import styles from "./LoadingScreen.module.css";

import transitionMessages from "./transitionMessages";

import heading from "../../assets/ui/LoadingScreen.png";
import leaf from "../../assets/ui/tea-leaf-card.png";

function LoadingScene({

    loading

}) {

    const [

        progress,

        setProgress

    ] = useState(0);

    const [

        message,

        setMessage

    ] = useState(

        transitionMessages[0]

    );

    useEffect(() => {

    if (!loading) {

        setProgress(0);

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

    const duration = 3000;

    const start = performance.now();

    let frame;

    let lastProgress = 0;

    const animate = (now) => {

        const elapsed = now - start;

        const t = Math.min(

            elapsed / duration,

            1

        );

        // Tiến độ cơ bản
        let target = t * 100;

        // Dao động để tạo cảm giác load thật
        const wave =

            Math.sin(t * 18) * 3 +

            Math.sin(t * 42) * 1.2;

        target += wave;

        // Không vượt quá tiến độ thực quá nhiều
        target = Math.min(

            target,

            t * 100 + 2

        );

        // Không bao giờ lùi
        target = Math.max(

            target,

            lastProgress

        );

        // Giữ lại chút ở cuối
        if (

            t < 0.95 &&

            target > 96

        ) {

            target = 96;

        }

        lastProgress = target;

        setProgress(target);

        if (t < 1) {

            frame = requestAnimationFrame(

                animate

            );

        } else {

            setProgress(100);

        }

    };

    frame = requestAnimationFrame(

        animate

    );

    return () => {

        cancelAnimationFrame(

            frame

        );

    };

}, [loading]);





    if (!loading) return null;

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

                        />

                    </div>

                </div>

                <p>

                    {message.subtitle}

                </p>

            </div>

        </div>

    );

}

export default LoadingScene;