import styles from "../../pages/Home/Home.module.css";

import searchBox from "../../assets/ui/search-box.png";
import searchIcon from "../../assets/icon/search-icon.png";

function SearchBar({

    keyword,

    setKeyword

}){

    const handleChange = (e) => {

        setKeyword(

            e.target.value

        );

    };

    return(

        <div className={styles.searchArea}>

            <img

                src={searchBox}

                className={styles.searchBox}

                alt=""

                draggable={false}

            />

            <img

                src={searchIcon}

                className={styles.searchIcon}

                alt=""

                draggable={false}

            />

            <input

                className={styles.searchInput}

                placeholder="Tìm Lá Trà..."

                autoComplete="off"

                value={keyword}

                onChange={handleChange}

                onKeyDown={(e)=>{

                    if(e.key==="Escape"){

                        setKeyword("");

                    }

                }}

            />

        </div>

    );

}

export default SearchBar;