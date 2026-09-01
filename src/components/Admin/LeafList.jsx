import styles from "./LeafList.module.css";

function LeafList({

    characters,

    onSelect

}){

    const DEFAULT_AVATAR =
    "https://placehold.co/300x300?text=Avatar";

    return(

        <div className={styles.container}>

            {

        characters.map(character=>{

    const avatar =
        character.avatar || DEFAULT_AVATAR;

    const name =
        character.name || "Chưa có tên";

    const tags =
        character.tags?.length
            ? character.tags.join(" • ")
            : "Chưa có tag";

    const views =
        character.views || 0;

    return (

        <div
            key={character.id}
            className={styles.item}
            onClick={()=>onSelect(character)}
        >

            <img
                src={avatar}
                className={styles.avatar}
                alt=""
            />

            <div className={styles.info}>

                <h3>{name}</h3>

                <p>{tags}</p>

                <span>
                    👁 {views}
                </span>

            </div>

        </div>

    );

        })

            }

        </div>

    );

}

export default LeafList;