import { useMemo } from "react";
import styles from "./Dashboard.module.css";

function Dashboard({ characters }) {

    const dashboardStats = useMemo(() => {

        const total = characters.length;

        const totalViews = characters.reduce(
            (sum, item) => sum + Number(item.views || 0),
            0
        );

        const totalTags = new Set(
            characters.flatMap(
                item => item.tags || []
            )
        ).size;

        const totalGGAI = characters.filter(
            item => item.ggai
        ).length;

        const totalPlot = characters.filter(
            item => item.plot
        ).length;

        // ================= Most Viewed =================

        const mostViewed = characters.reduce(

            (best, current) =>

                (current.views || 0) >

                (best?.views || 0)

                    ? current

                    : best,

            null

        );

        // ================= Top Tag =================

        const tagCounter = Object.create(null);

        characters.forEach(item => {

            (item.tags || []).forEach(tag => {

                tagCounter[tag] =
                    (tagCounter[tag] || 0) + 1;

            });

        });

        const topTag = Object.entries(tagCounter).reduce(

            (best, current) =>

                !best ||

                current[1] > best[1]

                    ? current

                    : best,

            null

        );

        return {

            total,
            totalViews,
            totalTags,
            totalGGAI,
            totalPlot,
            mostViewed,
            topTag

        };

    }, [characters]);

    const {

        total,
        totalViews,
        totalTags,
        totalGGAI,
        totalPlot,
        mostViewed,
        topTag

    } = dashboardStats;

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <div className={styles.icon}>🍃</div>

                <h2>{total}</h2>

                <p>Lá Trà</p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>👁</div>

                <h2>{totalViews.toLocaleString()}</h2>

                <p>Lượt xem</p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>🏷</div>

                <h2>{totalTags}</h2>

                <p>Tag</p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>🍵</div>

                <h2>{totalGGAI}</h2>

                <p>GGAI</p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>📖</div>

                <h2>{totalPlot}</h2>

                <p>Plot</p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>⭐</div>

                <h2>

                    {mostViewed ? mostViewed.name : "-"}

                </h2>

                <p>

                    Lá trà nổi bật

                </p>

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>🔥</div>

                <h2>

                    {topTag ? topTag[0] : "-"}

                </h2>

                <p>

                    Top Tag

                </p>

            </div>

        </div>

    );

}

export default Dashboard;