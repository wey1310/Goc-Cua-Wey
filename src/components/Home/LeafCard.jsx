import React from "react";
import styles from "../../pages/Home/Home.module.css";
import teaLeafCard from "../../assets/ui/tea-leaf-card.png";

function LeafCard({
    character,
    onClick
}) {
    const avatar =
        character.avatar ||
        "https://placehold.co/300x300?text=Avatar";

    const name =
        character.name ||
        "Chưa có tên";

    const tags =
        character.tags?.length
            ? character.tags.join(" • ")
            : "Chưa có tag";

    return (
        <div
            className={styles.characterCard}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            title={name}
        >
            {/* Base Tea Leaf Background Image */}
            <img
                src={teaLeafCard}
                className={styles.leafCard}
                alt="Tea Leaf"
                draggable={false}
            />

            {/* Character Avatar */}
            <img
                src={avatar}
                className={styles.avatar}
                alt={name}
                loading="lazy"
                draggable={false}
            />

            {/* Character Name */}
            <h2>
                {name}
            </h2>

            {/* Character Tags */}
            <p>
                {tags}
            </p>
        </div>
    );
}

export default React.memo(LeafCard);

