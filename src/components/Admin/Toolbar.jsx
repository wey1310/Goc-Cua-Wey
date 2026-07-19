import styles from "./Toolbar.module.css";

function Toolbar({

    search,

    setSearch,

    onAdd

}){

    return(

        <div className={styles.container}>

            <input

                className={styles.search}

                placeholder="🔍 Tìm theo tên, tag, quote..."

                value={search}

                onChange={(e)=>

                    setSearch(e.target.value)

                }

            />

            <button

                className={styles.addButton}

                onClick={onAdd}

            >

                ➕ Thêm Lá Trà

            </button>

        </div>

    );

}

export default Toolbar;