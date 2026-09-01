import { useEffect } from "react";

import LeafCard from "../Home/LeafCard";

import styles from "./PreviewModal.module.css";

function PreviewModal({

    open,

    character,

    onClose

}) {

    // ================= ESC =================

    useEffect(() => {

        if (!open) return;

        setTimeout(() => {

    document
        .querySelector(`.${styles.closeButton}`)
        ?.focus();

}, 0);

        const handleKeyDown = (e) => {

            if (open && e.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener(
    "keydown",
    handleKeyDown
);

        const previousOverflow =
    document.body.style.overflow;

document.body.style.overflow =
    "hidden";

return () => {

            window.removeEventListener(
    "keydown",
    handleKeyDown
);

document.body.style.overflow =
        previousOverflow;

};

    }, [

        open,

        onClose

    ]);

    if (!open || !character) {

        return null;

    }
const noop = () => {};
    return (

        <div
    className={styles.overlay}
    role="dialog"
    aria-modal="true"

            onClick={onClose}

        >

            <div

                className={styles.content}

                onClick={(e) =>

                    e.stopPropagation()

                }

            >

                <h2>

                    👀 Xem trước Lá Trà

                </h2>

                <LeafCard

    character={character}

    onClick={noop}

/>

                <button

    type="button"

    className={styles.closeButton}

    aria-label="Đóng Preview"

    onClick={onClose}

>

                    ✕ Đóng

                </button>

            </div>

        </div>

    );

}

export default PreviewModal;