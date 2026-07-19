import styles from "../../pages/Home/Home.module.css";

import tagTemplate from "../../assets/ui/tag-template.png";

function TagFilter({

    tags,

    selectedTags,

    toggleTag

}){

    return(

        <div className={styles.tagContainer}>

            {

                tags.map(tag => {

                    const isActive =

                        selectedTags.includes(tag);

                    return (

                        <button

                            key={tag}

                            type="button"

                            aria-pressed={isActive}

                            className={

                                isActive

                                    ? styles.activeTag

                                    : styles.tag

                            }

                            onClick={() => toggleTag(tag)}

                        >

                            <img

                                src={tagTemplate}

                                alt=""

                                draggable={false}

                            />

                            <span>

                                {tag}

                            </span>

                        </button>

                    );

                })

            }

        </div>

    );

}

export default TagFilter;