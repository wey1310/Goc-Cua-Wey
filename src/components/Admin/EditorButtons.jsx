import styles from "./EditorButtons.module.css";

function EditorButtons({

    onSave,

    onDelete,

    onDuplicate,

    onPreview,

    saving = false

}) {

    const isDisabled = saving;

    return (

        <div className={styles.container}>

            <button

                type="button"

                className={`${styles.save} ${saving ? styles.loading : ""}`}

                onClick={() => {

    if (!saving) {

        onSave();

    }

}}

                disabled={isDisabled}

                title="Lưu Lá Trà"

            >

                <>
    {saving ? "⏳" : "💾"}{" "}
    {saving ? "Đang lưu..." : "Lưu"}
</>

            </button>

            <button

                type="button"

                className={styles.delete}

                onClick={onDelete}

                disabled={isDisabled}

                title="Xóa Lá Trà"

            >

                🗑 Xóa

            </button>

            <button

                type="button"

                className={styles.copy}

                onClick={onDuplicate}

                disabled={isDisabled}

                title="Nhân bản"

            >

                📋 Nhân bản

            </button>

            <button

                type="button"

                className={styles.preview}

                onClick={onPreview}

                disabled={isDisabled}

                title="Xem trước"

            >

                👁 Preview

            </button>

        </div>

    );

}

export default EditorButtons;