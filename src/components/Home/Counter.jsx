import styles from "../../pages/Home/Home.module.css";

import homeBoardCounter from "../../assets/ui/home-board-counter.png";

function Counter({

    total,

    visit,

    tea

}){

    const totalCount =

    Number(total || 0)

        .toLocaleString();

const visitCount =

    Number(visit || 0)

        .toLocaleString();

const teaCount =

    Number(tea || 0)

        .toLocaleString();

    return(

        <div className={styles.counterWrapper}>

            <img

    src={homeBoardCounter}

    className={styles.counterBoard}

    alt=""

    draggable={false}

/>

            <div className={styles.counterItem1}>

                <h2>

                    {totalCount}

                </h2>

                <p>

                    Lá trà hiện có

                    <br/>

                    tại vườn

                </p>

            </div>

            <div className={styles.counterItem2}>

                <h2>

                    {visitCount}

                </h2>

                <p>

                    Lượt ghé thăm

                    <br/>

                    khu vườn

                </p>

            </div>

            <div className={styles.counterItem3}>

                <h2>

                    {teaCount}

                </h2>

                <p>

                    Lượt thưởng trà

                </p>

            </div>

        </div>

    );

}

export default Counter;