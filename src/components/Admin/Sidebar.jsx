import React from "react";

import styles from "./Sidebar.module.css";

import LeafList from "./LeafList";

function Sidebar({

    characters,

    onSelect

}){

    const total = characters.length;

    return(

        <aside className={styles.container}>

            <div className={styles.header}>

                🍃 Danh sách Lá Trà

            </div>

            {

                total === 0 ? (

                    <div className={styles.empty}>

                        Chưa có Lá Trà nào

                    </div>

                ) : (

                    <div className={styles.list}>

    <LeafList
        characters={characters}
        onSelect={onSelect}
    />

</div>

                )

            }

            <div className={styles.footer}>

                <span>Tổng</span>

                <b>{total}</b>

                <span>Lá Trà</span>

            </div>

        </aside>

    );

}

export default React.memo(Sidebar);